# Codebase Summary — VIB.SmartSales.ToolsService (myss-tools)

> **Mục đích tài liệu:** Cung cấp tổng quan nhanh về codebase cho AI agent (GitHub Copilot, v.v.) để hiểu đúng project trước khi sinh code hoặc review.

---

## 1. Thông tin tổng quan

| Mục | Giá trị |
|-----|---------|
| **Service name** | `VIB.SmartSales.ToolsService` |
| **Namespace gốc** | `VIB.SmartSales.ToolsService` |
| **Framework** | .NET 8 — ASP.NET Core Web API |
| **Route prefix** | `/myss-tools/api` |
| **Loại service** | Internal microservice — VIB SmartSales platform |
| **Ngôn ngữ chính** | C# 12 |

---

## 2. Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| **Web framework** | ASP.NET Core 8 |
| **ORM / DB access** | Dapper (raw SQL, stored procedures) |
| **Database chính** | PostgreSQL 15+ với **pgvector** (RAG embeddings) |
| **Database phụ** | SQL Server (legacy data — ODS, CIS history) |
| **Cache** | Redis (StackExchange.Redis) |
| **Message broker** | RabbitMQ (RabbitMQ.Client 6.8.1) |
| **Blob storage** | Azure Blob Storage |
| **Secret management** | Azure Key Vault |
| **PDF generation** | WkHtmlToPdf (WkHtmlToPdfDotNet) |
| **Excel** | ClosedXML |
| **CSV** | CsvHelper |
| **HTTP client** | RestSharp 112 + System.Net.Http |
| **Serialization** | Newtonsoft.Json (primary), System.Text.Json |
| **Monitoring** | Application Insights |
| **API docs** | Swagger / Swashbuckle |

---

## 3. Cấu trúc thư mục

```
VIB.SmartSales.ToolsService/
├── Attributes/              # Custom attributes (JsonEmptyToNull, ValidDateFormat, ValidateAppKey)
├── Commons/
│   ├── Exceptions/          # AppException, CustomException, UnauthorizedException
│   ├── Extensions/          # Extension methods (String, Date, IEnumerable, Dapper, Npgsql, Redis...)
│   ├── Generators/          # RedisGenerator
│   ├── Helpers/             # ApiHelper, Cryptography, PDFHelper, ValidAuthorizeAttribute
│   └── Resources/           # ToolsResource.resx (error codes & messages)
├── Configurations/          # IToolsConfiguration, ToolsConfiguration (Azure KV + env vars)
├── Constants/               # Domain constants (Auth, Chat, CIC, CIS, Redis, RabbitMQ...)
├── Controllers/             # API controllers
├── Converter/               # JSON converters (DateOnly, EmptyStringToNull)
├── Interfaces/              # IInboxSender, IPushNotificationSender
├── Mapper/                  # AutoMapper profiles
├── Middlewares/             # RequestHandlerMiddleware (logging + exception handling)
├── Models/
│   ├── Commons/             # Shared models (Result<T>, Response<T>, Authentication...)
│   ├── Enums/               # Application enums
│   ├── Request/             # Request DTOs (per feature module)
│   ├── Responses/           # Response DTOs (per feature module)
│   └── Results/             # DB result models
├── Repositories/            # Data access layer (Dapper-based)
├── Services/
│   ├── ApimGwService/       # APIM Gateway service
│   ├── BlobFileService/     # Azure Blob operations
│   ├── BusinessService/     # Core business logic services
│   ├── Cp4iServices/        # IBM CP4I cloud service
│   ├── EmailService/        # Email sending
│   ├── NewApimService/      # New APIM integration
│   ├── OdsService/          # ODS (Operational Data Store)
│   ├── RabbitMQService/     # RabbitMQ consumers & producers
│   ├── RedisCacheService/   # Redis cache abstraction
│   └── TeamsWorkflowService/ # MS Teams webhook alerts
├── Startups/                # ServiceStartup.cs (DI registration)
└── Validations/             # FluentValidation validators
```

---

## 4. Controllers & Endpoints

