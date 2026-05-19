# Demo / Presentation: Banking-grade AI Agent Skill Prompt Project

## 1. Tên buổi demo

**Từ Copilot autocomplete thành Banking-grade AI Engineering Agent**  
Chuẩn hóa cách dev dùng AI trong môi trường banking bằng Copilot Instructions, Prompt Files, Agents, Skills và Docs Governance.

---

## 2. One-line pitch

Project này biến Copilot từ công cụ gợi ý code thành một lớp **AI governance package**: bắt Copilot phải đọc context, phân tích hệ thống, lập plan, tuân thủ rule bảo mật, kiểm tra rủi ro, review từng dòng, chạy verification và cập nhật tài liệu trước khi kết luận “done”.

---

## 3. Bối cảnh hiện tại

### Domain

Team đang làm **banking development**, môi trường có yêu cầu cao về:

- Bảo mật và quyền truy cập.
- PII, customer data, account/card data, secrets.
- Auditability, rollback, traceability.
- Business logic phức tạp, nhiều flow liên quan đến tiền, tài khoản, giao dịch, đối soát.
- Codebase lớn, nhiều pattern cũ, nhiều constraint nội bộ.
- Dev được công ty cấp **GitHub Copilot**, nhưng nếu dùng tự do thì dễ sinh code “đúng cú pháp nhưng sai chuẩn ngân hàng”.

### Vấn đề khi dev dùng AI tự do

AI coding tool có thể rất nhanh, nhưng trong banking, nhanh chưa đủ. Các lỗi thường gặp:

- Tạo helper/service/middleware mới dù codebase đã có component chuẩn.
- Tự thêm package, tự chọn pattern ngoài chuẩn team.
- Bỏ qua auth/authz, idempotency, concurrency, audit log.
- Log nhầm PII, token, account/card data.
- Refactor quá rộng, ảnh hưởng blast radius lớn.
- Không cập nhật tài liệu, không ghi rollback, không chứng minh đã test.
- “Done” nhưng chưa compile, chưa lint, chưa test.
- Mỗi lần prompt tự do có thể ra một bản kết quả khác nhau, khó tái lập và khó audit.

Thông điệp demo: **AI không nguy hiểm vì nó code dở; AI nguy hiểm vì nó code nhanh nhưng không bị ràng buộc bởi rule nội bộ. Project này tạo hàng rào đó.**

### Các AI coding agent hiện tại trên thị trường

Ở phần này không bàn về chatbot hỏi đáp hoặc autocomplete đơn giản, mà bàn về **AI agent dùng để làm việc trực tiếp với codebase**: đọc source, sửa file, chạy command, tạo diff, chạy test, review và hỗ trợ PR.

Điểm cần nói rõ: **Claude, Codex, Cursor, Copilot không cùng một loại sản phẩm**.

| Công cụ                  | Bản chất đúng hơn                                                                                                                                                                         | Điểm mạnh hiện tại                                                                                                                                                                                               | Điều cần cẩn trọng trong banking                                                                                                                   |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Claude / Claude Code** | Claude là model/hệ sinh thái của Anthropic; Claude Code là agentic coding tool chạy được qua terminal, IDE, desktop app và web.                                                           | Mạnh về reasoning, đọc codebase, sửa nhiều file, chạy command, tạo commit/PR, MCP, `CLAUDE.md`, settings, hooks, subagents/background agents.                                                                    | Rất mạnh nhưng quyền tool/MCP rộng; cần governance, permission, sandbox, audit và policy dữ liệu rõ.                                               |
| **OpenAI Codex**         | Codex không chỉ là model; hiện là coding agent/product của OpenAI, dùng qua cloud, CLI, IDE extension và desktop app.                                                                     | Mạnh ở multi-agent workflow, worktrees/cloud environments, long-running tasks, skills, code review, test/doc generation. GPT-5.5 hiện được OpenAI đưa vào Codex với context lớn và tối ưu token tốt hơn GPT-5.4. | Không nên đánh giá bằng câu "mạnh/yếu hơn Claude" chung chung; mỗi benchmark khác nhau. Cần kiểm soát sandbox, quyền repo, dữ liệu và review diff. |
| **Cursor**               | AI-first IDE/platform, xây trên nền VS Code nhưng thiết kế lại trải nghiệm quanh agent.                                                                                                   | Codebase indexing, project/team rules, nhiều model, subagents chạy song song, desktop/CLI/web/mobile cloud agents, plan/build/review workflow.                                                                   | Nếu team đã chuẩn hóa VS Code + Copilot, đổi IDE là chi phí adoption lớn; vẫn cần rule banking và enterprise control.                              |
| **GitHub Copilot**       | Không chỉ là extension VS Code; là hệ sinh thái GitHub/IDE gồm autocomplete, chat, agent mode, Copilot cloud agent, code review, custom instructions, prompt files, skills/custom agents. | Phù hợp nhất với công ty đã mua license GitHub Copilot; tích hợp sâu với GitHub, VS Code, Visual Studio, JetBrains và workflow issue/PR.                                                                         | Mặc định không biết domain banking. Cần package như AI_SKILLS để ép đọc context, plan, security gate, test, docs, rollback.                        |

