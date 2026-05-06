# Code Standards — Naming, Structure & Rules

> Quy tắc đặt tên, cấu trúc file, no-magic-values, git conventions và AI/Copilot rules.
> Xem patterns thực tế: `code-patterns.md` | Principles áp dụng: `YAGNI · KISS · DRY · SOLID`

**Design Principles — Mapping**

| Principle | Áp dụng trong project |
|-----------|----------------------|
| **YAGNI** — chỉ build những gì có requirement rõ | Không tạo interface/helper cho feature chưa có; không thêm param chưa dùng |
| **KISS** — đơn giản nhất đủ làm việc | File ≤ 200 lines; method ≤ 30 lines; tránh over-abstraction |
| **DRY** — không lặp lại logic/text | Logic lặp → helper/extension; text → `{Service}Resource`; pattern → base class |
| **SRP** — mỗi class một lý do thay đổi | Controller / Service / Repository có responsibility riêng biệt |
| **DIP** — depend on abstractions | Inject `IXyzService`, `IXyzRepository` — không `new` concrete trong class |
| **OCP** — open for extension, closed for modification | Thêm feature qua interface mới, không sửa class đang hoạt động |

---

## 1. Naming Conventions

### Namespace & Class
```csharp
// Namespace: PascalCase, khớp folder path
namespace VIB.SmartSales.{ServiceName}.Services.BusinessService

// Class: PascalCase
public class XyzService : IXyzService

// Interface: prefix I + PascalCase
public interface IXyzService
public interface I{Service}Configuration
```

### Methods
```csharp
// Public methods: PascalCase, Verb + Noun
public async Task<Result<PagedList<XyzListResult>>> GetPageAsync(...)

// Async methods: MUST end with Async suffix
public async Task<T> GetByIdAsync(...)   // ✅
public async Task<T> GetById(...)        // ❌
```

### Variables & Fields
```csharp
var userInfo = User.GetUserInfo();                        // local: camelCase
public async Task<Result<T>> GetAsync(string userId, ...) // param: camelCase
private readonly ILogger<XyzService> _logger;             // field: _camelCase
public const string AUTH_QUEUE = "smart-sales.vib...";   // const: UPPER_SNAKE_CASE
```

### Database Parameters (PostgreSQL)
```csharp
// Stored function parameters: snake_case với prefix p_
var parameters = new {
    p_user_id = userId,
    p_page_num = pageNum,
    p_page_size = pageSize
};
```

---

## 2. Project Structure

### File placement
```
Controllers/        → Action methods only, no business logic
Services/           → Business logic, orchestration
Repositories/       → Data access (SQL queries) only
Models/Request/     → Input DTOs from client
Models/Responses/   → Output DTOs returned to client
Models/Results/     → DB result models (mapped from stored procs)
Models/Commons/     → Shared models across service
Constants/          → String constants — no hardcoding
```

### New feature checklist
When adding feature `Xyz`:
```
Models/Request/Xyz/       → XyzRequest.cs
Models/Responses/Xyz/     → XyzResponse.cs
Models/Results/Xyz/       → XyzResult.cs  (if DB result needed)
Repositories/             → IXyzRepository.cs + XyzRepository.cs
Services/BusinessService/ → IXyzService.cs + XyzService.cs
Controllers/              → XyzController.cs
Constants/                → XyzConstants.cs  (if new constants)
```

### File size rule
- **Max 200 lines per file**
- If exceeds: split into focused components, extract helpers, separate service classes

---

## 3. No Magic Values

> **Không hardcode string/số literal** trong logic — đặt tên rõ ràng qua constant, enum, hoặc resource.

### Chọn loại container

