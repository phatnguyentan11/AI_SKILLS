# AI Agent System — Overview

> Tài liệu giới thiệu hệ thống AI Agent cho team.
> Mục tiêu: hiểu cách hệ thống hoạt động, cách dùng, triết lý thiết kế.
>
> **Tài liệu kỹ thuật chi tiết:** [docs/agents/](./agents/overview.md)

---

## Phần 1 — Tổng quan hệ thống

### 1.1 Hệ thống này là gì?

Đây là một **AI Agent ecosystem** được xây dựng trên nền GitHub Copilot (VS Code).

Thay vì dùng Copilot như một chatbot thông thường (hỏi → trả lời), hệ thống này tổ chức Copilot thành nhiều **agent chuyên biệt**, mỗi agent làm đúng một việc, phối hợp với nhau theo quy trình rõ ràng — giống như một team kỹ sư thu nhỏ.

```
User yêu cầu một feature
       ↓
   @planner  → nghiên cứu, lên plan
       ↓
   Implement → viết code theo plan
       ↓
   @tester   → chạy test, kiểm tra
       ↓
   @code-reviewer → review chất lượng
       ↓
   @docs-manager  → cập nhật tài liệu
```

---

### 1.2 Triết lý cốt lõi — Holy Trinity

Mọi quyết định trong hệ thống đều tuân theo 3 nguyên tắc:

| Nguyên tắc | Ý nghĩa | Ví dụ thực tế |
|---|---|---|
| **YAGNI** — You Aren't Gonna Need It | Chỉ build những gì task hiện tại yêu cầu | Đừng làm thêm tính năng "phòng khi cần" |
| **KISS** — Keep It Simple, Stupid | Chọn giải pháp đơn giản nhất hoạt động được | 20 dòng code rõ ràng > 5 dòng "clever" |
| **DRY** — Don't Repeat Yourself | Không lặp logic, extract ra shared module | Một hàm validate dùng chung, không copy-paste |

Advanced Architectural & Clean Code Principles:

Separation of Concerns (SoC) — Divide the system into distinct modules, each addressing a separate domain or infrastructure concern.
Composition Over Inheritance — Favor assembling interchangeable behaviors over building rigid, deeply nested class hierarchies.
Fail Fast — Stop operation and report errors immediately upon encountering an invalid state, preventing cascading system failures.
Boy Scout Rule — Always leave the codebase a little cleaner than you found it.

> **Tại sao quan trọng?** Khi AI viết code không có kiểm soát, nó có xu hướng over-engineer — thêm layer, thêm abstraction, thêm feature không cần thiết. Ba nguyên tắc này là constraint để AI giữ code đơn giản và maintainable.

---

### 1.3 Cấu trúc thư mục

```
.github/
├── copilot-instructions.md   ← Luật chung, tất cả agent đều tuân theo
├── AGENTS.md                 ← Mô tả agent ecosystem (chuẩn agentsmd)
├── agents/                   ← 11 agent definitions (.md files)
├── skills/                   ← 16 knowledge packs (SKILL.md)
├── prompts/                  ← 9 reusable prompt shortcuts
├── instructions/             ← Luật riêng cho từng loại file
└── hooks/                    ← Tự động chạy khi Copilot edit file
    └── scripts/
        ├── secret-scan.ps1   ← Chặn commit secret/password
        └── format-cs.ps1     ← Auto-format C# sau mỗi lần edit
docs/                         ← Tài liệu project (code standards, architecture...)
plans/                        ← Plan files do @planner tạo ra
```

---

### 1.4 Quy trình làm việc chuẩn (6 bước)

```
1. PLAN      → @planner tạo plan trong ./plans/ trước khi code
2. IMPLEMENT → Code theo plan, từng phase, compile sau mỗi file
3. TEST      → @tester chạy test suite, fix ngay nếu fail
4. REVIEW    → @code-reviewer kiểm tra security + quality
5. INTEGRATE → @docs-manager cập nhật ./docs/
6. DEBUG     → Khi có bug: @debugger tìm root cause trước
```