Không nên nói "tool A chắc chắn mạnh nhất" trong buổi demo, vì model và benchmark thay đổi rất nhanh. Cách nói an toàn hơn:

> Các tool top-tier hiện nay đều đã đủ mạnh để làm agentic coding. Khác biệt quan trọng với banking không phải model nào thắng benchmark hôm nay, mà là tool nào được đặt trong guardrails đủ chặt để sinh code đúng chuẩn nội bộ, có evidence, có review, có rollback và không rò rỉ dữ liệu.

### Bản chất kỹ thuật: orchestration layer

Các AI coding agent hiện nay không chỉ là "model trả lời prompt". Chúng là một lớp **orchestration** nối giữa model và môi trường làm việc của dev.

Một agent coding thường có 5 lớp:

1. **Model layer**: phần "não" để reasoning, đọc yêu cầu, hiểu code, sinh plan và sinh patch. Ví dụ: Claude Opus/Sonnet, GPT-5.x, Gemini, model riêng của tool.
2. **Context engine**: cách tool gom context từ codebase: file đang mở, symbol search, embedding/indexing, RAG, git diff, issue/PR, terminal output, docs nội bộ.
3. **Tool/action layer**: quyền agent được làm: đọc/ghi file, chạy terminal, chạy test, gọi debugger, gọi GitHub, gọi Jira/Azure Boards, gọi database qua MCP.
4. **Apply/diff layer**: cách tool biến output model thành thay đổi thật: patch, multi-file edit, checkpoint, worktree, branch, commit, PR.
5. **Governance layer**: rule, permission, approval, audit log, secret/data policy, test gate, docs gate, rollback note.

Các tool thị trường thường rất mạnh ở 4 lớp đầu. Project này tập trung vào lớp thứ 5: **governance layer cho banking**.

### Vì sao agent thông minh vẫn chưa đủ cho banking

Agent ngày càng giống "coworker": có thể tự đọc task, tự mở file, tự sửa, tự test, tự review. Nhưng banking không chỉ cần code chạy được. Banking cần code:

- Đúng business invariant: tiền, hạn mức, trạng thái giao dịch, đối soát, reversal, idempotency.
- Đúng security boundary: auth/authz, least privilege, masking, encryption, secrets, PII.
- Đúng data integrity: transaction boundary, concurrency, retry, rollback, migration safety.
- Đúng architecture nội bộ: component-first, dependency policy, logging/audit chuẩn, error envelope chuẩn.
- Có evidence: plan, affected files, risk, verification, residual risk, docs update.

Vì vậy, hướng đúng không phải "chọn AI thông minh nhất rồi thả vào repo". Hướng đúng là **định nghĩa quy trình làm việc cho agent theo domain banking**, sau đó dùng tool phù hợp nhất với hạ tầng công ty.

### Token và context: chấp nhận overhead có kiểm soát

Xu hướng hiện nay của AI agent là giảm prompt dài dòng: dev chỉ cần nói mục tiêu, agent tự tìm context liên quan. Cursor cũng mô tả hướng "dynamic context discovery": cung cấp ít chi tiết ban đầu hơn để agent tự kéo context cần thiết. Cách này rất tốt cho productivity.

Nhưng với banking, prompt ngắn quá dễ sinh vấn đề:

- Agent tự chọn pattern "tối ưu" nhưng lệch chuẩn team.
- Agent tạo helper/package mới dù đã có component approved.
- Agent bỏ qua rule audit, PII masking, rollback, concurrency vì prompt không nhắc.
- Agent sửa đúng kỹ thuật nhưng sai business flow.

Do đó AI_SKILLS chấp nhận một lượng **instruction overhead** cố định:

- Input token mỗi request có thể cao hơn freestyle prompt.
- Nhưng tổng token toàn session thường có thể giảm vì ít vòng sửa sai hơn.
- Quan trọng hơn: giảm rủi ro sinh code rác, lệch pattern, thiếu test, thiếu docs, thiếu rollback.

Thông điệp nên dùng khi demo:

> Với banking, token rẻ hơn incident. Mình chấp nhận thêm context/rule ở đầu vào để đổi lấy output ổn định hơn, dễ review hơn và ít phải sửa lại hơn.

### Về MCP

MCP là **Model Context Protocol**, một chuẩn mở do Anthropic khởi xướng để AI tool kết nối với external tools/data sources như Jira, GitHub, database, monitoring, docs, Slack, Google Drive, internal API. Claude Code hiện hỗ trợ MCP rất mạnh; Cursor, GitHub Copilot, Codex và nhiều tool khác cũng đang đi theo hướng MCP/tool integration.

MCP có thể biến agent từ "người viết code" thành "trợ lý kỹ thuật có quyền hành động":

- Đọc ticket Jira/Azure Boards/Linear.
- Đọc docs nội bộ hoặc runbook.
- Tra schema database hoặc metadata.
- Đọc log/monitoring.
- Tạo branch, commit, PR.
- Chạy test, CI helper, security scan.
- Cập nhật ticket hoặc ghi lại kết quả xử lý.

