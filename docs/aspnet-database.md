# Database Patterns — PostgreSQL & SQL Server

> Hai database trong hệ thống: **PostgreSQL** (primary, Dapper) + **SQL Server** (legacy/on-prem, Dapper).
> Không viết SQL raw — luôn gọi qua stored functions/procedures.

---

## 1. DapperContext — PostgreSQL Connection

```csharp
// Repositories/DapperContext.cs — Singleton
public class DapperContext
{
    private readonly NpgsqlDataSource _dataSource;

    public DapperContext(I{Service}Configuration config)
    {
        Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true; // snake_case → PascalCase tự động

        var builder = new NpgsqlDataSourceBuilder(config.NpgsqlConnection);
        builder.UseVector();  // pgvector support
        _dataSource = builder.Build();
    }

    public NpgsqlConnection CreateConnection() => _dataSource.CreateConnection();
}
```

**DI:**
```csharp
services.AddSingleton<DapperContext>();
services.AddScoped<IXyzRepository, XyzRepository>();
```

---

## 2. PostgreSQL Repository — Pattern A: `ExecuteDBWithLogging` (Result)

Dùng khi repository trả `Result<T>` — xử lý exception bên trong:

```csharp
public async Task<Result<List<CisListInfo>>> CisListInfo(CisListRequest request)
{
    string sql = """
        SELECT * FROM myss_tools.fn_cis_info_history_list(
            @p_maker, @p_fromdate, @p_todate, @p_search_value,
            @p_response_code, @p_pagenum, @p_pagesize
        )
        """;

    var parameters = new
    {
        p_maker = request.Maker,
        p_fromdate = request.FromDate.ConvertToDateTime(ToolConstants.FORMAT_DATE_HYPHEN_YYYY_MM_DD),
        p_todate = request.ToDate.ConvertToDateTime(ToolConstants.FORMAT_DATE_HYPHEN_YYYY_MM_DD),
        p_search_value = request.SearchValue,
        p_response_code = request.ResponseCode,
        p_pagenum = request.PageNum,
        p_pagesize = request.PageSize
    };

    return await _logger.ExecuteDBWithLogging(
        async () =>
        {
            using var connection = _dapperContext.CreateConnection();
            await connection.OpenAsync();
            var result = await connection.QueryAsync<CisListInfo>(sql, parameters);
            return result.ToList();
        },
        sql, "fn_cis_info_history_list", parameters);
}
```

---

## 3. PostgreSQL Repository — Pattern B: `ExecuteDB` (raw value, rethrows)

Dùng khi gọi từ nơi đã có try/catch bên ngoài hoặc khi dùng `ExecuteScalarAsync`:

```csharp
public async Task<Guid> SaveAsync(XyzData data)
{
    string sql = """
        SELECT myss_tools.fn_xyz_save(@p_user_id, @p_name, @p_value)
        """;

    var parameters = new { p_user_id = data.UserId, p_name = data.Name, p_value = data.Value };

    return await _logger.ExecuteDB(
        async () =>
        {
            using var connection = _dapperContext.CreateConnection();
            await connection.OpenAsync();
            return await connection.ExecuteScalarAsync<Guid>(sql, parameters);
        },
        sql, "fn_xyz_save", parameters);
}
```

---

## 4. PostgreSQL Repository — Pattern C: `ExecuteWithLoggingAsync` (legacy)

Pattern cũ — dùng `LogDBRequest` trực tiếp. Chỉ gặp trong code cũ; **không dung cho code mới**:

