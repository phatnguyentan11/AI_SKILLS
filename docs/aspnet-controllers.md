# ASP.NET Core — Controllers, Auth & Responses

> Controller patterns, authentication flow, và Response/Result types.
> Xem thêm: `aspnet-setup.md`, `aspnet-middleware.md`

## 1. Controller Pattern

```csharp
[Route("{service-name}/api")]   // mỗi service định nghĩa prefix riêng, không đổi
[ApiController]
public class XyzController : ControllerBase
{
    private readonly IXyzService _xyz;

    public XyzController(IXyzService xyz) { _xyz = xyz; }

    [HttpGet("1.0/xyz/list")]
    [ValidAuthorize("RM,RMC,SM,BM")]
    public async Task<Response<PagedList<XyzListResult>>> GetListAsync([FromQuery] XyzListRequest req)
    {
        var user = User.GetUserInfo()!;
        var result = await _xyz.GetListAsync(user.UserName!, req);
        if (result.IsFailure) return ResponseEx.Fail<PagedList<XyzListResult>>(result.ErrorCode, result.ErrorMessage);
        return ResponseEx.Success(result.Value);
    }
}
```

**Rules:**
- Route prefix theo tên service: `[Route("{service-name}/api")]` — mỗi service set một lần, không thay đổi
- Versioning trong action route: `"1.0/resource/action"`
- **Mọi action phải có** `[ValidAuthorize("roles")]`
- Controller không chứa business logic — chỉ delegate sang service
- Trả về `Response<T>` qua `ResponseEx` — không dùng `new Response<T> { ... }` thủ công
- `User.GetUserInfo()` để lấy thông tin user đã authenticated

**HTTP verb conventions:**

> API mới phải theo **RESTful** — dùng đúng HTTP verb + noun-based resource path.
> Legacy endpoints dùng `safe-update`, `create` suffix được giữ nguyên, không refactor.

```csharp
// ✅ RESTful (áp dụng cho API mới)
[HttpGet("1.0/xyz")]                // list
[HttpGet("1.0/xyz/{id}")]          // get by id
[HttpPost("1.0/xyz")]              // create
[HttpPut("1.0/xyz/{id}")]          // full update
[HttpPatch("1.0/xyz/{id}")]        // partial update
[HttpDelete("1.0/xyz/{id}")]       // delete

// ⚠️ Legacy (giữ nguyên, không đổi)
[HttpGet("1.0/xyz/list")]
[HttpPost("1.0/xyz/create")]
[HttpPost("1.0/xyz/safe-update")]
```

**RESTful naming rules:**
- Resource path: **danh từ số nhiều**, kebab-case: `cic-leads`, `loan-products`
- Không dùng động từ trong path: ❌ `/get-list`, ❌ `/create-new`
- Sub-resource: `GET 1.0/xyz/{id}/details`
- Action không map được vào CRUD: dùng POST + noun: `POST 1.0/xyz/{id}/approval`

---

## 2. Authentication & Authorization

### ValidAuthorizeAttribute — RabbitMQ-based auth

Token không validate cục bộ — gửi qua RabbitMQ đến auth service (RPC pattern):

- Queue: `smart-sales.vib.authentication.v2`
- Gửi Bearer token → nhận `AuthenticationResponse` (IsValid, Role, UserName, BranchCode, StaffCode)
- Nếu invalid hoặc role không khớp → throw `UnauthorizedException` → middleware trả HTTP 401
- Inject vào `ClaimsPrincipal` để controller lấy qua `User.GetUserInfo()`

**Accessing authenticated user in controllers:**
```csharp
var user = User.GetUserInfo()!;
// user.UserName, user.Role, user.BranchCode, user.StaffCode
```

**Usage:**
```csharp
[ValidAuthorize("RM,RMC,PB,SM,BM")]  // Comma-separated, no spaces
// HealthController — không cần [ValidAuthorize]
```

---

## 3. Response & Result Types

### Response\<T\> — HTTP response envelope