Nhưng trong banking, MCP cũng là vùng rủi ro cao:

- **Data exposure**: agent có thể đọc PII, account data, card data, secrets, production logs.
- **Over-permission**: MCP server có quyền ghi hoặc quyền production quá rộng.
- **Prompt injection**: dữ liệu từ ticket/docs/log có thể chứa chỉ dẫn độc hại làm agent lệch rule.
- **Audit gap**: khó biết agent đã đọc gì, gọi tool nào, sửa gì, vì sao sửa.
- **Change control**: agent có thể tự động commit/PR/update ticket khi chưa qua review phù hợp.

Rule đề xuất cho banking:

- MCP mặc định **read-only**, least privilege, chỉ mở write action khi có approval rõ.
- Không cho agent truy cập production DB/log chứa PII nếu chưa có masking và policy.
- Tách MCP theo môi trường: dev/test/staging/prod, không dùng chung quyền.
- Log lại tool calls quan trọng: ai gọi, gọi lúc nào, input/output nào được phép lưu.
- Không cho approve PR, merge, deploy, chạy migration destructive bằng AI tự động.
- Mọi output từ MCP vẫn phải đi qua plan, review, verification và rollback note.

Kết luận phần này: **Claude/Cursor/Codex có MCP và agent rất mạnh, nhưng càng mạnh thì governance càng quan trọng. Với hiện trạng công ty đã cấp Copilot, dùng Copilot + AI_SKILLS là hướng hợp lý cho pilot: đủ năng lực, ít chi phí adoption, nằm gần workflow GitHub hiện có và dễ chuẩn hóa guardrails cho team.**

Nguồn xác thực chính cho phần này:

- Claude Code overview và MCP docs: <https://docs.anthropic.com/en/docs/claude-code/overview>, <https://docs.claude.com/en/docs/claude-code/mcp>
- OpenAI Codex product/docs và GPT-5.5 announcement: <https://openai.com/codex/>, <https://platform.openai.com/docs/codex/overview>, <https://openai.com/index/introducing-gpt-5-5/>
- Cursor product page: <https://cursor.com/en-US/product>
- GitHub Copilot cloud agent và Copilot features: <https://docs.github.com/en/copilot/concepts/coding-agent/coding-agent>, <https://docs.github.com/en/copilot/get-started/features>

## 4. Project hiện tại đang có gì?

Repo: `phatnguyentan11/AI_SKILLS`, branch `copilot_ai_by_codex`.

Cấu trúc chính đọc được từ repo:

```text
.github/
  copilot-instructions.md
  agents/
    code-reviewer.agent.md
    debugger.agent.md
    docs-manager.agent.md
    planner.agent.md
    research-architect.agent.md
    researcher.agent.md
    security-reviewer.agent.md
    system-analyst.agent.md
    tester.agent.md
  instructions/
    aspnet-core.instructions.md
    banking-grade-engineering.instructions.md
    copilot-package-knowledge-base.instructions.md
  prompts/
    analyze-code.prompt.md
    architecture-research.prompt.md
    ask.prompt.md
    azure-devops-intake.prompt.md
    banking-plan.prompt.md
    db-schema-context.prompt.md
    deep-research.prompt.md
    devloop.prompt.md
    docs-base-update.prompt.md
    docs-update.prompt.md
    explain-code.prompt.md
    fix.prompt.md
    git.prompt.md
    implement.prompt.md
    line-review.prompt.md
    logic-check.prompt.md
    mcp.prompt.md
    plan.prompt.md
    review.prompt.md
    scout.prompt.md
    test.prompt.md
  skills/
    aspnet-core-governance/
    backend-api-governance/
    banking-grade-engineering/
    business-logic-analysis/
    database-data-integrity/
    deep-research-governance/
    docs-base-maintenance/
    dotnet-testing/
    mcp-integration-governance/
    planning-governance/
    release-devops-governance/
    root-cause-debugging/
    secure-code-review/
    system-analysis/
    testing-verification/
  docs/
    introduce docs
    project docs base
    project changelog
    feature delivery log
```

---

## 5. Ý nghĩa từng lớp

### 5.1 `.github/copilot-instructions.md` — luật nền toàn repo

Đây là rule nền bắt Copilot hoạt động như senior engineer trong môi trường regulated financial software.

Các rule nổi bật:

- Reference-first: nếu có project cũ, diff, snippet, folder tham chiếu thì phải đọc trước.
- System-analysis first: map architecture, entry points, business logic, contracts, integrations, side effects, blast radius.
- Blocked-rules first: rule cấm có priority cao nhất.
- Component-first: tìm component có sẵn trước khi tạo helper/wrapper/middleware/serializer/validator/mapper mới.
- Plan + approval: plan trước khi sửa feature/fix/migration/security/data/production-risk.
- No silent code: phải nói rõ affected files, risk, verification, rollback, docs impact.
- Codebase-fit solution: không tự invent architecture song song.
- Centralized composition: DI/config/middleware/client/policy phải đi qua composition root hiện có.
- Evidence required: không được claim done nếu chưa compile/typecheck/lint/test hoặc chưa ghi rõ check không chạy được.
- Banking data safety: không expose secrets, tokens, card/account data, PII, production data.

