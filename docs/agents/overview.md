# Hệ thống AI Agent — Overview kỹ thuật

> Giải thích cách hệ thống khởi động, load file nào, chạy theo luồng nào.

---

## Khi bạn mở VS Code và chat với Copilot

**Thứ tự load:**

```
1. VS Code Copilot đọc .github/copilot-instructions.md
       ↓ (luật chung, áp dụng mọi lúc)

2. Đọc AGENTS.md ở root
       ↓ (mô tả ecosystem, agent nào làm gì)

3. Kiểm tra .github/instructions/*.instructions.md
       ↓ (nếu file đang mở match applyTo pattern → load thêm)
       VD: mở file .cs → load aspnet.instructions.md tự động

4. User gõ lệnh → Copilot quyết định:
   a) Tự xử lý với context đang có
   b) Load skill phù hợp từ .github/skills/
   c) Chuyển sang agent cụ thể nếu user gọi @agent-name
```

---

## Luồng hoàn chỉnh khi gọi một agent

```
User: "@planner Tôi cần thêm module thanh toán"
              │
              ▼
┌─────────────────────────────────────────────────┐
│  VS Code Copilot                                 │
│                                                  │
│  1. Load .github/copilot-instructions.md        │ ← luôn load
│  2. Load .github/agents/planner.md              │ ← agent definition
│  3. Đọc frontmatter → tools: [read,search,web,  │
│     edit, todo, agent/runSubagent]               │
│  4. Inject system prompt = instructions + agent  │
└─────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│  planner.md body chạy:                          │
│                                                  │
│  1. Đọc .github/skills/planning/SKILL.md        │ ← load skill
│  2. Scan .github/skills/* để biết skills nào    │
│     khả dụng                                    │
│  3. Spawn @researcher x N (parallel)            │ ← subagents
│  4. Tổng hợp → viết ./plans/<name>/plan.md      │
└─────────────────────────────────────────────────┘
              │
              ▼
Hooks KHÔNG chạy ở bước này
(hooks chỉ kích hoạt khi Copilot dùng tool edit/write)
```

---

## Cấu trúc một agent file (.github/agents/*.md)

```yaml
---
name: tên-agent                    # ID duy nhất
target: vscode                     # chạy ở đâu (vscode / github / cả hai)
tools: ['read', 'search', 'edit']  # tools được phép dùng
description: "..."                 # Copilot đọc cái này để biết khi nào invoke
---

Nội dung system prompt cho agent...
```

**`tools` khả dụng:**
| Tool alias | Làm gì |
|---|---|
| `read` | Đọc file trong workspace |
| `search` | Tìm kiếm file/code trong workspace |
| `edit` | Tạo/sửa file |
| `execute` | Chạy terminal command |
| `web` | Fetch URL, tìm kiếm web |
| `todo` | Quản lý task list |
| `agent/runSubagent` | Spawn agent khác |

---

## Cấu trúc một skill file (.github/skills/*/SKILL.md)

```yaml
---
name: tên-skill
description: "Khi nào load skill này"
allowed-tools: [read, search]   # tools pre-approved (không hỏi xác nhận)
license: MIT
---

Nội dung hướng dẫn chuyên sâu...
(thường reference thêm: references/*.md)
```

**Skill KHÔNG được gọi trực tiếp** — Copilot tự quyết định load dựa trên `description` khớp với context. Agent có thể chủ động load bằng cách đọc SKILL.md trong system prompt.

---

## Hooks — kích hoạt khi nào

File: `.github/hooks/copilot-hooks.json`

```json
{
  "preToolUse":  [secret-scan.ps1]   ← chạy TRƯỚC mỗi lần Copilot ghi file
  "postToolUse": [format-cs.ps1]    ← chạy SAU mỗi lần Copilot ghi file .cs
}
```

**Luồng hook:**
```
Copilot muốn ghi file
        │
        ▼
  secret-scan.ps1 đọc stdin (JSON payload có nội dung sắp ghi)
        │
  Phát hiện pattern: api_key=, password=, bearer token, ...
        │
  exit 2 → BLOCK  /  exit 0 → CHO PHÉP
        │
        ▼ (nếu cho phép)
  Copilot ghi file
        │
        ▼
  format-cs.ps1 (nếu là .cs) → chạy dotnet format --include <file>
```

---

## Path-specific instructions — load khi nào

File: `.github/instructions/aspnet.instructions.md`
```yaml
applyTo: "**/*.cs,**/*.csproj,**/*.razor,**/*.cshtml,**/*.sln"
```

→ Khi Copilot đang làm việc với bất kỳ file .cs nào, instructions này tự động được inject vào context — bao gồm naming conventions, project structure, async rules, v.v.

---

## Prompt shortcuts — /lệnh

File: `.github/prompts/*.prompt.md`

Khi user gõ `/plan`, `/debug`, `/test`... trong chat:
1. VS Code load file `.github/prompts/<name>.prompt.md`
2. Inject nội dung vào chat như một message mẫu
3. User điền thêm `${input:...}` nếu có
4. Copilot (hoặc agent được chỉ định trong `agent: agent`) xử lý

| Prompt | File | Agent được dùng |
|---|---|---|
| `/plan` | plan.prompt.md | `@planner` |
| `/code` | code.prompt.md | Copilot chính |
| `/fix` | fix.prompt.md | Copilot chính |
| `/debug` | debug.prompt.md | `@debugger` |
| `/test` | test.prompt.md | `@tester` |
| `/brainstorm` | brainstorm.prompt.md | `@brainstormer` |
| `/scout` | scout.prompt.md | `@scout` |
| `/ask` | ask.prompt.md | Copilot chính |
| `/watzup` | watzup.prompt.md | Copilot chính |

---

## Danh sách tất cả agents

| Agent | File | Trigger |
|---|---|---|
| [@planner](./planner.md) | `.github/agents/planner.md` | Trước khi code feature mới |
| [@researcher](./researcher.md) | `.github/agents/researcher.md` | Cần research kỹ thuật |
| [@code-reviewer](./code-reviewer.md) | `.github/agents/code-reviewer.md` | Sau implement / trước merge |
| [@tester](./tester.md) | `.github/agents/tester.md` | Sau implement / sau fix bug |
| [@debugger](./debugger.md) | `.github/agents/debugger.md` | Khi có bug / CI fail |
| [@git-manager](./git-manager.md) | `.github/agents/git-manager.md` | Khi commit / push |
| [@docs-manager](./docs-manager.md) | `.github/agents/docs-manager.md` | Sau code thay đổi lớn |
| [@project-manager](./project-manager.md) | `.github/agents/project-manager.md` | Check tiến độ, update roadmap |
| [@brainstormer](./brainstormer.md) | `.github/agents/brainstormer.md` | Quyết định kiến trúc |
| [@scout](./scout.md) | `.github/agents/scout.md` | Tìm file trong codebase lớn |
| [@database-admin](./database-admin.md) | `.github/agents/database-admin.md` | DB slow / schema / backup |
