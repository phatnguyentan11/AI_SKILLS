# ASP.NET Core — Middleware, Config, Validation & Exceptions

> Request pipeline, configuration, validation và error handling.
> Xem thêm: `aspnet-setup.md`, `aspnet-controllers.md`

---

## 1. Middleware Pipeline

### RequestHandlerMiddleware

Xử lý request/response logging và exception handling — đặt đầu pipeline:

```csharp
public async Task InvokeAsync(HttpContext httpContext)
{
    // Skip /health endpoints — no logging
    if (features.RawTarget.Contains("health")) { await _next(httpContext); return; }

    var stopWatch = Stopwatch.StartNew();
    var properties = new Dictionary<string, string>
    {
        { "RequestId", Guid.NewGuid().ToString() },
        { "Method", httpContext.Request.Method },
        { "Path", httpContext.Request.Path },
        { "RequestBody", await ReadBodyFromRequest(httpContext.Request) },
    };

    // Capture response body
    using var newResponseBody = new MemoryStream();
    httpContext.Response.Body = newResponseBody;

    try { await _next(httpContext); }
    catch (UnauthorizedException ex)
    {
        httpContext.Response.StatusCode = 401;
        await WriteErrorResponse(httpContext, ex.Message);
    }
    catch (AppException ex)
    {
        httpContext.Response.StatusCode = 500;
        await WriteErrorResponse(httpContext, ex.Message, isSys: true);
    }
    catch (Exception ex)
    {
        httpContext.Response.StatusCode = 500;
        await WriteErrorResponse(httpContext, {Service}Resource.SYSTEM_ERROR_MSG);
        _logger.LogError(ex, "Unhandled exception");
    }
    finally
    {
        stopWatch.Stop();
        properties["Duration"] = stopWatch.ElapsedMilliseconds + "ms";
        _logger.LogInformation("Request completed {@Properties}", properties);
        await newResponseBody.CopyToAsync(originalResponseBody);
    }
}
```

**Registration order in Program.cs:**
```csharp
app.UseRouting();
app.UseMiddleware<RequestHandlerMiddleware>();  // First
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
```

**NoLogs Pattern** — skip logging for high-frequency/health endpoints:
```csharp
if (_config.NoLogsMiddlewares.Any(x => path.Contains(x.Path)))
    { await _next(httpContext); return; }
```

## 2. Configuration Pattern

### I{Service}Configuration

```csharp
public interface I{Service}Configuration
{
    string ServiceName { get; }
    string Env { get; }
    bool IsNonProd { get; }       // DEV or UAT
    string NpgsqlConnection { get; }
    string SqlServerConnection { get; }
    string RabbitHostName { get; }
    string RedisHost { get; }
    string BlobConnectionString { get; }
    List<NoLogsMiddleware> NoLogsMiddlewares { get; }
}

public class {Service}Configuration : I{Service}Configuration
{
    // From env vars (non-sensitive)
    public string ServiceName => GetValueCacheKeyEnv("SERVICE_NAME");

    // From Azure Key Vault (sensitive)
    public string PostGresPassword => GetValueCacheKeyVault("KEY_VAULT_POSTGRES_{SERVICE}_PASSWORD");

    // Composite — built from parts
    public string NpgsqlConnection =>
        $"Host={GetEnv("POSTGRES_HOST")};Port={GetEnv("POSTGRES_PORT")};...";
}
```

**Env var naming:**
| Prefix | Type | Example |
|--------|------|---------|
| `ENV_*` | Non-sensitive | `ENV_REDIS_HOST`, `ENV_SQL_SERVER_DATABASE` |
| `KEY_VAULT_*` | Secrets via KV | `KEY_VAULT_REDIS_PASSWORD` |
| _(no prefix)_ | Infrastructure | `ENVIRONMENT`, `SERVICE_NAME`, `KEY_VAULT_URI` |

**Rules:**
- Inject `I{Service}Configuration`, **never** `IConfiguration` directly
- Secrets always from Key Vault — never in env vars or code

---

## 3. Validation

### Data Annotations (model-level)
```csharp
public class XyzListRequest
{
    [Required]
    public string BranchCode { get; set; } = null!;

    [Range(1, int.MaxValue)]
    public int PageNum { get; set; } = 1;

    [Range(1, 100)]
    public int PageSize { get; set; } = 20;
}
```

### ValidationFailedResult — custom 400 response
Returns `Response<T>` format (not default `ProblemDetails`):
```csharp
// Registered in Program.cs:
options.InvalidModelStateResponseFactory = context =>
    new ValidationFailedResult(context.ModelState);
```

### Custom validation attributes
```csharp
// Attributes/ValidDateFormatAttribute.cs — date format validation
[ValidDateFormat("dd/MM/yyyy")]
public string StartDate { get; set; }

// Validations/ValidateSafeInput.cs — XSS/injection protection
[ValidateSafeInput]
public string SearchText { get; set; }
```

## 4. Exception Types

```csharp
// Commons/Exceptions/

// Generic app/system error → HTTP 500
public class AppException : Exception
{
    public AppException(string message) : base(message) { }
    public AppException(string message, params object[] args)
        : base(String.Format(CultureInfo.CurrentCulture, message, args)) { }
}

// Business rule violation with error code → HTTP 400/422
public class CustomException : Exception
{
    public string ErrorCode { get; }
    public CustomException(string errorCode, string message) : base(message)
        => ErrorCode = errorCode;
}

// Auth failure → HTTP 401
public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message) : base(message) { }
}
```

**Usage rules:**
```csharp
// ✅ Always typed exceptions
throw new AppException("Processing failed: {0}", detail);
throw new UnauthorizedException(ACCESS_DENIED_MSG);

// ❌ Never throw raw Exception
throw new Exception("something went wrong");

// ✅ Only catch when handling specifically
catch (NpgsqlException ex)
{
    _logger.LogError(ex, "DB error in {Function}", fnName);
    return Result<T>.Fail(DB_ERROR);
}
```