### 5.2 `agents/` — chia vai chuyên môn

Các agent hiện có tạo thành workflow gần giống một engineering team:

| Agent                           | Vai trò demo                                                                |
| ------------------------------- | --------------------------------------------------------------------------- |
| Planner                         | Lập plan, scope, non-goal, affected files, risks, rollback, verification    |
| System Analyst                  | Đọc hệ thống, trace flow, hiểu business/data contract trước khi sửa         |
| Code Reviewer                   | Review từng dòng, severity-ranked findings, business/security/test/doc risk |
| Security Reviewer               | Banking-grade security, PII, secrets, auth/authz, data integrity            |
| Tester                          | Tập trung verification, test strategy, missing cases                        |
| Debugger                        | Root cause, không fix mò                                                    |
| Docs Manager                    | Bắt docs base luôn cập nhật                                                 |
| Researcher / Research Architect | Phục vụ deep research, architecture comparison, decision support            |

### 5.3 `prompts/` — reusable workflows cho dev

Prompt files biến các thao tác thường ngày thành command/workflow lặp lại được:

- `plan.prompt.md`: lập plan trước khi code.
- `implement.prompt.md`: implement theo plan.
- `review.prompt.md`: review có checklist.
- `line-review.prompt.md`: review từng dòng.
- `logic-check.prompt.md`: kiểm tra business logic.
- `test.prompt.md`: sinh/đề xuất test.
- `fix.prompt.md`: fix bug theo root cause.
- `db-schema-context.prompt.md`: phân tích schema/data impact.
- `docs-update.prompt.md`, `docs-base-update.prompt.md`: cập nhật tài liệu.
- `azure-devops-intake.prompt.md`: nhận context từ ticket/task.

### 5.4 `skills/` — năng lực task-specific

Skills là phần rất đáng demo vì nó chuyển từ instruction chung sang năng lực chuyên biệt:

- `banking-grade-engineering`: chuẩn ngân hàng.
- `secure-code-review`: review security/privacy/data integrity.
- `database-data-integrity`: transaction, migration, consistency, rollback.
- `business-logic-analysis`: kiểm tra invariant, role, flow, edge case.
- `dotnet-testing`: test cho .NET.
- `aspnet-core-governance`: chuẩn ASP.NET Core.
- `backend-api-governance`: API contract, validation, error handling.
- `release-devops-governance`: release/deploy/rollback.
- `root-cause-debugging`: debug có nguyên nhân gốc.
- `mcp-integration-governance`: kiểm soát external/internal context.

---

## 6. Demo story đề xuất

### Demo 1 — Before/After Copilot

**Before**: Dev hỏi Copilot: “Add API update customer limit”.  
Copilot có thể tạo controller/service nhanh, nhưng dễ:

- Bỏ qua existing service pattern.
- Không kiểm tra permission.
- Không log audit.
- Không xử lý concurrency.
- Không cập nhật docs/test.

**After dùng project này**: Copilot phải trả về plan trước:

- Đọc codebase và docs.
- Tìm existing component.
- Xác định affected files.
- Nêu business flow và data impact.
- Nêu security/privacy impact.
- Nêu rollback.
- Nêu verification commands.
- Chờ approval rồi mới implement.

### Demo 2 — Banking security reviewer

Prompt demo:

```md
Use Security Reviewer agent. Review this change for banking-grade risks:

- auth/authz
- PII/logging
- data integrity
- idempotency
- concurrency
- rollback
- tests/docs
```

Output mong muốn:

- Findings theo severity.
- File/symbol cụ thể.
- Risk cụ thể.
- Required fixes.
- Checks not run.
- Residual risk.

### Demo 3 — Line review trước khi merge

Prompt demo:

```md
Use line-review prompt. Review every changed line before completion verdict.
Focus on banking domain, business rule, data safety, and rollback.
```

Thông điệp: **AI không thay reviewer người, nhưng bắt developer tự review kỹ hơn trước khi gửi PR.**

### Demo 4 — Docs governance

Show rule: “No package change is complete until implementation, verification, line review, and docs base update are recorded or explicitly marked not applicable with reason.”

Thông điệp cho sếp: project này không chỉ tăng tốc code; nó giảm knowledge loss và tăng audit trail.

---

## 7. Review đánh giá cập nhật hiện tại

### 7.1 Nhận xét tổng quan

Cập nhật đến **18/05/2026**, thị trường AI coding đã đi qua giai đoạn "autocomplete là chính". Điểm cạnh tranh mới không còn chỉ là model trả lời hay, mà là **agent có thể hiểu repo, lập kế hoạch, sửa nhiều file, chạy lệnh, kiểm thử, review diff và hỗ trợ tạo PR**. Mức tự động hóa thực tế còn phụ thuộc license, policy doanh nghiệp, quyền repo, sandbox và cách team cấu hình tool.

