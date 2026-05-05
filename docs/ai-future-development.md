# Hướng phát triển AI Agent — Future Integrations

> Tài liệu này tổng hợp các hướng mở rộng khả thi dựa trên:
> - Hệ thống hiện tại (`aiskills-main`)
> - GitHub Copilot Agents roadmap (docs.github.com/en/copilot/concepts/agents)
> - Agent Skills open standard (agentskills.io)
>
> Ưu tiên: YAGNI trước — chỉ integrate khi có use case thực tế.

---

## Trạng thái hệ thống hiện tại

| Thành phần | Hiện có | Giới hạn |
|---|---|---|
| Custom agents | 11 agents, VS Code only | Không chạy được trên GitHub cloud |
| Skills | 15 SKILL.md, project-level | Không có personal/org-level skills |
| Hooks | `secret-scan.ps1`, `format-cs.ps1` | Windows PowerShell only |
| Memory | Manual `/memories/repo/` | Không dùng native Copilot Memory |
| MCP | Không có | Chưa kết nối external tools/services |
| CI/CD | Không có | Agents không tích hợp với GitHub Actions |

---

## 1. Copilot Memory — Native Agentic Memory

**Hiện trạng:** Dùng manual `/memories/repo/` — Copilot ghi file bằng tay khi được nhắc.

**GitHub feature (public preview):**
- Copilot tự tạo "memories" (tightly scoped facts) trong quá trình làm việc
- Memories được persist 28 ngày, auto-validate bằng citations trong code
- Shared across all team members có access
- Works: cloud agent, code review, CLI — VS Code agent mode đang rollout

**Hướng phát triển:**
```
HIỆN TẠI:
  /memories/repo/conventions.md ← Copilot ghi thủ công

TƯƠNG LAI:
  Copilot Memory (native) ← tự động, không cần /memories/ manual
  + /memories/repo/ vẫn dùng cho notes dài hạn cần explicit
```

**Khi nào làm:** Khi VS Code agent mode support native Copilot Memory GA (không còn preview).

**Effort:** Thấp — bỏ manual memory prompts, enable tính năng trong settings.

---

## 2. Cross-platform Hooks

**Hiện trạng:** Hooks chỉ chạy Windows PowerShell.

```
.github/hooks/
├── scripts/
│   ├── secret-scan.ps1     ← Windows only
│   └── format-cs.ps1       ← Windows only
```

**Vấn đề:** Developer dùng macOS/Linux không có hooks bảo vệ.

**Hướng phát triển:**
```
.github/hooks/
├── scripts/
│   ├── secret-scan.ps1     ← Windows
│   ├── secret-scan.sh      ← macOS/Linux
│   ├── format-cs.ps1       ← Windows
│   └── format-cs.sh        ← macOS/Linux
└── copilot-hooks.json       ← detect OS, chọn script phù hợp
```

**`copilot-hooks.json` pattern:**
```json
{
  "preToolUse": [
    {
      "command": "powershell -File .github/hooks/scripts/secret-scan.ps1",
      "platforms": ["windows"]
    },
    {
      "command": "bash .github/hooks/scripts/secret-scan.sh",
      "platforms": ["linux", "darwin"]
    }
  ]
}
```

**Khi nào làm:** Khi team có dev dùng macOS/Linux.

**Effort:** Thấp — port logic PS1 sang bash, cập nhật hooks.json.

---

## 3. Personal Skills (~/.copilot/skills)

**Hiện trạng:** Skills chỉ ở `.github/skills/` — project-level, mất khi sang repo khác.

**GitHub spec hỗ trợ:**
- `~/.copilot/skills/` — personal skills, apply mọi project
- `~/.agents/skills/` — alternative path
- Organization-level skills (coming soon từ GitHub)

**Hướng phát triển — Personal skill candidates:**
```
~/.copilot/skills/
├── git-workflow/SKILL.md        ← Conventional commits, branch naming
├── security-checklist/SKILL.md  ← OWASP checklist cá nhân
└── ide-shortcuts/SKILL.md       ← VS Code shortcuts, snippets
```

**Khi nào làm:** Khi có patterns cá nhân muốn dùng across nhiều projects.