**Quy tắc quan trọng nhất:**
- ❌ Không code trước khi có plan được approve
- ❌ Không ship khi còn failing test
- ❌ Không commit secret/API key/password
- ✅ Luôn chạy compile/build sau mỗi thay đổi

---

### 1.5 Agent Orchestration — Sequential vs Parallel

**Sequential** (tuần tự) — khi các bước phụ thuộc nhau:
```
Planning → Research → Implementation → Testing → Review
```

**Parallel** (song song) — khi các task độc lập:
```
@researcher-A (topic 1) ──┐
@researcher-B (topic 2) ──┼→ @planner tổng hợp → plan
@researcher-C (topic 3) ──┘
```

---

### 1.6 Skills — Knowledge Packs tự động load

Skills là các "knowledge pack" chứa hướng dẫn chuyên sâu. Copilot tự động load skill khi ngữ cảnh phù hợp với `description` trong SKILL.md — **không cần gọi thủ công**.

| Nhóm | Skills |
|---|---|
| Quy trình | `planning`, `research`, `code-review`, `debugging` |
| .NET/C# | `dotnet-best-practices`, `csharp-async`, `csharp-xunit`, `ef-core` |
| Backend | `backend-development`, `databases`, `devops` |
| Tư duy | `sequential-thinking`, `problem-solving` |
| Tiện ích | `docs-seeker`, `copilot-code` |

---

### 1.7 Hooks — Tự động bảo vệ codebase

Hai script chạy tự động mà không cần user làm gì:

**`secret-scan.ps1`** (preToolUse — chạy TRƯỚC khi Copilot ghi file):
- Scan tất cả nội dung sắp được viết
- Phát hiện patterns: `api_key=`, `password=`, `bearer token`, v.v.
- **Block ngay** nếu phát hiện — không cho ghi file

**`format-cs.ps1`** (postToolUse — chạy SAU khi Copilot sửa file):
- Tự động chạy `dotnet format` trên file C# vừa được sửa
- Đảm bảo code style nhất quán không cần nhắc

---

## Phần 2 — Từng Agent trong hệ thống

### Cách gọi agent

Trong VS Code Copilot Chat, gõ `@tên-agent` để gọi:
```
@planner Tôi cần thêm tính năng export PDF
@tester Chạy test cho module Auth
@code-reviewer Review file UserService.cs
```

Hoặc dùng prompt shortcuts: `/plan`, `/debug`, `/test`, `/fix`, `/brainstorm`

---

### `@planner` — Kiến trúc sư & Lập kế hoạch

**Dùng khi:** Bắt đầu bất kỳ feature mới hoặc task phức tạp nào.

**Làm gì:**
1. Hỏi clarifying questions về requirements
2. Spawn nhiều `@researcher` song song để research các khía cạnh khác nhau
3. Phân tích trade-offs theo YAGNI/KISS/DRY
4. Viết plan vào `./plans/<feature>/plan.md` + các `phase-N.md`

**Quan trọng:** `@planner` **không tự viết code** — chỉ tạo plan và chuyển giao.

```
Ví dụ output: ./plans/user-auth/
  ├── plan.md         ← Overview, goals, risks, tech stack
  ├── phase-1.md      ← Task breakdown chi tiết phase 1
  └── phase-2.md      ← Task breakdown chi tiết phase 2
```

---

### `@researcher` — Chuyên gia nghiên cứu

**Dùng khi:** Cần tìm hiểu technology mới, best practices, so sánh thư viện.

**Làm gì:**
- Dùng kỹ thuật "Query Fan-Out" — tìm từ nhiều góc độ khác nhau
- Cross-reference nhiều nguồn để verify
- Output: Executive Summary + Findings + Recommendations + Trade-offs

**Thường được `@planner` spawn tự động** — không cần gọi trực tiếp nhiều.

---

### `@code-reviewer` — Gác cổng chất lượng