Đánh giá lại project hiện tại:

- **Điểm mạnh**: hướng đi rất đúng cho môi trường banking vì không cố tạo thêm một AI IDE mới, mà tạo **governance layer** nằm trong repo: instructions, prompts, agents, skills, blocked rules, docs và verification discipline.
- **Điểm khác biệt**: các tool như Copilot, Claude Code, Cursor, Codex đều mạnh về năng lực agent, nhưng không tự biết chuẩn nội bộ ngân hàng nếu team không đưa rule vào repo/tooling. Project này biến chuẩn nội bộ thành tài sản có version control.
- **Điểm cần cải thiện**: nên bổ sung nguồn tham chiếu chính thức, bảng so sánh cập nhật, pilot metrics, ví dụ prompt thực tế và hướng dẫn rollout theo từng team.
- **Rủi ro còn lại**: instruction/prompt không phải hard gate tuyệt đối. Với production banking, vẫn cần code review người thật, branch protection, CI/CD, secret scanning, SAST/DAST, dependency policy, log/audit trail và quyền truy cập được quản trị ở cấp tổ chức.

Kết luận review: **AI_SKILLS nên được trình bày như một AI engineering governance package, không phải bộ prompt cá nhân. Giá trị chính là chuẩn hóa cách dev dùng AI trong domain rủi ro cao.**

### 7.2 Xu hướng AI coding hiện nay

Các hướng lớn của AI cho developer hiện tại:

- **Từ autocomplete sang agentic development**: AI không chỉ gợi ý dòng code mà xử lý task nhiều bước: đọc context, plan, edit, test, debug, review.
- **Từ chat trong IDE sang multi-surface agent**: dev có thể dùng AI trong VS Code/JetBrains, terminal, GitHub issue/PR, web, mobile, Slack/Teams/Linear.
- **Từ một agent sang nhiều agent song song**: một agent phân tích kiến trúc, một agent viết test, một agent implement, một agent review/security. Codex app, Claude Code web và Cursor cloud/agents đều đang đi theo hướng background hoặc parallel task.
- **Từ prompt tự do sang repo-native governance**: file như `.github/copilot-instructions.md`, `.github/prompts`, `.github/skills`, `CLAUDE.md`, `AGENTS.md`, `.cursor/rules` đang trở thành "AI operating manual" của repo.
- **Từ productivity sang controllability**: enterprise quan tâm quyền truy cập repo, môi trường sandbox, network policy, audit, dữ liệu nhạy cảm, cách agent tạo PR và cách rollback.
- **Từ code generation sang software delivery**: AI hỗ trợ đọc ticket, tạo plan, viết test, sửa code, review PR, cập nhật docs, chuẩn bị release note và migration checklist.

### 7.3 Ý nghĩa với dev banking

Trong banking, câu hỏi không phải "tool nào thông minh nhất hôm nay", vì bảng xếp hạng model thay đổi rất nhanh. Câu hỏi đúng hơn là:

- AI có bị ép đọc context và component hiện có trước khi code không?
- AI có biết rule bảo mật, PII, secrets, audit log, idempotency, concurrency và rollback không?
- AI có để lại evidence: plan, affected files, verification, residual risk, docs update không?
- AI có giúp dev chuẩn bị PR tốt hơn trước khi senior review không?
- AI có chạy trong boundary phù hợp với policy nội bộ không?

Vì vậy, hướng đi hợp lý là **chuẩn hóa workflow AI trước, rồi mới tối ưu tool/model sau**.

---

## 8. So sánh với các AI IDE/agent hiện tại

### 8.1 Đánh giá nhanh từng nhóm công cụ

- **GitHub Copilot**: phù hợp nhất nếu công ty đã mua license và đang dùng GitHub/VS Code/JetBrains. Copilot hiện có nhiều lớp: autocomplete/chat, agent mode trong IDE, Copilot coding/cloud agent trên GitHub để xử lý issue/PR trong môi trường riêng, code review, custom instructions, prompt files, skills và custom agents. Điểm cần bổ sung là rule nội bộ đủ chặt để Copilot không chỉ "code nhanh".
- **Claude Code**: mạnh ở terminal/IDE workflow, đọc project, sửa file, chạy command, debug và làm việc theo `CLAUDE.md`/settings. Claude Code web cho phép chạy task remote từ GitHub repo trong môi trường cô lập, phù hợp workflow async; kết quả thường được đẩy lên branch/PR để người dùng review.
- **Cursor**: mạnh như một AI-first IDE/agent platform với desktop, CLI, web/mobile cloud agents, codebase indexing, project rules, PR/code review, terminal, checkpoints, MCP và workflow plan/build/review. Phù hợp team muốn một môi trường AI-native thay vì chỉ thêm plugin vào IDE cũ.
- **OpenAI Codex**: mạnh ở mô hình coding agent chạy qua CLI, IDE extension, cloud và desktop app macOS/Windows. Codex nhấn mạnh multi-agent song song, isolated worktrees/cloud environments, long-running tasks, skills và sandbox/permission controls. Phù hợp khi team muốn delegate nhiều task kỹ thuật song song và review diff từ agent.
- **Windsurf/Cline/Roo Code**: phù hợp cá nhân hoặc nhóm nhỏ muốn agent trong IDE/editor, tool use, multi-file edit. Điểm cần kiểm soát là governance, quyền truy cập, policy dữ liệu, cách tool chạy lệnh và khả năng chuẩn hóa ở cấp enterprise.