| Loại | Dùng khi | Ví dụ |
|------|----------|-------|
| `const` trong `*Constants.cs` | Giá trị cố định từ nghiệp vụ / 3rd party | `CisConstants.CIS_STATUS_CODE_SUCCESS` |
| `enum` | Tập giá trị đóng, biểu diễn trạng thái | `ResponseBasicType.Success`, `HttpAuthType.Bearer` |
| `{Service}Resource.resx` | Message/error code hiển thị cho user | `XyzResource.NOT_FOUND_MSG` |
| `I{Service}Configuration` | Giá trị thay đổi theo môi trường | URL, timeout, feature flag |

### Rules

```csharp
// ❌
if (status == "ACTIVE") ...
return Result<T>.Fail("ERR001", "Không tìm thấy");
cmd.CommandTimeout = 30;

// ✅
if (status == XyzConstants.ACTIVE_STATUS) ...
return Result<T>.Fail(XyzResource.NOT_FOUND, XyzResource.NOT_FOUND_MSG);
cmd.CommandTimeout = int.Parse(_config.SqlServerTimeOut);
```

**Khi nào dùng enum vs constant:**
- **Enum** — tập đóng, thay đổi cùng code: trạng thái, loại auth, loại response
- **Constant** — do hệ thống ngoài quy định: API code, queue name, stored proc name
- **Resource** — text hiển thị cho user (hỗ trợ i18n)

**Convention đặt file:** `Constants/XyzConstants.cs` (per feature), `Constants/{Service}Constants.cs` (dùng chung)

---

## 4. Async/Await Rules

```csharp
var result = await _service.GetAsync(id);                          // ✅ always await
var data = await connection.QueryAsync<T>(sql, p);                 // ✅
var result = _service.GetAsync(id).Result;                         // ❌ deadlock risk
_service.DoAsync().Wait();                                         // ❌
```

---

## 5. Logging

```csharp
// Structured templates — NOT string interpolation
_logger.LogInformation("Processing {Count} leads for {Branch}", count, branch);
_logger.LogError(ex, "DB failed for {Function} user {UserId}", fnName, userId);
// LogDebug → DEV only | LogInformation → Normal | LogWarning → Handled | LogError → Failure+ex
// ❌ Never log sensitive data: token, password, personal data
```

---

## 6. Git & PR Conventions

### Branch naming
```
feature/TICKET-123-short-description
bugfix/TICKET-456-fix-description
hotfix/TICKET-789-critical-fix
```

### Commit format
```
feat(xyz): add bulk assign API
fix(xyz): handle null attachment
refactor(auth): extract role validation helper
```

### PR checklist
- [ ] **YAGNI** — không có code/interface/param chưa có requirement
- [ ] **KISS** — method ≤ 30 lines, class ≤ 200 lines
- [ ] **DRY** — không duplicate logic; dùng `{Service}Resource` cho text
- [ ] **SRP** — controller/service/repository không lẫn responsibility
- [ ] Unit tests cho business logic mới
- [ ] No hardcoded secrets; every endpoint có `[ValidAuthorize]`
- [ ] Error codes từ `{Service}Resource`; DB functions theo `fn_{entity}_{action}`
- [ ] No dead code hoặc commented-out blocks

---

## 7. AI / Copilot Rules

Follow **YAGNI/KISS/DRY/SOLID** — generate only what's asked, simplest solution, no duplicate logic.

1. **Namespace** — always `VIB.SmartSales.{ServiceName}.*`
2. **DB** — PostgreSQL: `fn_*` via Dapper, no inline SQL
3. **Response** — `ResponseEx.Success/Fail<T>`, never `new Response<T> { ... }`
4. **Config** — `I{Service}Configuration`, never raw `IConfiguration`
5. **Auth** — `[ValidAuthorize("roles")]` on every new endpoint
6. **DI** — `ServiceStartup.cs` only; Scoped service, Scoped repo, Singleton config
7. **No magic values** — `{Service}Resource.resx` for messages, `*Constants.cs` for codes
8. **Layers** — Controller → Service → Repository (SRP, DIP — no skipping layers)
9. **Async** — all DB/HTTP async, method names end `Async`
10. **Logging** — structured templates, no interpolation, no PII
