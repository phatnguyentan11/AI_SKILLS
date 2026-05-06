# ASP.NET Core — Setup & DI

> Program.cs wiring và Dependency Injection patterns — áp dụng cho mọi service trong platform.
> Xem thêm: `aspnet-controllers.md`, `aspnet-middleware.md`

---

## 1. Program.cs

Giữ tối giản — chỉ wire startup, không chứa logic:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Model validation → custom Response<T> format
builder.Services.AddControllers().ConfigureApiBehaviorOptions(options =>
{
    options.InvalidModelStateResponseFactory = context =>
        new ValidationFailedResult(context.ModelState);
});

// Global authorization filter
builder.Services.AddControllers(config =>
{
    config.Filters.Add<ValidAuthorizeAttribute>();
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(...);

// All DI registration delegated to ServiceStartup
ServiceStartup.RegisterExtensions(builder);
ServiceStartup.RegisterRepository(builder.Services);
ServiceStartup.RegisterServices(builder.Services);

var app = builder.Build();
app.UseMiddleware<RequestHandlerMiddleware>();
app.MapControllers();
app.Run();
```

**Rules:**
- `Program.cs` chỉ chứa app wiring — không `services.AddScoped<>` trực tiếp
- Mọi DI registration vào `Startups/ServiceStartup.cs`

---

## 2. Dependency Injection — ServiceStartup.cs

```csharp
public static class ServiceStartup
{
    // Infrastructure / cross-cutting (Azure, Redis, RabbitMQ, HttpClient...)
    public static void RegisterExtensions(WebApplicationBuilder builder) { ... }

    // Repositories only (SRP: tách riêng với services)
    public static void RegisterRepository(IServiceCollection services)
    {
        services.AddScoped<IXyzRepository, XyzRepository>();
        // ...
    }

    // Application services
    public static void RegisterServices(IServiceCollection services)
    {
        // Singleton — stateless, shared app lifetime
        services.AddSingleton<I{Service}Configuration, {Service}Configuration>();
        services.AddSingleton<IRedisCacheService, RedisCacheService>();
        services.AddSingleton<IRabbitManager, RabbitManager>();

        // Scoped — one instance per HTTP request
        services.AddScoped<IXyzService, XyzService>();

        // Transient — new instance every injection
        services.AddTransient<Cryptography>();

        // Hosted services (background workers / RabbitMQ consumers)
        services.AddHostedService<XyzConsumer>();
    }
}
```

### DI Scope Rules

| Scope | Dùng khi | Ví dụ |
|-------|---------|-------|
| `Singleton` | Stateless, thread-safe, expensive to create | Config, Redis, RabbitMQ connection |
| `Scoped` | State per HTTP request | Services, Repositories |
| `Transient` | Lightweight, stateless utilities | Helpers, converters |
| `Hosted` | Background long-running workers | RabbitMQ consumers |

### ⚠️ Anti-pattern — Captive Dependency

Không inject `Scoped` vào `Singleton` — runtime error:

```csharp
// ❌ Scoped captured in singleton
public class MySingleton { public MySingleton(IScopedService s) { } }

// ✅ Use IServiceScopeFactory
public class MySingleton
{
    private readonly IServiceScopeFactory _factory;
    public MySingleton(IServiceScopeFactory factory) { _factory = factory; }

    public async Task DoWorkAsync()
    {
        using var scope = _factory.CreateScope();
        var svc = scope.ServiceProvider.GetRequiredService<IScopedService>();
        await svc.DoAsync();
    }
}
```

### Swagger Setup

```csharp
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization", Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer", BearerFormat = "JWT", In = ParameterLocation.Header
    });
    c.AddSecurityRequirement(...);
    c.EnableAnnotations();
    c.DescribeAllParametersInCamelCase();
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFile));
});

// Route theo tên service — mỗi service có prefix riêng
app.UseSwagger(c =>
{
    c.RouteTemplate = "{service-name}/swagger/{documentName}/swagger.json";
});
```

Documenting endpoints:
```csharp
/// <summary>Get paginated list</summary>
[HttpGet("1.0/xyz/list")]
[SwaggerOperation(Summary = "Get list", Tags = new[] { "Xyz" })]
public async Task<Response<PagedList<XyzResult>>> GetListAsync(...)
```
