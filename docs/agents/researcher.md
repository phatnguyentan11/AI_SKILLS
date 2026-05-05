# @researcher — Chuyên gia nghiên cứu kỹ thuật

---

## Cách gọi

```
@researcher So sánh JWT vs session-based authentication cho ASP.NET Core
@researcher Tìm best practices cho PostgreSQL connection pooling
```

> Thường **không cần gọi trực tiếp** — `@planner` sẽ spawn tự động khi cần.

---

## Files được load khi gọi

```
.github/copilot-instructions.md         ← luôn load
.github/agents/researcher.md            ← system prompt
.github/skills/research/SKILL.md        ← agent tự đọc
```

**Tools được phép:**
```
read, search, web
```

*(Không có `edit` — researcher không viết code hay sửa file)*

---

## Luồng thực thi chi tiết

```
1. QUERY EXPANSION
   └── Xác định nhiều góc độ tìm kiếm cho cùng 1 topic
       VD: "PostgreSQL pooling" →
           - Tìm docs chính thức
           - Tìm benchmark comparisons
           - Tìm GitHub issues/discussions
           - Tìm blog posts từ practitioners

2. SOURCE DISCOVERY (parallel web searches)
   ├── Official documentation
   ├── GitHub repositories
   ├── Technical blog posts
   └── Community discussions (Stack Overflow, Reddit)

3. DEEP ANALYSIS
   ├── Dùng docs-seeker skill nếu cần fetch llms.txt
   ├── Cross-reference nhiều nguồn để verify
   └── Phân biệt stable best practices vs experimental

4. SYNTHESIS
   └── Tổng hợp thành report

5. HANDOFF
   └── Trả report về cho agent đã spawn (thường là @planner)
       KHÔNG tự viết code hay plan
```

---

## Output format

```markdown
## Executive Summary
2-3 câu tóm tắt key findings

## Detailed Findings
### [Subtopic A]
...
### [Subtopic B]
...

## Recommendations
1. [Khuyến nghị ưu tiên cao nhất]
2. ...

## Trade-offs
| Option | Pros | Cons |
|--------|------|------|
| A      | ...  | ...  |

## References
- [nguồn 1](url)
- [nguồn 2](url)

## Unresolved Questions
- ...
```

---

## Kỹ thuật "Query Fan-Out"

Thay vì tìm kiếm 1 lần với 1 query, researcher tìm kiếm với nhiều queries song song:

```
Topic: "Redis caching for ASP.NET Core"
   │
   ├── Query 1: "redis aspnet core official docs"
   ├── Query 2: "IDistributedCache vs StackExchange.Redis comparison"
   ├── Query 3: "redis connection pooling best practices 2025"
   └── Query 4: "redis aspnet core performance benchmark"
```

→ Kết quả toàn diện hơn, ít bias hơn.
