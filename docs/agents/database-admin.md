# @database-admin — DBA chuyên nghiệp

---

## Cách gọi

```
@database-admin Query /api/orders đang chạy chậm 3 giây
@database-admin Thiết kế schema cho module inventory
@database-admin Setup backup strategy cho PostgreSQL production
```

---

## Files được load khi gọi

```
.github/copilot-instructions.md          ← luôn load
.github/agents/database-admin.md         ← system prompt
.github/skills/databases/SKILL.md        ← tự load khi cần
```

**Tools được phép:**
```
execute, read, search
```

*(Có `execute` để chạy psql, EXPLAIN ANALYZE, diagnostic queries)*

---

## Luồng thực thi chi tiết

```
1. INITIAL ASSESSMENT
   ├── Identify database system và version
   ├── Đọc schema (nếu có file migration hoặc EF models)
   └── Hiểu vấn đề: slow query? schema design? backup?

2. DIAGNOSTIC (cho slow query)
   ├── Chạy EXPLAIN ANALYZE trên query chậm:
   │   psql -d <db> -c "EXPLAIN ANALYZE <query>"
   ├── Kiểm tra: Sequential Scan hay Index Scan?
   ├── Kiểm tra: table statistics (VACUUM cần chạy không?)
   │   psql -d <db> -c "SELECT * FROM pg_stat_user_tables WHERE relname='orders'"
   ├── Kiểm tra: existing indexes
   │   psql -d <db> -c "\d orders"
   └── Kiểm tra: lock contention
       psql -d <db> -c "SELECT * FROM pg_locks WHERE granted = false"

3. SCHEMA DESIGN (nếu yêu cầu)
   ├── Áp dụng normalization principles
   ├── Xác định relationships: 1-1, 1-N, N-N
   ├── Thiết kế indexes ngay từ đầu
   └── Cân nhắc: partitioning nếu data lớn

4. INDEX STRATEGY
   ├── Composite indexes cho queries thường gặp
   ├── Covering indexes để avoid table lookup
   ├── Partial indexes cho filtered queries
   └── Remove redundant indexes (chúng slow down writes)

5. SOLUTION IMPLEMENTATION
   ├── Viết migration SQL nếu cần thay đổi schema
   ├── Viết index creation scripts
   └── Verify sau khi apply

6. MONITORING SETUP (nếu yêu cầu)
   └── pg_stat_statements, slow query log, alerting
```

---

## Common diagnostic queries

```sql
-- Top slow queries (cần pg_stat_statements extension)
SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Missing indexes (sequential scans trên large tables)
SELECT schemaname, tablename, seq_scan, idx_scan
FROM pg_stat_user_tables
WHERE seq_scan > idx_scan
ORDER BY seq_scan DESC;

-- Index usage
SELECT indexrelname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;

-- Table bloat estimate
SELECT relname, n_dead_tup, n_live_tup
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
```

---

## Output format

```
## Database Analysis: [problem description]

### Findings
- Query đang dùng Sequential Scan trên 2.3M rows
- Missing index on orders(customer_id, created_at)
- Table chưa được VACUUM 14 ngày

### Root Cause
Full table scan vì không có composite index cho query pattern:
WHERE customer_id = ? AND created_at > ?

### Solution Applied
CREATE INDEX CONCURRENTLY idx_orders_customer_date
ON orders(customer_id, created_at DESC);

### Before/After
- Before: 3,200ms (seq scan, 2.3M rows)
- After:  12ms (index scan, 47 rows)

### Additional Recommendations
- Schedule VACUUM ANALYZE weekly
- Monitor với pg_stat_statements
```

---

## Databases được hỗ trợ

| DB | Tools dùng | Skills load |
|---|---|---|
| PostgreSQL | psql, pg_stat_* | databases skill |
| MongoDB | mongosh | databases skill |
| SQL Server | sqlcmd | databases skill |
| Redis | redis-cli | databases skill |
