# API Gateway Integration — ApiHelper

> Hệ thống tích hợp với **Nhiều API Gateway** — mỗi gateway có service riêng, đều dùng `ApiHelper` + `IHttpClientFactory`.
> **Không** dùng `HttpClient` trực tiếp trong service.

## Các Gateway Hiện Tại

| Gateway | Service Class | Auth | Dùng cho |
|---------|--------------|------|----------|
| **APIM (Azure)** | `ApimGwService` | `StaticHeaders` (Subscription Key) | ITSM, internal tools |
| **CP4I Cloud** | `Cp4ICloudService` | OAuth2 Bearer (client credentials, scope) | CIC check, bankhub APIs |
| **CP4I OnPrem** | `NewApimService` | Basic Auth | ODS, AML, on-prem ESB |
| **New APIM** | `NewApimService` | Basic Auth | OnPrem V2 endpoints |

> Khi thêm gateway mới: tạo service class riêng trong `Services/`, tạo `Init*Helper()` private method, đăng ký DI trong `ServiceStartup.cs`.

---

## 1. Khởi tạo — trong Gateway Service class

```csharp
// Services/ApimGwService/ApimGwService.cs
private static ApiHelper InitItsmApimHelper(
    IHttpClientFactory httpClientFactory,
    ILogger logger,
    I{Service}Configuration config)
{
    var http = httpClientFactory.CreateClient();
    http.BaseAddress = new Uri(config.ItsmApimDomain);               // URL từ config
    http.Timeout = TimeSpan.FromMilliseconds(timeout);

    // Gateway-level default auth (áp dụng cho mọi request qua helper này)
    var gatewayDefaultAuth = HttpAuth.StaticHeaders(new Dictionary<string, string>
    {
        ["Ocp-Apim-Subscription-Key"] = config.ItsmApimSubscriptionKey
    });

    return new ApiHelper(http, logger, config, gatewayDefaultAuth);
}
```

### Gọi API — GET

```csharp
var resp = await apiHelper.SendAsync<ItsmGenerateApiKeyResponse>(
    HttpMethod.Get,
    _config.UrlGenerateApiKey,
    callAuth: new List<HttpAuth> { HttpAuth.Basic(username, password) },
    queryParams: new Dictionary<string, string> { ["userid"] = userId },
    isSecurityEnabled: true,  // ẩn response body khi prod
    ct: ct);

if (resp.IsFailure)
    throw new CustomException(resp.ErrorCode, resp.ErrorMessage, resp.SecondMessage);

var data = resp.Value!;
```

### Gọi API — POST JSON

```csharp
var json = JsonConvert.SerializeObject(request);
var content = new StringContent(json, Encoding.UTF8, "application/json");

var resp = await apiHelper.SendAsync<ItsmCreateRequestApiResponse>(
    HttpMethod.Post,
    _config.UrlItsmCreateRequest,
    content,
    callAuth: new List<HttpAuth> { HttpAuth.StaticHeaders(new Dictionary<string, string>
        { ["x-api-key"] = apiToken }) },
    requestBodyForLog: request,  // ghi log request body
    ct: ct);
```

### Gọi API — POST Multipart (file upload)

```csharp
using var content = new MultipartFormDataContent();
content.Add(new StringContent(systemType), "system_type");
foreach (var file in files)
{
    var sc = new StreamContent(file.OpenReadStream());
    sc.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);
    content.Add(sc, "files", file.FileName);
}

var resp = await apiHelper.SendAsync<ItsmUploadFilesResponse>(
    HttpMethod.Post, _config.UrlItsmUploadFile, content, auths, ct: ct);
```

### HttpAuth — Các loại xác thực

```csharp
HttpAuth.None                                // không auth
HttpAuth.Bearer(token)                       // Authorization: Bearer {token}
HttpAuth.Basic(username, password)           // Authorization: Basic base64(u:p)
HttpAuth.ApiKey("api_key", key)              // query string: ?api_key={key}
HttpAuth.StaticHeaders(dict)                 // custom headers (Ocp-Apim-Subscription-Key, x-api-key...)
```

**Auth layering**: `defaultAuth` (gateway-level) + `callAuth` (per-request) được apply theo thứ tự.

---

## 2. Xử Lý Response

`ApiHelper.SendAsync` luôn trả về `Result<T>` — không throw exception ra ngoài.

### Pattern chuẩn trong Gateway Service

```csharp
var resp = await apiHelper.SendAsync<XyzResponse>(HttpMethod.Post, path, content, auths, ct: ct);

// ❌ Không trả thẳng Result từ ApiHelper lên controller
// ✅ Unwrap và map sang Result<T> của business layer
if (resp.IsFailure)
    return Result<XyzData>.Fail(resp.ErrorCode!, resp.ErrorMessage, resp.SecondMessage);

return Result<XyzData>.Success(resp.Value!);
```

### Một số gateway có response envelope riêng — phải unwrap thêm

```csharp
// CP4I: response body có StatusCode + Data bên trong
if (response.Data?.StatusCode == CisConstants.CIS_STATUS_CODE_SUCCESS)
    return Result<TData>.Success(response.Data.Data);
return Result<TData>.Fail(response.Data?.StatusCode, response.Data?.StatusMessage);

// CIS (APIM): tương tự — kiểm tra STATUSCODE của payload, không phải HTTP status
if (response.Data?.STATUSCODE == CisConstants.CIS_STATUS_CODE_SUCCESS)
    return Result<T>.Success(response.Data.DATA);
return Result<T>.Fail(response.Data.STATUSCODE, response.Data.STATUS_MESSAGE);
```

### Khi cần throw (chỉ trong flow bắt buộc có dữ liệu)

