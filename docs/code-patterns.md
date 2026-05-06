# Code Patterns — Service Layer

> Service pattern, DI scope rules và security rules.
> Principles: **SRP** (layer separation) · **DIP** (inject interfaces) · **DRY** (no duplicate logic) · **KISS** (simplest solution)
> Controller pattern → `aspnet-controllers.md` | DB/Repository pattern → `aspnet-database.md`

---

## 1. Service Pattern

> **SRP**: Service chỉ chứa business logic — không routing, không SQL, không HTTP call trực tiếp.
> **DIP**: Depend on `IXyzRepository`, `IGatewayService` — không `new` concrete.
> **DRY**: Logic dùng lại nhiều nơi → extract private method hoặc helper extension.

```csharp
public class XyzService : IXyzService
{
    private readonly ILogger<XyzService> _logger;
    private readonly IXyzRepository _repo;

    public XyzService(ILogger<XyzService> logger, IXyzRepository repo)
    {
        _logger = logger;
        _repo = repo;
    }

    public async Task<Result<XyzData>> GetAsync(string id)
    {
        if (string.IsNullOrEmpty(id))
            return Result<XyzData>.Fail(XyzResource.INVALID_INPUT);

        var data = await _repo.GetByIdAsync(id);
        if (data == null)
            return Result<XyzData>.Fail(XyzResource.NOT_FOUND);

        return Result<XyzData>.Success(data);
    }
}
```

**Rules:**
- `Result<T>` — không trả `Response<T>` (SRP: controller lo mapping)
- Không catch exception trừ khi xử lý cụ thể — middleware handle (SRP)
- Không gọi HTTP trực tiếp — qua gateway service (DIP + SRP)
- Không validate lại input đã có Data Annotations (DRY)
- Inject `ILogger<T>` cho logic phức tạp — không dùng `Console.Write`

### Orchestration — gọi nhiều service/repo

```csharp
public async Task<Result<XyzSummary>> GetSummaryAsync(string id)
{
    var entity = await _repo.GetByIdAsync(id);
    if (entity == null) return Result<XyzSummary>.Fail(XyzResource.NOT_FOUND);

    var extra = await _externalService.GetDetailsAsync(id);
    if (extra.IsFailure) return Result<XyzSummary>.Fail(extra.ErrorCode, extra.ErrorMessage);

    return Result<XyzSummary>.Success(new XyzSummary(entity, extra.Value!));
}
```

**Service không được (vi phạm SRP/DIP/DRY):**
- ❌ Tự tạo `Response<T>` — chỉ `Result<T>` (SRP)
- ❌ Gọi trực tiếp `SqlConnection` / `DapperContext` — qua repository (SRP + DIP)
- ❌ Validate input đã validate ở controller (DRY)
- ❌ Duplicate logic đã có ở service khác — inject service đó thay vì copy (DRY)
- ❌ Thêm method/param chưa có requirement (YAGNI)

### KISS — phương thức đơn giản, một mục đích

```csharp
// ❌ Method làm quá nhiều việc (vi phạm KISS + SRP)
public async Task<Result<XyzData>> ProcessAsync(string id, bool sendNotif, bool updateCache) { ... }

// ✅ Tách rõ — caller tự orchestrate
public async Task<Result<XyzData>> GetAsync(string id) { ... }
public async Task SendNotificationAsync(string id) { ... }
public async Task InvalidateCacheAsync(string id) { ... }
```

---

## 2. DI Scope — Quick Reference

> **DIP**: Inject interface — không `new ServiceClass()` trong constructor hay method.
> **KISS**: Dùng scope đơn giản nhất đủ dùng — không Singleton khi cần Scoped.

| Scope | Dùng khi | Ví dụ |
|-------|---------|-------|
| `Singleton` | Stateless, thread-safe | Config, Redis, RabbitMQ |
| `Scoped` | State per HTTP request | Services, Repositories |
| `Transient` | Lightweight stateless | Helpers, Cryptography |
| `Hosted` | Background workers | RabbitMQ consumers |

```csharp
// In ServiceStartup.cs only — never Program.cs
services.AddSingleton<I{Service}Configuration, {Service}Configuration>();
services.AddScoped<IXyzService, XyzService>();
services.AddScoped<IXyzRepository, XyzRepository>();
services.AddTransient<Cryptography>();
```

---

## 3. Security Rules

> Đây là **non-negotiable** — không YAGNI cho security.

1. **No hardcoded secrets** — từ `I{Service}Configuration` (Key Vault / env vars)
2. **`[ValidAuthorize]`** trên mọi endpoint (trừ `/health`)
3. **Validate input** ở controller boundary — Data Annotations hoặc `Validations/`
4. **No PII in logs** — không log token, password, dữ liệu cá nhân
5. **Dùng `Cryptography` class** cho AES encryption — không tự implement crypto
6. **Parameterized queries only** — Dapper `@param` — không concatenate string vào SQL