### 8.2 Bảng so sánh

| Tiêu chí                                  | GitHub Copilot                                                                                         | Claude Code                                                  | Cursor                                                                    | OpenAI Codex                                                     | AI_SKILLS project                                                |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| Bản chất                                  | AI assistant/agent gắn IDE và GitHub                                                                   | Coding agent qua terminal, IDE, web                          | AI-first IDE + agent platform                                             | Coding agent qua CLI, IDE extension, cloud, desktop app          | Governance package cho AI coding trong banking                   |
| Điểm mạnh                                 | Tận dụng license công ty, GitHub integration, coding agent, instructions/prompts/skills                | Agentic coding sâu, terminal control, remote task qua GitHub | Codebase indexing, IDE-native, cloud/mobile agents, review/build workflow | Parallel agents, long-running task, skills, sandbox/app workflow | Chuẩn hóa rule, prompt, agent, skill, docs, review, verification |
| Repo context                              | Tốt nếu cấu hình instruction/context đúng                                                              | Tốt, đặc biệt khi chạy trong repo local hoặc remote GitHub   | Rất mạnh nhờ indexing và rules                                            | Mạnh với workspace/sandbox và skills                             | Ép đọc context theo workflow và docs base                        |
| Rule nội bộ                               | Có `.github/copilot-instructions.md`, path instructions, `AGENTS.md`, skills/custom agents tùy surface | Có `CLAUDE.md`, settings, slash commands, MCP                | Có `.cursor/rules`, user rules, `AGENTS.md`, skills/plugins               | Có `AGENTS.md`, skills, sandbox/permission config tùy surface    | Đã đóng gói thành policy rõ cho banking                          |
| Banking compliance                        | Không mặc định                                                                                         | Không mặc định                                               | Không mặc định                                                            | Không mặc định                                                   | Trọng tâm chính: PII, secrets, audit, rollback, auth/authz       |
| Plan trước khi code                       | Có thể làm bằng agent/prompt                                                                           | Mạnh khi task cần reasoning                                  | Mạnh ở plan/build/review                                                  | Mạnh ở delegation và background task                             | Bắt buộc cho high-risk change                                    |
| Component-first                           | Cần instruction                                                                                        | Cần rule                                                     | Cần rule/index                                                            | Cần instruction/skill                                            | Có rule rõ, giảm tạo pattern song song                           |
| Verification                              | Có thể chạy test/lint trong IDE hoặc môi trường GitHub Actions-powered của coding agent                | Có thể chạy lệnh/test tùy quyền cấu hình                     | Chạy terminal/test/debug, có checkpoint để quay lại                       | Chạy trong sandbox/worktree/cloud environment tùy chế độ         | Bắt buộc ghi evidence hoặc nêu check chưa chạy                   |
| Docs discipline                           | Tùy prompt                                                                                             | Tùy prompt                                                   | Tùy rules                                                                 | Tùy skills                                                       | Có docs manager, docs-base maintenance                           |
| Phù hợp hiện trạng công ty đã cấp Copilot | Rất cao                                                                                                | Cần license/tool riêng                                       | Cần đổi hoặc thêm IDE/license                                             | Cần quyền dùng Codex/ChatGPT plan phù hợp                        | Rất cao vì tận dụng Copilot sẵn có                               |
| Giá trị chính                             | Productivity + GitHub workflow                                                                         | Agentic coding mạnh                                          | AI-native IDE experience                                                  | Delegate nhiều task kỹ thuật                                     | Productivity có kiểm soát, traceable, audit-friendly             |

### 8.3 Kết luận so sánh

**AI_SKILLS không nên được bán như đối thủ của Claude Code, Cursor hay Codex.** Nó nên được bán như lớp governance/workflow có thể áp lên Copilot hiện tại và sau này chuyển hóa sang tool khác nếu cần. Điểm cốt lõi là: tool thay đổi nhanh, nhưng rule banking, checklist review, verification và docs discipline phải thuộc về team.

Trong 2-4 tuần pilot, lựa chọn thực dụng nhất là:

1. Dùng **GitHub Copilot** làm runtime chính vì công ty đã cấp sẵn.
2. Dùng **AI_SKILLS** làm policy/workflow layer trong repo.
3. Đo chất lượng bằng PR review findings, missing tests/docs, lead time, số lỗi security/business logic phát hiện sớm.
4. Sau pilot, nếu cần agent mạnh hơn cho task dài hoặc parallel task, đánh giá thêm Claude Code, Cursor hoặc Codex trên cùng bộ checklist governance.

### 8.4 Nguồn tham chiếu cập nhật

