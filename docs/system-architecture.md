# System Architecture — VIB SmartSales Platform

> Kiến trúc chung cho tất cả microservice trong nền tảng SmartSales.
> Mỗi service follow đúng pattern này — chỉ khác nhau ở domain logic và tên class.

---

## 1. Platform Overview

```
[Frontend SPA] → [API Gateway / APIM]
    ├──► {service-name}   ← mỗi service là một ASP.NET Core Web API độc lập
    ├──► {service-name}
    └──► ...

[Shared Infrastructure]
    PostgreSQL · SQL Server (legacy) · Redis · RabbitMQ
    Azure: Blob Storage · Key Vault · App Insights
```

**Microservice principles:**
- Mỗi service: domain riêng, DB schema riêng (`{service}_schema`)
- Giao tiếp nội bộ: RabbitMQ (async) hoặc HTTPS qua APIM (sync)
- Giao tiếp nội bộ auth: RabbitMQ RPC — không validate JWT cục bộ

---

## 2. Layered Architecture

```
┌──────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                  │
│   Controllers/  (ASP.NET Core Web API)                │
│   Middlewares/  (RequestHandlerMiddleware)            │
│   Attributes/   (ValidAuthorize, ValidateModel)       │
└────────────────────────┬─────────────────────────────┘
                         │ DI (Interface-based)
┌────────────────────────▼─────────────────────────────┐
│                   APPLICATION LAYER                   │
│   Services/BusinessService/  (domain logic)          │
│   Services/RabbitMQService/  (messaging)             │
│   Services/RedisCacheService/ (caching)              │
└────────────────────────┬─────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────┐
│                   DATA ACCESS LAYER                   │
│   Repositories/  (Dapper — PostgreSQL + SQL Server)  │
│   DapperContext  (Npgsql connection factory)         │
└────────────────────────┬─────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────┐
│               INFRASTRUCTURE / EXTERNAL               │
│   PostgreSQL (primary DB + pgvector optional)         │
│   SQL Server (legacy/on-prem data)                    │
│   Redis (StackExchange.Redis)                         │
│   RabbitMQ (RabbitMQ.Client)                          │
│   Azure Blob Storage                                  │
│   Azure Key Vault                                     │
│   APIM / CP4I Gateways (external API calls)           │
└──────────────────────────────────────────────────────┘
```

---

## 3. Request Lifecycle

```
HTTP Request
    │
    ▼
RequestHandlerMiddleware
    ├── Capture request body, start stopwatch
    ├── Log request info (Application Insights)
    │
    ▼
ValidAuthorizeAttribute (Authorization Filter)
    ├── Extract Bearer token
    ├── Send to RabbitMQ auth queue
    ├── Receive AuthenticationResponse (Role, UserName, BranchCode)
    ├── Validate role against allowed roles
    └── Inject claims into HttpContext.User
    │
    ▼
Controller Action
    ├── Validate model state → ValidationFailedResult if invalid
    ├── Extract UserInfo via User.GetUserInfo()
    └── Call Service(s)
    │
    ▼
Service Layer
    ├── Business logic
    ├── Call Repository / External APIs
    └── Return Result<T>
    │
    ▼
Controller → Return Response<T>
    │
    ▼
RequestHandlerMiddleware
    ├── Capture response body
    ├── Log response + duration
    └── Handle exceptions → standardized error Response<T>
```

---

## 4. Dependency Injection Scopes

| Scope | Loại component |
|-------|----------------|
| **Singleton** | Configuration, Redis, RabbitMQ connection/manager |
| **Scoped** | Tất cả Business Services và Repositories (per-request) |
| **Transient** | Stateless utilities (Cryptography, PDF/file helpers) |
| **Hosted** | Background consumers (RabbitMQ listeners, cron jobs) |

---

## 5. Configuration Architecture

```
Azure Key Vault (sensitive secrets)
    KEY_VAULT_*_USER / *_PASSWORD   → DB, RabbitMQ, Redis credentials
    KEY_VAULT_*_KEY / *_SECRET      → API keys, encryption keys
    KEY_VAULT_*_CONNECTION_STRING   → connection strings nếu có

Environment Variables (non-sensitive)
    ENVIRONMENT                     → DEV / UAT / PROD
    SERVICE_NAME
    KEY_VAULT_URI
    ENV_*_HOST / *_PORT / *_DB      → infrastructure endpoints
    ENV_*_TIMEOUT                   → timeout settings
    APPINSIGHTS_INSTRUMENTATIONKEY
```

- `I{Service}Configuration` cache values qua `IMemoryCache` — tránh gọi Key Vault liên tục
- `IsNonProd` flag bật extra logging (full headers, response body) ở DEV/UAT

---

## 6. Error Handling

```
Custom Exceptions:
├── AppException         → Generic app error (500)
├── CustomException      → Business rule violation (with code)
└── UnauthorizedException → Auth failure (401/403)

RequestHandlerMiddleware catches all exceptions:
├── UnauthorizedException → HTTP 401, Response with error code
├── AppException         → HTTP 500, Response with sys message
├── Other exceptions      → HTTP 500, generic error response
└── All logged to Application Insights
```

**Standard response envelope:**
```json
{
  "type": 0,
  "code": "00",
  "message": "Thành công",
  "messageSys": null,
  "data": { ... }
}
```
- `type`: `0` = Success, `1` = Fail
- `code`: Error code from `{Service}Resource.resx`

---

## 7. External Integrations

| Service | Protocol | Dùng cho |
|---------|---------|---------|
| **RabbitMQ Auth** | AMQP (RPC) | JWT token validation (mọi service) |
| **PostgreSQL** | TCP (Npgsql/Dapper) | Primary DB |
| **SQL Server** | TCP (SqlClient/Dapper) | Legacy on-prem data |
| **Redis** | TCP | Session cache, token cache |
| **Azure Blob** | HTTPS | File attachments, documents |
| **Azure Key Vault** | HTTPS | Secret management |
| **APIM (Azure)** | HTTPS | External banking APIs |
| **CP4I Cloud/OnPrem** | HTTPS | IBM integration platform APIs |
| **MS Teams Webhook** | HTTPS | Alert notifications |
| **Email (SMTP)** | SMTP | Email sending |

> Service-specific integrations (ITSM, Google Maps, CIS...) được define trong `codebase-summary.md` của từng service.
