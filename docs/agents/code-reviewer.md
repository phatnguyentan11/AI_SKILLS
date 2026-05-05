# @code-reviewer — Gác cổng chất lượng

---

## Cách gọi

```
@code-reviewer Review module thanh toán vừa implement
@code-reviewer Kiểm tra security cho UserController.cs
```

---

## Files được load khi gọi

```
.github/copilot-instructions.md           ← luôn load
.github/agents/code-reviewer.md           ← system prompt
.github/skills/code-review/SKILL.md       ← agent tự đọc
.github/skills/code-review/references/
    code-review-reception.md
    requesting-code-review.md
    verification-gates.md
./docs/code-standards.md                  ← đọc để biết chuẩn của project
./plans/<feature>/plan.md                 ← đọc để biết task nào cần done
```

**Tools được phép:**
```
agent/runSubagent, execute, read, search
```

---

## Luồng thực thi chi tiết

```
1. INITIAL ANALYSIS
   ├── Đọc plan file liên quan (nếu có) → biết task nào đang review
   ├── Chạy: git diff để xem files vừa thay đổi
   └── Đọc ./docs/code-standards.md → biết chuẩn của project

2. BUILD VALIDATION
   └── Chạy: dotnet build
       ├── Pass → tiếp tục
       └── Fail → báo lỗi compile ngay (Critical)

3. CODE QUALITY REVIEW
   ├── Đọc từng file thay đổi
   ├── Kiểm tra: naming conventions, code smells, DRY violations
   ├── Kiểm tra: file size ≤ 200 lines
   └── Kiểm tra: async/await patterns (.Result / .Wait() → Critical)

4. PERFORMANCE ANALYSIS
   ├── N+1 query patterns
   ├── Memory leaks, unmanaged resources
   └── Inefficient algorithms, missing indexes

5. SECURITY AUDIT (OWASP Top 10)
   ├── SQL Injection → dùng parameterized queries?
   ├── XSS → output encoding?
   ├── Secrets trong code → API keys, passwords?
   ├── Auth/AuthZ → route protection đầy đủ?
   └── CORS, CSP headers?

6. COMPLETENESS CHECK
   ├── Tất cả TODO items trong plan đã done?
   ├── Còn TODO comment trong code không?
   └── Update plan file với status mới

7. OUTPUT REPORT
```

---

## Mức độ nghiêm trọng

| Level | Ví dụ | Hành động |
|---|---|---|
| **Critical** | Secret trong code, SQL injection, data loss | Fix ngay, không merge |
| **High** | `.Result` deadlock, missing null check, N+1 query | Fix trước khi merge |
| **Medium** | Code smell, DRY violation, missing comment | Fix trong sprint này |
| **Low** | Naming style, minor refactor | Nice-to-have |

---

## Activation của skills khi review

Agent này tự kích hoạt thêm skills tùy context:

```
Đang review C# code       → dotnet-best-practices + csharp-async
Đang review test files    → csharp-xunit
Đang review DB queries    → databases
Đang review API layer     → backend-development
```

---

## Verification Gate — không được bỏ qua

Trước khi claim "done":
1. `dotnet build` → pass
2. Không còn Critical/High issues
3. Tất cả plan tasks đã checked off
4. Không có `TODO` comment còn sót