- GitHub Docs về Copilot coding agent: <https://docs.github.com/en/copilot/concepts/coding-agent/coding-agent>
- GitHub Docs về quản lý access/policy cho Copilot coding agent Business/Enterprise: <https://docs.github.com/en/copilot/concepts/agents/coding-agent/coding-agent-for-business-and-enterprise>
- GitHub Docs về repository custom instructions và agent skills: <https://docs.github.com/en/copilot/how-tos/custom-instructions/adding-repository-custom-instructions-for-github-copilot>, <https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills>
- Anthropic Claude Code overview, settings và Claude Code web: <https://docs.anthropic.com/en/docs/claude-code/overview>, <https://docs.anthropic.com/en/docs/claude-code/settings>, <https://support.claude.com/en/articles/12618689-claude-code-on-the-web>
- OpenAI Codex product page, Codex cloud docs và Codex app announcement: <https://openai.com/codex/>, <https://platform.openai.com/docs/codex/overview>, <https://openai.com/index/introducing-the-codex-app/>
- Cursor product page và docs về codebase indexing/rules: <https://cursor.com/en-US/product>, <https://docs.cursor.com/chat/codebase>, <https://docs.cursor.com/context/rules-for-ai>

---

## 9. Thuyết phục team member dùng

### Nỗi đau của dev

- Mất thời gian đọc codebase cũ.
- Sợ sửa nhầm flow tiền/giao dịch.
- Không biết rule nào bắt buộc.
- Review PR bị bắt lỗi lặp đi lặp lại.
- Viết docs/test/rollback thiếu.
- Copilot đôi khi sinh code lệch pattern.

### Lợi ích trực tiếp

- Có sẵn prompt để plan, fix, test, review.
- Giảm phải nhớ checklist bằng đầu.
- AI nhắc component-first trước khi tạo code mới.
- Dễ chuẩn bị PR hơn vì có sẵn risk, verification, docs impact.
- New member onboard nhanh hơn vì AI được ép đọc docs/pattern.
- Senior giảm thời gian review lỗi cơ bản.

### Câu chốt cho team

**Dùng AI_SKILLS không làm dev bị kiểm soát nhiều hơn; nó giúp dev đỡ bị Copilot kéo sang pattern sai, đỡ bị review reject, và an toàn hơn khi đụng domain ngân hàng.**

---

## 10. Thuyết phục sếp dùng

### Góc nhìn quản lý

Sếp không chỉ cần dev code nhanh. Sếp cần:

- Delivery nhanh nhưng không phá chuẩn.
- Giảm rủi ro production incident.
- Giảm dependency vào vài senior nắm domain.
- Chuẩn hóa cách dùng AI để tránh mỗi dev prompt một kiểu.
- Có audit trail: plan, risk, test, rollback, docs.
- Tận dụng license Copilot công ty đã trả tiền.

### Giá trị kinh doanh

- Tăng productivity nhưng vẫn giữ guardrails.
- Giảm review cycle vì lỗi cơ bản được chặn sớm.
- Giảm onboarding cost cho dev mới.
- Giảm knowledge loss khi người cũ rời team.
- Tạo nền tảng AI governance có thể scale sang nhiều repo/project.
- Chuẩn bị cho tương lai AI-native engineering nhưng không đánh đổi compliance.

### Câu chốt cho sếp

**Đây không phải project prompt cá nhân. Đây là AI governance package giúp công ty dùng Copilot có kiểm soát trong môi trường banking: nhanh hơn, an toàn hơn, traceable hơn, và tận dụng được tool công ty đã mua.**

---

## 11. KPI đề xuất để chứng minh hiệu quả

Trong 2–4 tuần pilot, đo các chỉ số:

| KPI                      | Cách đo                                                 |
| ------------------------ | ------------------------------------------------------- |
| PR review finding giảm   | So sánh số lỗi repeated finding trước/sau               |
| Lead time feature/fix    | Thời gian từ ticket đến PR ready                        |
| Missing test/doc giảm    | Số PR bị comment thiếu test/docs/rollback               |
| Onboarding speed         | Dev mới hiểu flow nhanh hơn qua explain/analyze prompts |
| Incident/risk prevention | Số issue phát hiện sớm bởi security/line review prompt  |
| Copilot adoption quality | Số dev dùng prompt/agent chuẩn thay vì prompt tự do     |

---

## 12. Roadmap cải tiến project

### Phase 1 — Chuẩn hóa adoption

- Viết README hướng dẫn setup trong repo banking thật.
- Thêm quickstart cho dev: 5 prompt nên dùng mỗi ngày.
- Tạo demo script 15 phút.
- Thêm checklist PR: plan, test, security, docs, rollback.

### Phase 2 — Mapping với banking codebase thật

- Bổ sung rule theo architecture thật: Clean Architecture, modular monolith, microservices, ABP, ASP.NET Core, ServiceStack, EF, Dapper, Kafka/RabbitMQ, Redis, v.v.
- Bổ sung approved components: logging, error envelope, result pattern, validation, mapper, retry, HTTP client, audit log.
- Bổ sung blocked patterns: service locator, raw SQL không kiểm soát, log PII, bypass auth, direct config reads, magic retry, silent catch.