```csharp
public async Task<List<XyzResult>> GetOverviewAsync(AuthenticationResponse user)
{
    var logRequestDB = new LogDBRequest<IEnumerable<XyzResult>>
    {
        FunctionName = nameof(GetOverviewAsync),
        FunctionDatabase = "fn_schema_xyz_get_overview"
    };
    try
    {
        var param = new { ip_branch_code = user.BranchCode, ip_user_name = user.UserName };
        var sql = @"SELECT * FROM {schema}.fn_schema_xyz_get_overview
                    (@ip_branch_code, @ip_user_name)";
        logRequestDB.ParamsExecute = param;

        using var connection = _context.CreateConnection();
        logRequestDB = await connection.ExecuteWithLoggingAsync(
            () => connection.QueryAsync<XyzResult>(sql, param), logRequestDB);
    }
    catch (Exception ex) { logRequestDB.AddException(ex); }
    return logRequestDB.Response?.ToList() ?? [];
}
```

> **Preferred**: dùng Pattern A/B (`_logger.ExecuteDBWithLogging` / `ExecuteDB`) cho code mới.

---

## 5. SQL Server Repository — `SqlConnection` + `SqlServerEx`

```csharp
private readonly SqlConnection _connection = new SqlConnection(_config.SqlServerConnection);

// Read list — SqlServerEx.ExecuteAsync (tự log + handle exception)
var param = new SqlParameter[] { new("@Code", code) };
var data = await _connection.ExecuteAsync<StaticDataOnPrem>(
    "StaticDataGetByCode", param,
    logger: _logger, timeOut: _config.SqlServerTimeOut, isNonProd: _config.IsNonProd);

// Read single — Dapper trực tiếp
if (_connection.State != ConnectionState.Open) await _connection.OpenAsync();
return await _connection.QueryFirstOrDefaultAsync<OdsDebtSolution>(
    "OdsDebtSolutionByStaff",
    new { created_by = staff, clientNo = cif },
    commandType: CommandType.StoredProcedure,
    commandTimeout: int.Parse(_config.SqlServerTimeOut));

// Write với OUTPUT param — DynamicParameters
var param = new DynamicParameters();
param.Add("id", odsDebt.Id);
param.Add("OUT_ID", dbType: DbType.Decimal, direction: ParameterDirection.Output);
await _connection.ExecuteAsync("OdsDebtSolutionSafeUpdate", param,
    commandType: CommandType.StoredProcedure,
    commandTimeout: int.Parse(_config.SqlServerTimeOut));
var id = param.Get<decimal>("OUT_ID");
```

---

## 6. So Sánh & Quyết Định

| Yếu tố | PostgreSQL | SQL Server |
|--------|-----------|------------|
| Connection | `DapperContext.CreateConnection()` | `new SqlConnection(config.SqlServerConnection)` |
| Stored proc/fn | `myss_tools.fn_{entity}_{action}` | `ProcedureName` (no schema prefix) |
| Params | `@p_snake_case` (anonymous obj) | `new SqlParameter("@Name", value)` |
| Read | `QueryAsync<T>` | `SqlServerEx.ExecuteAsync<T>` |
| Scalar | `ExecuteScalarAsync<T>` | `QueryFirstOrDefaultAsync<T>` |
| Write+output | `ExecuteScalarAsync<T>` | `DynamicParameters` với `Output` |
| Logging | `_logger.ExecuteDBWithLogging` | `SqlServerEx.ExecuteAsync` (built-in) |
| Cache | Service layer | Trong repository (data tĩnh) |

---

## 7. Rules

1. **Không** viết SQL logic trực tiếp — chỉ gọi `fn_*` (Postgres) hoặc stored procedures (SQL Server)
2. **Không** mở connection cố định — Postgres dùng `using var connection` mỗi lần gọi
3. SQL Server static/lookup data → **cache Redis** trước khi truy vấn
4. Luôn truyền `logger` + `timeOut` + `isNonProd` cho `SqlServerEx.ExecuteAsync`
5. Postgres params dùng anonymous object `new { p_name = value }` — không dùng `DynamicParameters`
6. SQL Server write với output param → dùng `DynamicParameters` với `ParameterDirection.Output`
7. `DatabaseHelper.MapToList<T>` hỗ trợ `[DataReadFrom("column")]` và `[DataIgnored]` attributes