| Controller | Route prefix | Chức năng chính |
|------------|-------------|-----------------|
| `CisController` | `/myss-tools/api/1.0/cis` | Customer Information System queries |
| `CicLeadController` | `/myss-tools/api/1.0/cic-lead` | CIC lead management (list, assign, import CSV) |
| `CNAToolController` | `/myss-tools/api/1.0/cna-tool` | CNA tool (create, update, list, send email) |
| `AmlController` | `/myss-tools/api/1.0/aml` | AML/KYC score check |
| `DcsController` | `/myss-tools/api/1.0/dcs` | DCS (Debt Collection System) |
| `EInvoiceController` | `/myss-tools/api/1.0/einvoice` | Electronic invoice lifecycle |
| `GeoInfoController` | `/myss-tools/api/1.0/geo-info` | Google Maps / geo info |
| `InfohelpController` | `/myss-tools/api/1.0/infohelp` | FAQ / ratings |
| `OdsController` | `/myss-tools/api/1.0/ods` | ODS debt / RBC management |
| `ToolsController` | `/myss-tools/api/1.0/tools` | Static data, config, utilities |
| `HealthController` | `/health` | Health check (no auth) |
| `TestController` | `/myss-tools/api/test` | Dev/test only endpoints |

---

## 5. Authentication & Authorization

- **Auth mechanism:** JWT Bearer token validated qua **RabbitMQ** (not local JWT parse)
- **Flow:** `ValidAuthorizeAttribute` → gửi token + route lên queue `smart-sales.vib.authentication.v2` → nhận `AuthenticationResponse` với `Role`, `UserName`, `BranchCode`, `StaffCode`
- **Role-based access:** Attribute `[ValidAuthorize("RM,RMC,PB,...")]` trên từng action
- **User info in request:** Lưu vào `ClaimsPrincipal` → truy xuất qua `User.GetUserInfo()`

**Roles hiện tại:**
`RM`, `RMC`, `PB`, `PRM`, `SM`, `PBM`, `BM`, `RME`, `TRSMAKER`, `TRSCHECKER`, `CA`, `AMCA`, `WSM`, `FS`, `FSM`

---

## 7. Configuration & Secrets

| Nguồn | Dùng cho |
|-------|---------|
| **Environment variables** (`ENV_*`) | Non-sensitive: host, port, database name, service name |
| **Azure Key Vault** (`KEY_VAULT_*`) | Sensitive: passwords, connection strings, API keys |

**Key config properties (IToolsConfiguration):**
- `NpgsqlConnection` — PostgreSQL connection string
- `SqlServerConnection` — SQL Server connection string
- `RabbitHostName`, `RabbitVirtualHost`, `RabbitPort` — RabbitMQ
- `RedisHost`, `RedisPort`, `RedisPassword` — Redis
- `BlobConnectionString` — Azure Blob


---

## 8. Database Patterns

### PostgreSQL (pgvector)
- **Schema:** `myss_tools`
- **Convention:** Tất cả queries đều gọi **stored functions** (`fn_*`)
- **Pattern:** `DapperContext.CreateConnection()` → `QueryAsync<T>(fn_name, params)`
- **Example:** `SELECT * FROM myss_tools.fn_ai_chat_attachment_get(@p_user_id, @p_id)`
- **Vector column:** Dùng `Pgvector.Vector` type với `VectorTypeHandler`

### SQL Server
- **Via:** `SqlRepository` (Dapper + `Microsoft.Data.SqlClient`)
- **Dùng cho:** CIS history, ODS debt, static data, profiles

---

## 9. RabbitMQ Consumers

| Consumer | Queue/Exchange | Chức năng |
|----------|---------------|-----------|
| `AutoAssignLeadConsumer` | lead assignment queue | Tự động gán lead cho RM |
| `ConsumerImportLeadService` | import lead queue | Import lead từ CSV |
| `AlertTeamsWebhookConsumer` | teams alert queue | Gửi alert lên MS Teams |

---

## 10. Test Project

```
VIB.SmartSales.ToolsService.Tests/
```
- Unit test project (xUnit)
- Test từng service/repository độc lập
- Mock dependencies bằng Moq hoặc tương đương

---

## 11. Key Dependencies

```xml
Npgsql                             10.0.2
Dapper                             2.1.35
StackExchange.Redis                2.7.33
RabbitMQ.Client                    6.8.1
Microsoft.Data.SqlClient           6.1.4
Azure.Security.KeyVault.Secrets    4.6.0
Azure.Storage.Blobs                12.23.0
Newtonsoft.Json                    13.0.3
RestSharp                          112.0.0
Microsoft.ApplicationInsights      2.23.0
ClosedXML                          0.105.0
```