### Phase 3 — Governance & metrics

- Template PR comment generated by AI.
- Template risk assessment.
- Prompt kiểm tra migration/data rollback.
- Pilot trên 1 team nhỏ, lấy metric.
- Chuẩn hóa thành internal package dùng cho nhiều repo.

---

## 13. Slide outline đề xuất

1. Title: Banking-grade AI Agent Skill Prompt Project.
2. Problem: Copilot nhanh nhưng không biết rule ngân hàng nếu không dạy.
3. Current AI trend: autocomplete → agent → multi-agent workflow.
4. Banking risk: security, PII, data integrity, audit, rollback.
5. Project architecture: instructions + prompts + agents + skills + docs.
6. Demo flow: plan → implement → review → test → docs.
7. Before/After Copilot.
8. Agent map: planner, system analyst, security reviewer, tester, docs manager.
9. Skills map: banking, API, DB, testing, release, debugging.
10. Comparison: Copilot default vs Claude Code vs Codex vs AI_SKILLS.
11. Value for developers.
12. Value for managers.
13. Pilot metrics.
14. Roadmap.
15. Ask: approve pilot and select 1–2 banking repos for trial.

---

## 14. Demo script ngắn

### Opening

“Hiện tại công ty đã cấp Copilot. Nhưng nếu mỗi dev dùng Copilot theo cách riêng, AI sẽ sinh code rất nhanh nhưng không chắc đúng chuẩn banking. Project này giải quyết bằng cách đóng gói rule, workflow, agent và skill để Copilot luôn làm việc theo chuẩn team.”

### Show repo

“Trong repo này, phần quan trọng nằm dưới `.github`: `copilot-instructions.md` là luật nền; `agents` là các vai chuyên môn; `prompts` là workflow reusable; `skills` là năng lực chuyên biệt; `docs` là nơi giữ knowledge base và changelog.”

### Show banking gate

“Ví dụ, trước khi sửa code, Copilot phải phân tích hệ thống, tìm component có sẵn, lập plan, nêu risk, rollback, verification và docs impact. Nó không được tự ý thêm package, không được tạo architecture song song, không được claim done nếu chưa có evidence.”

### Show team value

“Dev không cần nhớ hết checklist. Khi làm feature hoặc fix bug, chỉ cần gọi đúng prompt/agent, AI sẽ kéo mình về đúng quy trình.”

### Show manager value

“Với quản lý, đây là cách tận dụng Copilot license hiện có nhưng vẫn kiểm soát compliance, giảm lỗi review, giảm rủi ro production và chuẩn hóa AI usage trong team.”

### Closing

“Đề xuất của em là pilot trên 1–2 repo banking trong 2–4 tuần, đo PR review findings, missing tests/docs, lead time và feedback của senior reviewer. Nếu hiệu quả, mình chuẩn hóa thành package nội bộ.”

---

## 15. Q&A chuẩn bị trước

### Q: Copilot đã thông minh rồi, cần project này làm gì?

A: Copilot thông minh nhưng không tự biết rule nội bộ, component chuẩn, blocked pattern, security checklist và docs discipline của team. Project này biến kinh nghiệm team thành instruction version-controlled.

### Q: Có làm chậm dev không?

A: Ban đầu dev mất thêm vài phút để plan, nhưng giảm thời gian sửa lại sau review, giảm lỗi production-risk, và giảm hỏi senior lặp lại. Với banking, “sửa nhanh nhưng sai flow” đắt hơn nhiều.

### Q: Có thay thế senior reviewer không?

A: Không. Nó là pre-review assistant. Senior vẫn quyết định cuối cùng, nhưng AI giúp lọc lỗi cơ bản và nhắc checklist trước khi PR lên.

### Q: Có an toàn dữ liệu không?

A: Project có rule cấm đưa secrets, PII, production data, account/card data, internal bank identifiers vào code/logs/prompts/docs/commits. Tuy nhiên cần kết hợp chính sách Copilot Enterprise/Business và quy định nội bộ của công ty.

### Q: Nếu sau này dùng Claude Code/Codex thì sao?

A: Vẫn dùng được tư duy này. Tool có thể đổi, nhưng governance package, skills, prompts, checklist và docs base là tài sản của team.

---

## 16. Kết luận

Project hiện tại có hướng rất đúng với xu thế AI-native engineering: không chỉ hỏi AI code, mà xây một hệ thống rule để AI làm việc như một thành viên engineering team trong môi trường có kiểm soát.

Điểm nên nhấn mạnh trong buổi demo:

1. Công ty đã có Copilot, project tận dụng ngay công cụ sẵn có.
2. Banking cần guardrails, không chỉ productivity.
3. Repo đã có cấu trúc đủ tốt: instructions, agents, prompts, skills, docs.
4. Giá trị cho dev: ít lỗi review, ít lệch pattern, onboard nhanh.
5. Giá trị cho sếp: productivity + compliance + auditability + scale.
6. Đề xuất pilot nhỏ, đo metric, rồi nhân rộng.