**Effort:** Thấp — tạo thư mục + SKILL.md ngoài project directory.

---

## 4. MCP Server Integration

**Hiện trạng:** Không có MCP. Agents dùng built-in tools (read/search/web/execute).

**Model Context Protocol (MCP):**
- Standard protocol để connect AI agents với external data sources/tools
- GitHub Copilot cloud agent hỗ trợ MCP
- VS Code Copilot agent mode hỗ trợ MCP servers

**Use cases có giá trị nhất cho project này:**

| MCP Server | Cung cấp | Benefit |
|---|---|---|
| **GitHub MCP** | PR list, issues, repo data | @project-manager đọc GitHub issues tự động |
| **PostgreSQL MCP** | Live DB queries | @database-admin không cần cấu hình psql thủ công |
| **Slack/Teams MCP** | Notifications | @git-manager post thông báo khi push |
| **Jira/Linear MCP** | Task management | @project-manager sync với task board |
| **Playwright MCP** | Browser automation | @tester chạy E2E tests qua browser |

**Cách tích hợp (VS Code):**
```json
// .vscode/mcp.json
{
  "servers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${env:GITHUB_TOKEN}" }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "${env:DATABASE_URL}"]
    }
  }
}
```

**Khi nào làm:** Bắt đầu với GitHub MCP — lợi ích ngay lập tức cho @project-manager.

**Effort:** Thấp-Trung — cài MCP server, cập nhật agent có liên quan.

---

## 5. GitHub Cloud Agent Compatibility

**Hiện trạng:** Tất cả agents có `target: vscode` — không chạy được khi assign Copilot issue/PR trên GitHub.com.

**GitHub cloud agent:**
- Khi assign Copilot cho GitHub issue/PR, nó research + tạo branch + code + tạo PR
- Custom agents với `target: github` hoặc `target: vscode,github` được cloud agent dùng

**Hướng phát triển — agents có thể dùng `target: github`:**
```
planner.md       → target: github     # Assign issue → tự lên plan
code-reviewer.md → target: github     # Auto-review PR khi tạo
git-manager.md   → target: github     # Manage branches/PRs
```

**Lưu ý:** Phải review agent tools — cloud agent không có tất cả VS Code tools.

**Khi nào làm:** Khi team dùng GitHub cloud agent workflow (assign issues cho Copilot).

**Effort:** Trung — test từng agent, adjust tools list cho cloud compatibility.

---

## 6. CI/CD Integration — GitHub Actions

**Hiện trạng:** Không có GitHub Actions workflow nào.

**Hướng phát triển:**

```yaml
# .github/workflows/ai-code-review.yml
# Tự động trigger @code-reviewer khi tạo PR
on: [pull_request]
jobs:
  copilot-review:
    uses: actions/copilot-review@v1  # khi available
```

**Use cases:**

| Workflow | Trigger | Agent |
|---|---|---|
| Auto code review | PR opened | @code-reviewer |
| Test on push | push to main | @tester |
| Skill validation | change in .github/skills/ | `gh skill validate` |
| Docs sync check | change in src/ | @docs-manager |

**Khi nào làm:** Khi GitHub Copilot CI/CD actions GA (hiện đang preview).

**Effort:** Trung — viết workflow YAML, test với repo thực.

---

## 7. Skill Publishing — Community Sharing

**Hiện trạng:** Skills chỉ dùng nội bộ trong project.

**GitHub ecosystem:**
- `gh skill` CLI — discover và install skills từ GitHub repos
- `github/awesome-copilot` — community collection
- `anthropics/skills` — Anthropic's official skills
- `agentskills.io` — open standard registry

**Skills trong project có thể publish:**
```
.github/skills/
├── sequential-thinking/   ← generic, không project-specific → publishable
├── problem-solving/       ← generic → publishable
├── docs-seeker/           ← generic → publishable
└── csharp-xunit/          ← .NET specific → publishable cho .NET community
```

**Cách publish:**
```bash
# Tạo public repo chứa skills
# Structure: <skill-name>/SKILL.md
# README mô tả cách dùng
gh skill publish --skill sequential-thinking
```

**Khi nào làm:** Khi muốn contribute lại community. Low priority.