```csharp
public enum ResponseBasicType { Success = 0, Fail = 1 }

public class Response<T> : Response { public T? Data { get; set; } }

public class Response
{
    public int Type { get; set; }           // 0=Success, 1=Fail
    public string Code { get; set; }        // từ {Service}Resource.resx (resource file của service)
    public string Message { get; set; }     // user-facing message
    public string? MessageSys { get; set; } // system message (non-prod only)
}
```

**JSON output:** `{ "type": 0, "code": "00", "message": "Thành công", "data": { ... } }`

### ResponseEx — Factory methods (dùng thay cho new Response\<T\> thủ công)

```csharp
// Commons/Extensions/ResponseEx.cs
ResponseEx.Success<T>(data)          // type=0, code=ERRORCODE_SUCCESS
ResponseEx.Fail<T>(errorCode, msg)   // type=1, custom code+message
```

### Controller — mapping Result → Response

```csharp
// ✅ Preferred: dùng ResponseEx
var result = await _service.GetAsync(id);
if (result.IsFailure)
    return ResponseEx.Fail<XyzData>(result.ErrorCode, result.ErrorMessage);
return ResponseEx.Success(result.Value);

// ❌ Không viết thủ công new Response<T> { Type=..., Code=..., ... }
```

### Result\<T\> — Service layer (Railway-oriented)

```csharp
public static Result<T> Success(T data) => new(true, data);
public static Result<T> Fail(string code, string? msg = null) => new(false, default, code, msg);

// Functional combinators
Result<TOut> Map<TOut>(Func<T, TOut> map)       // transform value nếu Success
Result<TOut> Bind<TOut>(Func<T, Result<TOut>> next) // chain Result nếu Success
```

---

## 4. Clean Code Rules — Controllers

### Controller chỉ làm 3 việc

```
1. Validate input (Data Annotations + ModelState — tự động qua middleware)
2. Delegate sang service
3. Map Result<T> → Response<T> bằng ResponseEx
```

**Cấm trong controller:**
- ❌ Business logic, if/else theo dữ liệu
- ❌ Gọi repository trực tiếp
- ❌ Gọi HttpClient / external API
- ❌ Transform/mapping data (dùng service hoặc extension)
- ❌ Try/catch (để middleware xử lý)
- ❌ `new Response<T> { Type=..., Code=... }` thủ công — dùng `ResponseEx`

### Validate — chỉ ở boundary, không trong service

```csharp
// ✅ Dùng Data Annotations trên model — middleware tự trả 400
public class XyzRequest
{
    [Required] public string BranchCode { get; set; } = null!;
    [Range(1, 100)] public int PageSize { get; set; } = 20;
}

// ❌ Không validate lại trong service
public async Task<Result<T>> GetAsync(XyzRequest req)
{
    if (string.IsNullOrEmpty(req.BranchCode)) // ← không cần, đã validate ở controller
```

### Không trộn lẫn concerns

```csharp
// ✅ Controller đúng — mỏng, rõ ràng
[HttpGet("1.0/xyz/list")]
[ValidAuthorize("RM,RMC")]
public async Task<Response<PagedList<XyzResult>>> GetListAsync([FromQuery] XyzListRequest req)
{
    var user = User.GetUserInfo()!;
    var result = await _xyzService.GetListAsync(user.UserName!, req);
    if (result.IsFailure) return ResponseEx.Fail<PagedList<XyzResult>>(result.ErrorCode, result.ErrorMessage);
    return ResponseEx.Success(result.Value);
}

// ❌ Controller sai — logic trộn vào
public async Task<Response<XyzResult>> GetAsync(string id)
{
    if (id.Length != 10) return ResponseEx.Fail<XyzResult>("INVALID", "ID phải 10 ký tự");
    var data = await _repo.GetByIdAsync(id);   // gọi repo trực tiếp
    if (data.Status == "INACTIVE") return ...;  // business rule trong controller
    ...
}
```