**Dùng khi:** Sau khi implement xong một feature hoặc fix một bug.

**Kiểm tra 5 chiều:**
1. **Code Quality** — readability, maintainability, code smells
2. **Build** — `dotnet build` pass không, type safety
3. **Performance** — bottlenecks, N+1 queries, memory leaks
4. **Security** — OWASP Top 10, SQL injection, XSS, lộ secrets
5. **Completeness** — TODO còn sót, plan đã done hết chưa

**Output:** Report phân loại Critical / High / Medium / Low issues.

---

### `@tester` — QA Engineer

**Dùng khi:** Sau implement, sau bug fix, khi cần check coverage.

**Làm gì:**
- Chạy xUnit test suite
- Phân tích coverage (target ≥ 80%)
- Test error scenarios, edge cases, boundary conditions
- Validate build process

**Quy tắc cứng:** Không được ship khi còn failing test. Không dùng mock/fake data để "pass" CI.

---

### `@debugger` — Thám tử bug

**Dùng khi:** Có lỗi, performance degradation, CI/CD fail, 500 errors.

**Quy trình điều tra:**
1. Thu thập symptoms, error messages
2. Đọc logs, trace execution path
3. Phân tích root cause (không đoán mò)
4. Đề xuất targeted fix + preventive measures

**Nguyên tắc:** Tìm root cause TRƯỚC, fix SAU. Không patch symptom.

---

### `@git-manager` — Quản lý commit

**Dùng khi:** User nói "commit" hoặc "push".

**Làm gì trong 3 bước:**
1. Stage files + scan secrets + đếm metrics
2. Tạo conventional commit message
3. Commit + push

**Nếu phát hiện secret** → dừng ngay, không commit.

**Commit format:** `feat(auth): add JWT refresh token` / `fix(api): handle null user response`

---

### `@docs-manager` — Bảo trì tài liệu

**Dùng khi:** Sau khi có code thay đổi đáng kể, cần update docs.

**Quản lý:**
- `./docs/code-standards.md`
- `./docs/system-architecture.md`
- `./docs/development-roadmap.md`
- `./docs/project-changelog.md`

Tự động sync tài liệu với code thực tế, phát hiện gaps và outdated content.

---

### `@project-manager` — Điều phối dự án

**Dùng khi:** Cần overview tiến độ, update roadmap, sau khi nhiều agent hoàn thành việc.

**Làm gì:**
- Đọc tất cả plans trong `./plans/`
- Cross-reference với code thực tế
- Track task completion, identify blockers
- Update roadmap và changelog

---

### `@brainstormer` — Cố vấn kiến trúc

**Dùng khi:** Cần quyết định kiến trúc, so sánh approaches, evaluate trade-offs.

**Phong cách:** Brutally honest — nếu idea không tốt sẽ nói thẳng. Luôn đưa ra 2-3 options với pros/cons rõ ràng.

**Không implement** — chỉ phân tích và recommend.

---

### `@scout` — Thám tử codebase

**Dùng khi:** Cần tìm file liên quan trong codebase lớn trước khi bắt đầu task.

**Kỹ thuật:** Chia codebase thành sections, search song song, tổng hợp kết quả.

---

### `@database-admin` — DBA chuyên nghiệp

**Dùng khi:** Slow queries, schema design, index optimization, backup strategy.

**Công cụ:** `psql`, EXPLAIN ANALYZE, index analysis, lock contention monitoring.

---

## Tóm tắt — Ai làm gì?

```
Bắt đầu feature  →  @planner
Cần research     →  @researcher
Viết code xong   →  @code-reviewer + @tester
Có bug           →  @debugger
Cần commit       →  @git-manager
Update docs      →  @docs-manager
Check tiến độ    →  @project-manager
Quyết định arch  →  @brainstormer
Tìm file         →  @scout
DB chậm          →  @database-admin
```

---

*Tài liệu này được tạo từ source `.github/agents/` và `.github/copilot-instructions.md`*