**Effort:** Thấp — tách skills ra separate public repo, viết README.

---

## 8. Template Agent Improvements

**Hiện trạng:** `.github/agents/_TEMPLATE.md` tồn tại nhưng basic.

**Hướng phát triển:**
```yaml
---
name: agent-name
target: vscode
tools: ['read', 'search']   # minimal by default
description: |
  Use this agent when...
  Examples:
  - user: "..."
    assistant: "..."
    commentary: "..."
---

## Role
## Core Capabilities  
## Process (numbered steps)
## Output Format
## Hard Rules
## Unresolved Questions (always at end)
```

**Cũng cần thêm:**
- `_TEMPLATE-SKILL.md` — template cho skill mới
- `_TEMPLATE-INSTRUCTION.md` — template cho instruction file mới

**Khi nào làm:** Khi onboard thêm team member cần tạo agent mới.

**Effort:** Thấp.

---

## 9. Automated Codebase Summary Refresh

**Hiện trạng:** `docs/codebase-summary.md` (nếu có) được tạo thủ công bởi @docs-manager.
@debugger và @scout check nếu file < 2 ngày tuổi.

**Vấn đề:** File bị stale nhanh, không ai nhớ refresh.

**Hướng phát triển:**
```yaml
# .github/workflows/refresh-codebase-summary.yml
on:
  push:
    branches: [main]
    paths: ['src/**', 'tests/**']
  schedule:
    - cron: '0 6 * * 1'  # Mỗi thứ 2 sáng

jobs:
  refresh:
    steps:
      - name: Update codebase summary
        run: |
          gh copilot suggest "Update docs/codebase-summary.md" \
            --agent docs-manager
```

**Khi nào làm:** Khi project codebase đủ lớn để cần summary (> 50 files).

**Effort:** Thấp-Trung — cần GitHub Actions + Copilot CLI integration.

---

## 10. Pre-commit Test Gate

**Hiện trạng:** Chỉ có `secret-scan.ps1` trong hooks (preToolUse). Không có test gate.

**Hướng phát triển — thêm postToolUse test hook:**
```powershell
# .github/hooks/scripts/run-affected-tests.ps1
# Chạy sau mỗi lần Copilot sửa file .cs
# Tìm test project tương ứng và chạy tests liên quan

param($payload)
$file = ($payload | ConvertFrom-Json).file
if ($file -match "Services/(.+)\.cs") {
    $service = $Matches[1]
    dotnet test --filter "FullyQualifiedName~${service}Tests" --no-build
}
```

**Khi nào làm:** Khi team muốn fail-fast — không để Copilot tiếp tục nếu tests broke.

**Effort:** Trung — cần test discovery logic, tune để không quá slow.

---

## Tóm tắt — Priority Matrix

| Hạng mục | Effort | Impact | Priority |
|---|---|---|---|
| Cross-platform hooks | Thấp | Trung | **Làm ngay** (nếu có macOS/Linux dev) |
| MCP — GitHub server | Thấp | Cao | **Làm ngay** |
| Personal skills | Thấp | Trung | **Làm khi cần** |
| Template improvements | Thấp | Thấp | Nice-to-have |
| Copilot Memory | Thấp | Cao | **Chờ GA** |
| Cloud agent compatibility | Trung | Cao | Khi dùng GitHub cloud agent |
| CI/CD integration | Trung | Cao | Khi GitHub Actions GA |
| Pre-commit test gate | Trung | Trung | Khi codebase ổn định |
| Skill publishing | Thấp | Thấp | Khi muốn contribute |
| Codebase summary refresh | Trung | Thấp | Khi codebase > 50 files |

---

## References

- [GitHub Copilot Agents Concepts](https://docs.github.com/en/copilot/concepts/agents)
- [About Agentic Memory](https://docs.github.com/en/copilot/concepts/agents/copilot-memory)
- [About Agent Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [MCP and Cloud Agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/mcp-and-cloud-agent)
- [About Hooks](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-hooks)
- [Agent Skills Open Standard](https://github.com/agentskills/agentskills)
- [github/awesome-copilot](https://github.com/github/awesome-copilot)
