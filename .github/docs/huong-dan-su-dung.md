<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Hướng dẫn sử dụng Banking-Grade Copilot Package</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 960px; margin: 0 auto; padding: 2rem; color: #1f2937; background: #fff; line-height: 1.6; }
  h1 { color: #1e3a5f; border-bottom: 3px solid #1e3a5f; padding-bottom: .5rem; font-size: 2rem; }
  h2 { color: #1e3a5f; border-bottom: 1px solid #d1d5db; padding-bottom: .3rem; margin-top: 2.5rem; font-size: 1.4rem; }
  h3 { color: #374151; margin-top: 1.5rem; font-size: 1.1rem; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: .92rem; }
  th { background: #1e3a5f; color: #fff; padding: .55rem .8rem; text-align: left; }
  td { padding: .5rem .8rem; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
  tr:nth-child(even) td { background: #f9fafb; }
  code { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 4px; padding: .1rem .35rem; font-family: 'Courier New', monospace; font-size: .88em; color: #dc2626; }
  pre { background: #1f2937; color: #f9fafb; border-radius: 8px; padding: 1.2rem 1.5rem; overflow-x: auto; font-size: .88rem; line-height: 1.55; }
  pre code { background: none; border: none; color: inherit; padding: 0; }
  .badge { display: inline-block; padding: .2rem .55rem; border-radius: 9999px; font-size: .78rem; font-weight: 600; }
  .badge-ok { background: #dcfce7; color: #166534; }
  .badge-warn { background: #fef9c3; color: #854d0e; }
  .badge-critical { background: #fee2e2; color: #991b1b; }
  .callout { border-left: 4px solid #1e3a5f; background: #eff6ff; padding: .8rem 1.2rem; margin: 1rem 0; border-radius: 0 6px 6px 0; }
  .callout-warn { border-color: #f59e0b; background: #fffbeb; }
  .callout-danger { border-color: #dc2626; background: #fef2f2; }
  .flow { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem 1.5rem; }
  .flow-step { display: flex; align-items: flex-start; gap: .75rem; padding: .4rem 0; }
  .flow-num { background: #1e3a5f; color: #fff; border-radius: 50%; width: 1.5rem; height: 1.5rem; display: flex; align-items: center; justify-content: center; font-size: .78rem; font-weight: 700; flex-shrink: 0; margin-top: .1rem; }
  .flow-arrow { color: #9ca3af; text-align: center; padding: .1rem 0 .1rem 2.2rem; font-size: .85rem; }
  details { border: 1px solid #e5e7eb; border-radius: 6px; margin: .75rem 0; }
  summary { padding: .6rem 1rem; cursor: pointer; font-weight: 600; color: #374151; background: #f9fafb; border-radius: 6px; }
  details[open] summary { border-bottom: 1px solid #e5e7eb; border-radius: 6px 6px 0 0; }
  details > div { padding: 1rem; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0; }
  .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem 1.2rem; }
  .card h4 { margin: 0 0 .5rem; color: #1e3a5f; font-size: 1rem; }
  .card p { margin: 0; font-size: .9rem; color: #6b7280; }
  a { color: #1d4ed8; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .toc { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem 1.5rem; margin: 1.5rem 0; }
  .toc h3 { margin: 0 0 .6rem; font-size: 1rem; color: #374151; }
  .toc ol { margin: 0; padding-left: 1.4rem; }
  .toc li { padding: .18rem 0; font-size: .92rem; }
  @media (max-width: 640px) { .grid-2 { grid-template-columns: 1fr; } body { padding: 1rem; } }
</style>
</head>
<body>

# Hướng dẫn sử dụng Banking-Grade Copilot Package

<div class="callout">
<strong>Version:</strong> 2026-05-13 &nbsp;|&nbsp; <strong>Scope:</strong> <code>.github/</code> standalone package &nbsp;|&nbsp; <strong>Target:</strong> GitHub Copilot (VS Code, GitHub.com, CLI)
</div>

---

<div class="toc">
<h3>Mục lục</h3>
<ol>
  <li><a href="#tong-quan">Tổng quan</a></li>
  <li><a href="#cai-dat">Cài đặt vào project thực tế</a></li>
  <li><a href="#tu-dong">Cách Copilot hoạt động tự động</a></li>
  <li><a href="#prompts">Sử dụng Prompt Files</a></li>
  <li><a href="#agents">Sử dụng Custom Agents</a></li>
  <li><a href="#workflow">Quy trình làm việc chuẩn</a></li>
  <li><a href="#governance">Chạy Governance Checks</a></li>
  <li><a href="#docs">Tài liệu dự án (.github/docs/)</a></li>
  <li><a href="#security">Quy tắc bảo mật tuyệt đối</a></li>
  <li><a href="#cautruc">Cấu trúc thư mục</a></li>
  <li><a href="#hooks">Format code sau khi AI gen</a></li>
</ol>
</div>

---

<h2 id="tong-quan">1. Tổng quan</h2>

Package này là bộ cấu hình GitHub Copilot **cấp ngân hàng**, hoàn toàn độc lập trong thư mục `.github/`. Mục đích: biến Copilot thành một senior engineer có kỷ luật:

<div class="grid-2">
<div class="card">
<h4>Phân tích trước khi code</h4>
<p>Luôn phân tích kiến trúc, luồng nghiệp vụ, blast radius trước khi đề xuất bất kỳ thay đổi nào.</p>
</div>
<div class="card">
<h4>Plan + Approval bắt buộc</h4>
<p>Mọi thay đổi đều phải có plan được developer duyệt trước khi implement. Không tự code ngầm.</p>
</div>
<div class="card">
<h4>Review từng dòng</h4>
<p>Sau implement phải review từng dòng thay đổi về correctness, security, privacy, data integrity.</p>
</div>
<div class="card">
<h4>Cập nhật tài liệu</h4>
<p>Sau mỗi thay đổi phải cập nhật <code>.github/docs/</code> với evidence, risks, rollback notes.</p>
</div>
</div>

**Thành phần chính:**

| Loại | Số lượng | Mô tả |
|------|----------|-------|
| Instructions files | 3 | Quy tắc tự động theo loại file |
| Prompt files | 22 | Workflow gọi bằng `/tên` |
| Custom agents | 10 | Personas gọi bằng `@tên` |
| Agent skills | 18 | Domain knowledge tự động |
| Local governance | 2 | Pre-push warning hook/script |
| Docs base | 9 | Tài liệu dự án cập nhật liên tục |

---

<h2 id="cai-dat">2. Cài đặt vào project thực tế</h2>

**Bước 1 — Copy package:**

```bash
# Từ repo này, copy toàn bộ .github/ sang target project
xcopy /E /I .github\ C:\path\to\your-project\.github\

# Hoặc trên Linux/Mac
cp -r .github/ /path/to/your-project/.github/
```

**Bước 2 — Hardening bắt buộc cho target repo:**

```bash
# Thêm CODEOWNERS (thay bằng team của bạn)
echo "* @your-team/banking-devs" > .github/CODEOWNERS

# Enable branch protection trên GitHub:
# Settings → Branches → Add rule → main
# ✓ Require pull request reviews before merging
# ✓ Require status checks to pass
# ✓ Restrict pushes that create files
```

**Bước 3 — Bật cảnh báo local trước khi push:**

Package này không dùng build pipeline làm gate mặc định. Mỗi developer bật Git hook một lần trong clone local:

```bash
git config core.hooksPath .github/hooks
```

Sau đó mỗi lần `git push`, hook `.github/hooks/pre-push` sẽ chạy `.github/scripts/pre-push-governance-check.ps1` ở chế độ warning. Nếu có vấn đề, hook in cảnh báo nhưng vẫn cho push.

<div class="callout callout-warn">
<strong>Lưu ý:</strong> Đây là warning cho developer trước khi push, không thay thế branch protection hoặc CI bắt buộc nếu target repository cần hard gate sau này.
</div>

---

<h2 id="tu-dong">3. Cách Copilot hoạt động tự động</h2>

Không cần làm gì thêm — các rules tự động kích hoạt theo file đang mở:

| Khi bạn làm việc với | Instructions tự động nhận |
|---|---|
| **Bất kỳ file nào** | Banking gates ([copilot-instructions.md](../copilot-instructions.md)) + banking-grade rules |
| **`.cs`, `.csproj`, `.razor`, `.cshtml`** | ASP.NET Core patterns, DI, auth, Dapper/EF Core guidance |
| **`.github/copilot/**`, `.github/docs/**`, `.github/skills/**`** | Package maintenance rules |

**Skills tự động nhận theo context** (không cần gọi tay):

<details>
<summary>Xem danh sách 18 skills</summary>
<div>

| Skill | Khi nào active |
|---|---|
| `banking-grade-engineering` | Mọi lúc — core policy |
| `system-analysis` | Trước khi plan/implement/review |
| `codebase-reading` | Khi đọc/giải thích code hiện có |
| `business-logic-analysis` | Kiểm tra business rules, invariants |
| `code-solution-fit` | Trước khi viết/thay đổi code |
| `planning-governance` | Trước bất kỳ thay đổi code/config |
| `secure-code-review` | Sau implement, completion gates |
| `testing-verification` | Sau thay đổi code, trước khi done |
| `docs-base-maintenance` | Sau feature/fix/migration/security |
| `root-cause-debugging` | Bug, failing tests, incidents |
| `backend-api-governance` | Backend code, API, auth, validation |
| `database-data-integrity` | Schema, migration, query, transaction |
| `release-devops-governance` | CI/CD, deployment, infrastructure |
| `aspnet-core-governance` | .NET/ASP.NET Core (conditional) |
| `dotnet-testing` | .NET test planning & verification |
| `mcp-integration-governance` | Azure DevOps, Slack, DB schema, enterprise MCP controls |
| `internal-knowledge-governance` | NotebookLM-style docs, source register, sanitized old project knowledge |
| `deep-research-governance` | Cited research, architecture comparison, ADR-ready reports |

</div>
</details>

---

<h2 id="prompts">4. Sử dụng Prompt Files</h2>

Gọi prompt trong VS Code Copilot Chat: gõ `/` rồi chọn tên prompt.

<h3>Nhóm hỏi & khám phá</h3>

| Prompt | Khi nào dùng | Ví dụ |
|---|---|---|
| `/ask` | Hỏi câu hỏi kỹ thuật có context repo | `/ask tại sao AccountService dùng Unit of Work?` |
| `/scout` | Tìm file, symbol, pattern trong codebase | `/scout tất cả nơi gọi TransferFunds` |
| `/explain-code` | Giải thích code hiện có và business flow | `/explain-code` + chọn đoạn code |
| `/analyze-code` | Phân tích kiến trúc, blast radius | `/analyze-code module xác thực OTP` |

<h3>Nhóm lên kế hoạch</h3>

| Prompt | Output | Khi nào dùng |
|---|---|---|
| `/plan` | Scope, affected files, phases, risks | Feature/fix thông thường |
| `/banking-plan` | + Risk matrix, rollback, approval gates, verification commands | Mọi thay đổi ảnh hưởng DB, auth, PII |

<div class="callout">
<strong>Quy tắc bắt buộc:</strong> Mọi thay đổi code phải có plan được duyệt trước. Copilot sẽ dừng ở bước plan và chờ xác nhận — không tự implement.
</div>

<h3>Nhóm thực thi</h3>

| Prompt | Khi nào dùng |
|---|---|
| `/implement` | Implement sau khi plan đã được duyệt |
| `/fix` | Debug + trace root cause + fix minimal |
| `/logic-check` | Kiểm tra business logic, edge cases, integration behavior |
| `/test` | Tìm lệnh test phù hợp, chạy, phân tích failures |

<h3>Nhóm review & tài liệu</h3>

| Prompt | Khi nào dùng |
|---|---|
| `/review` | Review code changes với severity-ranked findings |
| `/line-review` | Review từng dòng — **bắt buộc với banking-grade changes** |
| `/docs-update` | Cập nhật project documentation |
| `/docs-base-update` | Cập nhật `./github/docs/` sau feature/fix |
| `/git` | Chuẩn bị commit message, PR description |
| `/mcp` | Chọn MCP tool phù hợp hoặc fallback thủ công |
| `/azure-devops-intake` | Đọc work item `dev.azure.com` đã approved và tạo plan inputs |
| `/db-schema-context` | Lấy schema metadata read-only, không đọc production rows |
| `/internal-knowledge` | Tra cứu coding convention, docs nội bộ, old project đã sanitize |
| `/deep-research` | Nghiên cứu nhiều nguồn có citation |
| `/architecture-research` | So sánh kiến trúc và tạo ADR-ready recommendation |

<h3>Vòng lặp đầy đủ</h3>

```
/devloop [mô tả feature hoặc bug fix]
```

Chạy toàn bộ pipeline: **phân tích → plan → chờ approval → implement → test → review → docs**.

<div class="callout callout-warn">
<strong>Không bỏ qua bước approval gate.</strong> <code>/devloop</code> sẽ dừng sau khi tạo plan và chờ developer xác nhận trước khi implement.
</div>

---

<h2 id="agents">5. Sử dụng Custom Agents</h2>

Mở VS Code Copilot Chat → Agent mode → chọn agent từ dropdown.

| Agent | Chuyên về | Gọi khi |
|---|---|---|
| **System Analyst** | Kiến trúc, luồng, dependencies, blast radius | Trước khi làm bất cứ thứ gì phức tạp |
| **Planner** | Plans chi tiết: phases, risks, approvals, rollback | Cần plan có đủ thành phần để duyệt |
| **Researcher** | Tìm và tổng hợp context trong repo/docs | Cần hiểu codebase trước khi plan |
| **Debugger** | Reproduce → trace root cause → minimal fix | Bug, lỗi CI, behavior bất thường |
| **Tester** | Tìm lệnh test, chạy, phân tích failures | Verify sau implement |
| **Code Reviewer** | Severity-ranked findings: Critical / High / Medium / Low | Review PR, sau implement |
| **Security Reviewer** | Banking security, privacy, data integrity, audit | Thay đổi auth, PII, DB |
| **Docs Manager** | Cập nhật docs, changelog, delivery log | Sau mọi thay đổi có nghĩa |
| **Knowledge Curator** | Curate docs nội bộ, source register, sanitized references | Khi thêm knowledge / NotebookLM-style source |
| **Research Architect** | Research kiến trúc, thư viện, ADR-ready output | Khi cần so sánh kiến trúc hoặc R&D |

**Ví dụ kết hợp agents:**

```
# Bước 1: Hiểu hệ thống
@system-analyst phân tích luồng xử lý lệnh chuyển tiền và blast radius nếu đổi schema bảng transactions

# Bước 2: Lên kế hoạch
@planner tạo banking-plan cho việc thêm cột audit_log vào bảng transactions

# Bước 3: Sau implement — review bảo mật
@security-reviewer review migration script vừa viết
```

---

<h2 id="workflow">6. Quy trình làm việc chuẩn</h2>

<div class="flow">

<div class="flow-step">
<div class="flow-num">1</div>
<div><strong>Phân tích hệ thống</strong><br><code>@system-analyst</code> — kiến trúc, luồng nghiệp vụ, blast radius</div>
</div>
<div class="flow-arrow">↓</div>
<div class="flow-step">
<div class="flow-num">2</div>
<div><strong>Lên kế hoạch</strong><br><code>/banking-plan</code> — scope, risks, rollback, verification, approvals</div>
</div>
<div class="flow-arrow">↓</div>
<div class="flow-step">
<div class="flow-num">3</div>
<div><strong>Developer duyệt plan</strong> <span class="badge badge-critical">BẮT BUỘC</span><br>Review plan, xác nhận rõ ràng trước khi proceed</div>
</div>
<div class="flow-arrow">↓</div>
<div class="flow-step">
<div class="flow-num">4</div>
<div><strong>Implement từng phase</strong><br><code>/implement</code> — minimal change, follow existing patterns</div>
</div>
<div class="flow-arrow">↓</div>
<div class="flow-step">
<div class="flow-num" style="background:#059669">4b</div>
<div><strong>Format ngay sau khi AI gen code</strong> <span class="badge" style="background:#dcfce7;color:#166534">Tự động</span><br>Copilot chạy ngay sau khi viết xong file <code>*.cs / *.razor / *.cshtml</code>:<br><code>dotnet format &lt;project&gt; --include &lt;chỉ-file-vừa-viết&gt; --no-restore</code><br><small style="color:#6b7280">Chỉ format file đã chạm vào — không format toàn project</small></div>
</div>
<div class="flow-arrow">↓</div>
<div class="flow-step">
<div class="flow-num">5</div>
<div><strong>Verify</strong><br><code>/test</code> — build, lint, test; <code>/fix</code> nếu failures</div>
</div>
<div class="flow-arrow">↓</div>
<div class="flow-step">
<div class="flow-num">6</div>
<div><strong>Review code</strong><br><code>/line-review</code> — từng dòng; <code>@security-reviewer</code> cho sensitive changes</div>
</div>
<div class="flow-arrow">↓</div>
<div class="flow-step">
<div class="flow-num">7</div>
<div><strong>Cập nhật tài liệu</strong><br><code>/docs-base-update</code> — project-docs-base, changelog, delivery-log</div>
</div>
<div class="flow-arrow">↓</div>
<div class="flow-step">
<div class="flow-num">8</div>
<div><strong>Chuẩn bị PR</strong><br><code>/git</code> — commit message, PR description với evidence</div>
</div>

</div>

---

<h2 id="governance">7. Chạy Governance Checks</h2>

**Chạy local trước khi push:**

```bash
git config core.hooksPath .github/hooks
git push
```

Hoặc chạy trực tiếp:

```powershell
.github\scripts\pre-push-governance-check.ps1 -Mode Warn
```

**Các check sẽ chạy:**

| Check | Nội dung kiểm tra | Kết quả |
|---|---|---|
| **Detect** | Phát hiện project shape (.NET có hay không) | Metadata cho check sau |
| **Validate Copilot package** | Đủ required files, YAML frontmatter hợp lệ, mỗi skill có `SKILL.md` | Warning |
| **Secret Scan** | Tìm private keys, GitHub tokens, AWS keys, password patterns | Warning |
| **Build + Test + Lint** | `dotnet restore`, `dotnet build`, `dotnet test`, `dotnet format --verify-no-changes` | Warning, skip nếu không có .NET |
| **Dependency Audit** | `dotnet list package --vulnerable --include-transitive` | Warning/CVE report |

Muốn chặn push ở máy local thì chạy strict mode:

```powershell
.github\scripts\pre-push-governance-check.ps1 -Mode Strict
```

**Xem kết quả failed job:**

```bash
gh run list --limit 10
gh run view <run-id> --log-failed
```

---

<h2 id="docs">8. Tài liệu dự án (.github/docs/)</h2>

Ba file phải cập nhật sau mỗi thay đổi quan trọng:

| File | Mục đích | Cập nhật khi |
|---|---|---|
| [project-docs-base.md](project-docs-base.md) | Tài liệu sống: scope, kiến trúc, rules hiện tại | Thay đổi behavior, setup, architecture, API |
| [project-changelog.md](project-changelog.md) | Lịch sử thay đổi có ngày tháng | Mỗi feature/fix/migration |
| [feature-delivery-log.md](feature-delivery-log.md) | Delivery log chi tiết với evidence, risks, rollback | Mỗi delivery có ý nghĩa |

**Cập nhật tự động bằng Copilot:**

```
/docs-base-update [mô tả thay đổi vừa làm]
```

Copilot sẽ đọc context và cập nhật cả 3 file đúng format.

**Template entry trong delivery log:**

```markdown
## [DATE] Feature/Fix Name

- **Goal**: ...
- **Scope**: files changed
- **Verification**: commands run + result
- **Risks**: residual risks
- **Rollback**: how to revert
- **Evidence**: test output / lint clean / build success
```

---

<h2 id="security">9. Quy tắc bảo mật tuyệt đối</h2>

<div class="callout callout-danger">
<strong>Những điều KHÔNG BAO GIỜ được làm:</strong>
</div>

| Hành động cấm | Lý do |
|---|---|
| Đưa data thật của khách hàng vào code/test/log/docs | Vi phạm banking data safety |
| Hardcode credentials, tokens, API keys bất kỳ đâu | Secret exposure risk |
| Dùng production data làm test data | PII/regulatory violation |
| Bỏ qua human review trước merge vào main | Banking control requirement |
| Log secrets, OTP, session IDs, private keys | Audit/security violation |
| Push force hoặc reset hard trên shared branches | Destructive action |
| Deploy/migrate DB production không có rollback plan | Irreversible risk |

**Copilot cũng sẽ từ chối:**
- Tạo code giả lập / fake integration (simulate features)
- Làm yếu test để pass
- Bỏ qua validation tại trust boundaries
- Implement thay đổi DB/auth/encryption trước khi có explicit approval

---

<h2 id="cautruc">10. Cấu trúc thư mục tham khảo nhanh</h2>

```
.github/
│
├── copilot-instructions.md              ← Banking gates, LUÔN active với mọi file
│
├── instructions/
│   ├── banking-grade-engineering.instructions.md   ← applyTo: ** (tất cả)
│   ├── aspnet-core.instructions.md                 ← applyTo: *.cs, *.csproj, ...
│   └── copilot-package-knowledge-base.instructions.md  ← applyTo: .github/**
│
├── prompts/                             ← 22 prompts, gọi bằng /tên-prompt
│   ├── ask.prompt.md
│   ├── analyze-code.prompt.md
│   ├── explain-code.prompt.md
│   ├── plan.prompt.md
│   ├── banking-plan.prompt.md           ← Dùng cho mọi thay đổi banking-grade
│   ├── implement.prompt.md
│   ├── fix.prompt.md
│   ├── logic-check.prompt.md
│   ├── test.prompt.md
│   ├── review.prompt.md
│   ├── line-review.prompt.md            ← Bắt buộc trước mỗi PR
│   ├── docs-update.prompt.md
│   ├── docs-base-update.prompt.md
│   ├── scout.prompt.md
│   ├── git.prompt.md
│   ├── mcp.prompt.md
│   ├── azure-devops-intake.prompt.md
│   ├── db-schema-context.prompt.md
│   ├── internal-knowledge.prompt.md
│   ├── deep-research.prompt.md
│   ├── architecture-research.prompt.md
│   └── devloop.prompt.md               ← Full pipeline end-to-end
│
├── agents/                              ← 11 agents, chọn trong Agent mode
│   ├── system-analyst.agent.md
│   ├── planner.agent.md
│   ├── researcher.agent.md
│   ├── tester.agent.md
│   ├── debugger.agent.md
│   ├── code-reviewer.agent.md
│   ├── security-reviewer.agent.md
│   ├── docs-manager.agent.md
│   ├── knowledge-curator.agent.md
│   ├── notebook-task-analyst.agent.md
│   └── research-architect.agent.md
│
├── skills/                              ← 18 domain skills, tự động theo context
│   ├── banking-grade-engineering/
│   ├── system-analysis/
│   ├── codebase-reading/
│   ├── business-logic-analysis/
│   ├── code-solution-fit/
│   ├── planning-governance/
│   ├── secure-code-review/
│   ├── testing-verification/
│   ├── docs-base-maintenance/
│   ├── root-cause-debugging/
│   ├── backend-api-governance/
│   ├── database-data-integrity/
│   ├── release-devops-governance/
│   ├── aspnet-core-governance/
│   ├── dotnet-testing/
│   ├── mcp-integration-governance/
│   ├── internal-knowledge-governance/
│   └── deep-research-governance/
│
├── hooks/
│   └── pre-push                        ← Warning local trước git push
│
├── scripts/
│   └── pre-push-governance-check.ps1   ← Package/secret/.NET checks
│
├── copilot/                             ← Knowledge base cho RAG retrieval
│   ├── README.md
│   ├── banking-grade-engineering.md
│   ├── workflow-playbook.md
│   ├── codebase-analysis-playbook.md
│   ├── azure-devops-mcp-playbook.md
│   ├── mcp-tool-registry.template.md
│   ├── internal-knowledge-playbook.md
│   ├── knowledge-source-register.template.md
│   ├── deep-research-playbook.md
│   ├── manual-tooling-guide.md
│   ├── copilot-architecture.md
│   ├── skills-index.md
│   ├── prompt-catalog.md
│   ├── agent-catalog.md
│   ├── official-docs-snapshot.md
│   ├── copilot-project-assessment.md
│   └── references/
│       ├── aspnet-core-service-patterns.md
│       ├── dotnet-data-integration-patterns.md
│       └── analysis-debug-review-patterns.md
│
└── docs/                                ← Tài liệu dự án (cập nhật liên tục)
    ├── README.md
    ├── project-docs-base.md
    ├── project-changelog.md
    ├── feature-delivery-log.md
    ├── huong-dan-su-dung.md             ← File này
    ├── ai-project-developer-guide.md
    ├── ai-project-developer-guide.pdf
    ├── huong-dan-su-dung.pdf
    └── ai-project-presentation.html
```

---

<h2 id="hooks">11. Format code sau khi AI gen</h2>

Copilot **tự động format ngay** sau khi viết hoặc sửa bất kỳ file `.cs`, `.razor`, `.cshtml` nào — chỉ format những file vừa bị thay đổi, không đụng vào phần còn lại của project.

<div class="callout">
Quy tắc này được cài vào tất cả 3 lớp: <code>copilot-instructions.md</code>, <code>aspnet-core.instructions.md</code>, và từng prompt (<code>/implement</code>, <code>/fix</code>, <code>/devloop</code>). Copilot sẽ chạy format đúng thời điểm — ngay khi vừa viết xong file.
</div>

<h3>Lệnh Copilot chạy sau khi gen code</h3>

```powershell
# Copilot sẽ tự chạy lệnh này sau khi viết bất kỳ .cs / .razor / .cshtml
dotnet format MyProject.sln --include src/Services/AccountService.cs --no-restore

# Nếu nhiều file:
dotnet format MyProject.sln --include src/Services/AccountService.cs src/Controllers/AccountController.cs --no-restore
```

<h3>Quy tắc scope</h3>

| Điều kiện | Hành động |
|---|---|
| AI vừa viết/sửa `*.cs`, `*.razor`, `*.cshtml` | **Format ngay** chỉ những file đó |
| File khác (`.json`, `.md`, `.yml`, ...) | Không format |
| Toàn bộ project | **Không bao giờ** — chỉ format file đã chạm vào |

<h3>Mối quan hệ với pre-push warning</h3>

| Lớp | Công cụ | Hành động |
|---|---|---|
| **Copilot (AI gen)** | `dotnet format --include <files>` | **Fix ngay** — format khi AI vừa viết xong |
| **Pre-push warning** | `dotnet format --verify-no-changes` | **Verify** — cảnh báo trước khi push nếu code chưa format |

Nếu có file nào chưa format lọt qua: hook sẽ cảnh báo trước khi push. Hook mặc định không block push, trừ khi developer chạy strict mode.

---

<div style="margin-top:2.5rem; padding:1rem 1.5rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; font-size:.9rem; color:#166534;">
<strong>Package status:</strong> Production-ready &nbsp;|&nbsp;
<strong>Files:</strong> 85 &nbsp;|&nbsp;
<strong>Broken references:</strong> 0 &nbsp;|&nbsp;
<strong>Security issues:</strong> 0 &nbsp;|&nbsp;
<strong>Last reviewed:</strong> 2026-05-13
</div>

</body>
</html>