```csharp
// Ví dụ: lấy API key — nếu fail thì không thể tiếp tục
if (resp.IsFailure)
    throw new CustomException(resp.ErrorCode, resp.ErrorMessage, resp.SecondMessage);
```

> **Quy tắc**: chỉ `throw` khi failure là điều kiện chặn toàn bộ flow (không thể tiếp tục).
> Với business logic thông thường — trả `Result.Fail` để controller xử lý.

---

## 3. Logging

`ApiHelper` tự log `Log3rd` object (Name, Domain, Method, Path, StatusCode, DueTime, Request, Response).

- **Non-prod**: log full response + headers
- **Prod + `isSecurityEnabled: true`**: response bị ẩn `[omitted]`
- **Lỗi HTTP (non-2xx)**: log responseBody, trả về `Result.Fail` với `APIGW_FAILED`
- **Exception**: log exception, trả về `Result.Fail` với `EXCEPTION`

---

## 4. Exception Handling

### ApiHelper — nội bộ đã wrap

`ApiHelper.SendAsync` không throw ra ngoài — tất cả exception được catch và map sang `Result.Fail`:

| Lỗi xảy ra | ErrorCode trả về | Ghi chú |
|-----------|-----------------|--------|
| HTTP non-2xx (4xx, 5xx) | `APIGW_FAILED` | ResponseBody được log |
| `HttpRequestException` (network) | `EXCEPTION` | Exception được log |
| `TaskCanceledException` (timeout/cancel) | `EXCEPTION` | Kiểm tra `ct.IsCancellationRequested` để phân biệt |
| `JsonException` (deserialize fail) | `EXCEPTION` | Response body không khớp với `T` |

> **Không cần try/catch khi gọi `apiHelper.SendAsync`** — kiểm tra `result.IsFailure` thay thế.

### Gateway Service — catch có chọn lọc

Chỉ catch khi có hành động xử lý riêng; để exception khác propagate lên middleware:

```csharp
// ✅ Chỉ catch timeout cụ thể — nếu cần xử lý riêng
try
{
    var resp = await apiHelper.SendAsync<T>(method, path, content, auths, ct: ct);
    if (resp.IsFailure) return Result<T>.Fail(resp.ErrorCode!, resp.ErrorMessage);
    return Result<T>.Success(resp.Value!);
}
catch (OperationCanceledException) when (!ct.IsCancellationRequested)
{
    // Timeout của HttpClient (không phải user cancel)
    _logger.LogWarning("Gateway timeout for {Path}", path);
    return Result<T>.Fail(XyzResource.TIMEOUT_ERROR);
}
// ❌ Không catch Exception chung — để middleware xử lý
```

### Timeout — cấu hình và nhận diện

```csharp
// Khi khởi tạo HttpClient trong Init*Helper():
http.Timeout = TimeSpan.FromMilliseconds(config.ExternalApiTimeoutMs);

// Phân biệt timeout vs user cancellation
catch (OperationCanceledException)
{
    if (ct.IsCancellationRequested)
        return Result<T>.Fail(XyzResource.REQUEST_CANCELLED);  // user/request cancel

    _logger.LogWarning("Timeout calling {Path}", path);
    return Result<T>.Fail(XyzResource.TIMEOUT_ERROR);           // HttpClient timeout
}
```

### Error Code Mapping — từ gateway về internal

Không expose raw error code của gateway lên controller — map về internal code:

```csharp
// ❌ Không dùng error code raw từ gateway ("APIGW_FAILED" lọt lên UI)
if (resp.IsFailure)
    return Result<T>.Fail(resp.ErrorCode!, resp.ErrorMessage);

// ✅ Map về internal code có ý nghĩa với business
if (resp.IsFailure)
{
    return resp.ErrorCode switch
    {
        "APIGW_FAILED" when resp.HttpStatusCode == 404
            => Result<T>.Fail(XyzResource.NOT_FOUND),
        "APIGW_FAILED" when resp.HttpStatusCode == 401
            => Result<T>.Fail(XyzResource.UNAUTHORIZED),
        _   => Result<T>.Fail(XyzResource.EXTERNAL_SERVICE_ERROR)
    };
}
```

> **Rule**: Error code trả về cho user luôn từ `{Service}Resource.resx` — không từ gateway response.

### OAuth2 Token — refresh khi 401

Với gateway dùng OAuth2 (ví dụ: CP4I Cloud), token expire → gateway trả 401 → refresh và retry:

```csharp
var resp = await apiHelper.SendAsync<T>(method, path, content, auths, ct: ct);

// Token expired → refresh và retry một lần
if (resp.IsFailure && resp.HttpStatusCode == 401)
{
    await RefreshTokenAsync(ct);
    resp = await apiHelper.SendAsync<T>(method, path, content, BuildAuthWithNewToken(), ct: ct);
}

if (resp.IsFailure) return Result<T>.Fail(XyzResource.EXTERNAL_SERVICE_ERROR);
return Result<T>.Success(resp.Value!);
```

> Chỉ retry **một lần** sau khi refresh token. Không retry lỗi network hay 5xx — tránh cascade failure.

---

## 5. Rules

1. **KHÔNG** gọi `new HttpClient()` trong service — luôn dùng `IHttpClientFactory`
2. Mọi URL đều từ `I{Service}Configuration` — không hardcode
3. Mọi secret (subscription key, password, api key) từ Key Vault — không từ appsettings
4. Mọi call trả về `Result<T>` — không throw exception từ gateway service
5. Token/API key cần cache Redis với TTL theo `expires_in` trả về từ auth endpoint
6. Dùng `isSecurityEnabled: true` khi response chứa PII hoặc sensitive data
