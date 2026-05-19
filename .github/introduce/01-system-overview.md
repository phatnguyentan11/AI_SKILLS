# System overview

Project AI là một **AI development operating layer** nằm trong `.github/`. Nó không phải chatbot service, không phải model gateway, không phải runtime backend. Nó là bộ luật, workflow, prompt, agent, skill, docs và local hook để Copilot làm việc như một đồng đội kỹ thuật có kỷ luật.

## Big picture

```mermaid
flowchart TB
    User["Developer / Tech Lead"] --> Chat["Copilot Chat / AI Agent"]
    Chat --> Package[".github package"]
    Package --> Rules["Rules<br/>instructions + blocked rules"]
    Package --> Playbooks["Playbooks<br/>workflow + architecture + MCP"]
    Package --> Roles["Roles<br/>agents + skills"]
    Package --> Actions["Actions<br/>prompts + scripts + hooks"]

    Rules --> Output["Plan · Code guidance · Review · Docs"]
    Playbooks --> Output
    Roles --> Output
    Actions --> Output

    Output --> Evidence["Evidence<br/>verification + line review + changelog"]
    Evidence --> LocalGate["Local governance<br/>pre-push check"]
```

Một câu để nhớ:

> Project AI biến Copilot từ công cụ trả lời thành một quy trình làm việc: đọc trước, plan trước, kiểm chứng trước.

## Package map

```mermaid
flowchart LR
    Root[".github/"] --> I["instructions<br/>rules theo path"]
    Root --> C["copilot<br/>knowledge base"]
    Root --> P["prompts<br/>21 workflows"]
    Root --> A["agents<br/>9 personas"]
    Root --> S["skills<br/>15 domain modules"]
    Root --> H["hooks<br/>pre-commit, pre-push"]
    Root --> PS["scripts<br/>setup, format, governance"]
    Root --> D["docs<br/>technical records"]
    Root --> IN["introduce<br/>usage guide, overview, quick reference"]
```

## Tầng kiến trúc

```mermaid
flowchart TB
    L1["Layer 1<br/>Always-on instructions"] --> L2["Layer 2<br/>Conditional instructions"]
    L2 --> L3["Layer 3<br/>Knowledge base"]
    L3 --> L4["Layer 4<br/>Agents"]
    L4 --> L5["Layer 5<br/>Skills"]
    L5 --> L6["Layer 6<br/>Prompts"]
    L6 --> L7["Layer 7<br/>Local hooks & scripts"]

    L1 -.-> G1["Banking gates"]
    L2 -.-> G2["ASP.NET / package rules"]
    L3 -.-> G3["Architecture + workflow"]
    L4 -.-> G4["Planner, reviewer, tester"]
    L5 -.-> G5["Security, testing, database"]
    L6 -.-> G6["/plan, /implement, /review"]
    L7 -.-> G7["format + scan + policy check"]
```

## Local-only boundary

Hiện tại hệ thống chỉ dừng ở **local governance**. Đây là chủ ý thiết kế cho giai đoạn này.

```mermaid
flowchart LR
    Dev["Máy developer"] --> Setup["setup.ps1"]
    Setup --> Hooks["core.hooksPath = .github/hooks"]
    Hooks --> PreCommit["pre-commit<br/>format staged files"]
    Hooks --> PrePush["pre-push<br/>governance check"]

    PrePush --> Scan["package validation<br/>frontmatter<br/>secret scan<br/>blocked rules"]
    Scan --> Warn["Warn mode<br/>push allowed unless strict"]

    Server["GitHub server-side controls"]:::future
    Warn -. "future only" .-> Server

    classDef future fill:#f6f8fc,stroke:#94a3b8,stroke-dasharray:4 4,color:#64748b;
```

Không thêm trong giai đoạn hiện tại:

- PR template.
- CODEOWNERS.
- Branch protection.
- GitHub Actions.
- CI/CD enforcement.

## Luồng delivery chuẩn

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant AI as Copilot / Agent
    participant Repo as Repository
    participant Hook as Local governance

    Dev->>AI: Giao task
    AI->>Repo: Đọc code, docs, policy, pattern
    AI->>Dev: Trả analysis + plan
    Dev->>AI: Duyệt plan
    AI->>Repo: Hướng dẫn sửa / implement theo scope
    AI->>Repo: Verify, review, update docs
    Dev->>Hook: git push
    Hook->>Repo: Validate package + scan secrets + scan rules
    Hook->>Dev: Pass hoặc warning
```

## Hệ thống bảo vệ điều gì

| Rủi ro                       | Cách package giảm rủi ro                                       |
| ---------------------------- | -------------------------------------------------------------- |
| AI sửa code không hiểu flow  | Bắt đọc context, trace flow, phân tích blast radius            |
| AI tạo pattern mới lung tung | Component-first, blocked rules, centralized DI/config guidance |
| AI bỏ qua security/privacy   | Banking gates, secure review, secret scan, blocked data rules  |
| AI nói xong nhưng không test | Evidence-required, testing-verification skill, delivery log    |
| Docs bị lệch implementation  | Docs base, changelog, feature delivery log                     |

## Đọc theo vai trò

```mermaid
flowchart TD
    Start["Bạn là ai?"] --> Dev{"Developer"}
    Start --> Lead{"Tech lead"}
    Start --> Reviewer{"Reviewer"}

    Dev --> D1["02-huong-dan-su-dung.md"]
    Dev --> D2["04-quick-reference.md"]
    Lead --> L1["01-system-overview.md"]
    Lead --> L2["project-docs-base.md"]
    Reviewer --> R1["blocked-rules.md"]
    Reviewer --> R2["feature-delivery-log.md"]
```

## Thành phần chính

| Thành phần                                      | Vai trò                                |
| ----------------------------------------------- | -------------------------------------- |
| `.github/copilot-instructions.md`               | Luật nền always-on                     |
| `.github/copilot/blocked-rules.md`              | Rule cấm trung tâm                     |
| `.github/copilot/*.md`                          | Playbook, catalog, assessment          |
| `.github/prompts/*.prompt.md`                   | Slash-command workflows                |
| `.github/agents/*.agent.md`                     | Persona chuyên biệt                    |
| `.github/skills/*/SKILL.md`                     | Năng lực domain                        |
| `.github/scripts/setup.ps1`                     | Cài local hook và kiểm tra package     |
| `.github/scripts/pre-push-governance-check.ps1` | Local governance check                 |
| `.github/docs/`                                 | Technical records                      |
| `.github/introduce/`                            | Usage guide, overview, quick reference |

## Điều package này không làm

- Không thay thế human reviewer.
- Không đọc external source nếu chưa được phê duyệt.
- Không chứa production model, dataset, eval harness hoặc telemetry.
- Không thay server-side governance khi sau này team cần hard gate.
- Không cho phép secret, token, PII, account data, card data hoặc production data đi vào prompt, test, docs hay log.
