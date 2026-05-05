---
name: ASP.NET Core Standards
description: C# coding conventions, ASP.NET Core patterns, Dapper, Redis, RabbitMQ, and project structure rules
applyTo: "**/*.cs,**/*.csproj,**/*.razor,**/*.cshtml,**/*.sln"
---

# ASP.NET Core Code Standards

## C# Conventions
- Target .NET 8+. Use file-scoped namespaces, `global using` where appropriate.
- Prefer `readonly` fields. Use `record` types for immutable DTOs.
- Private fields: `_camelCase`. Parameters/locals: `camelCase`. Types/Methods: `PascalCase`.
- Interfaces: `I` prefix (`IUserRepository`). Constants files: `{Feature}Constants.cs`.
- Use `async/await` consistently. Suffix async methods with `Async`. Never use `.Result` or `.Wait()`.
- Never use `.Result` or `.Wait()` on `Task` — always `await`.

## Project Structure (N-Tier)
```
{Service}/
  Controllers/        ← Endpoints, authorization attributes
  Services/
    BusinessService/  ← Feature services (IXxxService / XxxService)
  Repositories/       ← Dapper data access (IXxxRepository / XxxRepository)
  Models/
    Request/          ← Input DTOs ({Action}Request)
    Responses/        ← Output DTOs ({Entity}Response)
    Results/          ← Internal result types
    Enums/            ← Enumerations
  Commons/
    Extensions/       ← Extension methods ({Type}Ex.cs)
    Helpers/          ← Utility classes
    Exceptions/       ← Custom exception types
  Constants/          ← {Feature}Constants.cs files
  Configurations/     ← IToolsConfiguration + ToolsConfiguration
  Middlewares/        ← RequestHandlerMiddleware
  Attributes/         ← Custom ASP.NET attributes
  Validations/        ← Custom model validators
  Startups/           ← DI registration extension methods
```

## Controller Rules
```csharp
[ApiController]
[Route("myss-tools/api")]
public class FeatureController : ControllerBase
{
    private readonly IFeatureService _service;

    public FeatureController(IFeatureService service) => _service = service;

    [ValidAuthorize("ROLE1,ROLE2")]
    [HttpGet("1.0/feature")]
    public async Task<Response<FeatureDto>> GetFeature([Required] string param)
        => await _service.GetFeatureAsync(param);
}
```
- Thin controllers — delegate all logic to service layer.
- Versioning via URL prefix: `1.0/{resource}`.
- Authorization via `[ValidAuthorize("ROLE1,ROLE2")]` custom attribute.
- Always return `Response<T>` or `ResponseDataExt<T>` wrapper — never raw objects.
- Use `[Required]` on mandatory query/route parameters.

## Service Layer
```csharp
public class FeatureService : IFeatureService
{
    private readonly IFeatureRepository _repo;
    private readonly IRedisCacheService _cache;
    private readonly ILogger<FeatureService> _logger;

    public async Task<Response<FeatureDto>> GetFeatureAsync(string param)
    {
        var cached = await _cache.GetAsync<FeatureDto>($"FEATURE:{param}");
        if (cached != null) return new Response<FeatureDto> { Type = "success", Code = "200", Data = cached };

        var data = await _repo.FeatureGetByParamAsync(param);
        await _cache.SetAsync($"FEATURE:{param}", data, TimeSpan.FromMinutes(10));
        return new Response<FeatureDto> { Type = "success", Code = "200", Data = data };
    }
}
```
- Check Redis cache before calling repository.
- Return `Response<T>` from all public methods.
- Use `ILogger<T>` — never `Console.Write`.

## Repository Layer (Dapper)
```csharp
public class FeatureRepository : IFeatureRepository
{
    private readonly DapperContext _context;
    private readonly TelemetryClient _telemetry;

    public async Task<List<FeatureDto>> FeatureGetByParamAsync(string param)
    {
        List<FeatureDto> rs = new();
        try
        {
            using var connection = _context.CreateConnection();
            await connection.OpenAsync();
            const string sql = "SELECT * FROM schema.sp_get_feature @ip_param";
            var result = await connection.QueryAsync<FeatureDto>(sql,
                new { ip_param = param }, commandType: CommandType.Text);
            rs = result.ToList();
        }
        catch (Exception ex)
        {
            _telemetry.TrackException(ex);
            throw;
        }
        return rs;
    }
}
```
- Input parameter prefix: `@ip_` (e.g., `@ip_code`, `@ip_role`).
- Always `await connection.OpenAsync()` before queries.
- Catch exceptions, track via `TelemetryClient`, then re-throw.
- SQL strings as `const string` — never interpolated with user data.

## Configuration
- All config via `IToolsConfiguration` — never inject raw `IConfiguration` in services.
- Environment variables: app name, DB hosts, ports, service endpoints.
- Azure Key Vault: passwords, API keys, connection credentials.
- `appsettings.json`: logging config only.

## Redis Caching
- Key pattern: `{ENTITY_TYPE}:{IDENTIFIER}` (e.g., `STATICDATA_CODE:5`).
- Always set TTL — never cache without expiry.
- Use `IRedisCacheService` abstraction — never `IConnectionMultiplexer` directly.

## Error Handling
- Use `ILogger<T>` at correct level: Debug / Info / Warning / Error / Critical.
- Never log passwords, tokens, or PII.
- Track exceptions via `TelemetryClient.TrackException(ex)` in repositories.
- Return error `Response<T>` with `Type = "error"` — not exceptions for business errors.

## Security
- `[ValidAuthorize("ROLE1,ROLE2")]` on all non-public endpoints.
- Validate inputs at API boundary (custom validators or `[Required]` attributes).
- Parameterized queries only — never concatenate SQL strings.
- Store secrets in Azure Key Vault via `IToolsConfiguration`.
- Configure CORS explicitly — no wildcard `*` in production.

## Testing
- Use xUnit + FluentAssertions + NSubstitute (or Moq).
- Integration tests with `WebApplicationFactory<Program>`.
- Test naming: `MethodName_Scenario_ExpectedResult`.
- Arrange / Act / Assert pattern in every test.
