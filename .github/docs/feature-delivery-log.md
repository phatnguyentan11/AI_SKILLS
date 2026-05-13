# Feature Delivery Log

Use this log after every feature, fix, migration, architecture change, security change, operational change, or setup change to this standalone `.github/` package.

## 2026-05-13 - Notebook Task Analyst Agent

### Plan
- Add a dedicated agent for document-heavy tasks that begin with NotebookLM task briefs and cited internal sources.
- Keep the agent bounded: validate source hygiene, analyze the codebase, produce planner-ready output, and avoid implementation before approval.
- Update agent catalog and developer docs so the team knows when to use this agent before `/banking-plan`.

### Changed Files
- `.github/agents/notebook-task-analyst.agent.md`
- `.github/copilot/agent-catalog.md`
- `.github/docs/ai-project-developer-guide.md`
- `.github/docs/ai-project-presentation.html`
- `.github/docs/huong-dan-su-dung.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification
- Commands run:
  - `.github\scripts\pre-push-governance-check.ps1 -Mode Warn`
  - agent count check for `.github/agents/*.agent.md`
  - secret pattern scan
- Results:
  - Agent count: 11.
  - New agent has YAML frontmatter.
  - Local pre-push governance check passes.
  - Secret pattern scan passed.

### Line Review
- Reviewer: Codex
- Critical/high findings:
  - None known at edit time.
- Residual risk:
  - The agent cannot directly access NotebookLM unless the client exposes an approved connector; it expects pasted NotebookLM brief/citations or approved internal knowledge summaries.

### Security, Privacy, Data Impact
- Sensitive data touched: none.
- Auth/authz impact: none.
- Logging impact: none.
- Data integrity impact: none.

### Docs Updated
- `.github/docs/ai-project-developer-guide.md`
- `.github/docs/ai-project-presentation.html`
- `.github/docs/huong-dan-su-dung.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Rollback
- Remove `.github/agents/notebook-task-analyst.agent.md` and revert the catalog/docs updates.

## 2026-05-13 - Local Pre-Push Governance Warning

### Plan
- Replace the manual GitHub Actions governance workflow with a local `git push` warning mechanism.
- Keep the checks developer-friendly: warn before push by default, allow strict local enforcement when explicitly requested.
- Preserve the same governance intent: package validation, frontmatter checks, skill inventory, secret scan, and conditional .NET restore/build/format/test/dependency audit.

### Changed Files
- `.github/workflows/manual-governance-checks.yml`
- `.github/hooks/pre-push`
- `.github/scripts/pre-push-governance-check.ps1`
- `.github/copilot/README.md`
- `.github/copilot/copilot-architecture.md`
- `.github/copilot/copilot-project-assessment.md`
- `.github/copilot/manual-tooling-guide.md`
- `.github/docs/ai-project-developer-guide.md`
- `.github/docs/ai-project-presentation.html`
- `.github/docs/huong-dan-su-dung.md`
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification
- Commands run:
  - `.github\scripts\pre-push-governance-check.ps1 -Mode Warn`
  - `rg --files -uu .github | Measure-Object`
  - `Test-Path .github\workflows\manual-governance-checks.yml`
- Results:
  - Local pre-push governance check passed.
  - `.github` file count: 85.
  - Manual workflow file removed.
  - Package-only repository has no .NET application code, so .NET build/test/lint/audit checks were reported as not applicable.
- Checks not run:
  - No GitHub Actions pipeline was run because this change intentionally moves the check to local pre-push warning mode.
  - The shell hook wrapper was not executed in this PowerShell environment because `sh` is not on PATH; Git for Windows normally runs hook files through its bundled shell when `core.hooksPath` is enabled.

### Line Review
- Reviewer: Codex
- Critical/high findings:
  - None found.
- Residual risk:
  - Git hooks are local clone configuration. Developers must run `git config core.hooksPath .github/hooks` once per clone.
  - Warning mode does not block push. Use `AI_GOVERNANCE_STRICT=1` or `-Mode Strict` for local blocking behavior.

### Security, Privacy, Data Impact
- Sensitive data touched: none.
- Auth/authz impact: reduced server-side workflow permissions by removing the GitHub Actions workflow.
- Logging impact: governance warnings are printed locally before push.
- Data integrity impact: none.

### Docs Updated
- `.github/docs/ai-project-developer-guide.md`
- `.github/docs/ai-project-presentation.html`
- `.github/docs/huong-dan-su-dung.md`
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`
- `.github/copilot/README.md`
- `.github/copilot/copilot-architecture.md`
- `.github/copilot/copilot-project-assessment.md`
- `.github/copilot/manual-tooling-guide.md`

### Rollback
- Restore `.github/workflows/manual-governance-checks.yml` and remove `.github/hooks/pre-push` plus `.github/scripts/pre-push-governance-check.ps1`.

## 2026-05-13 - Remove Duplicate Docs Index

### Plan
- Remove `.github/docs/docs.html` because the Markdown developer guide and HTML presentation now cover the onboarding/documentation surface.
- Update documentation inventory and counts after the removal.

### Changed Files
- `.github/docs/docs.html`
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`
- `.github/docs/ai-project-developer-guide.md`
- `.github/docs/huong-dan-su-dung.md`

### Verification
- Commands run:
  - `rg --files -uu .github | Measure-Object`
  - `Test-Path .github\docs\docs.html`
  - `Get-ChildItem .github\docs -File | Measure-Object`
  - secret pattern scan
- Results:
  - `.github/docs/docs.html` is removed.
  - `.github` file count: 82.
  - Docs file count: 7.
  - Secret pattern scan passed.

### Line Review
- Reviewer: Codex
- Critical/high findings:
  - None known at edit time.
- Residual risk:
  - Historical delivery-log entries may still mention files that existed at the time of those deliveries.

### Security, Privacy, Data Impact
- Sensitive data touched: none.
- Auth/authz impact: none.
- Logging impact: none.
- Data integrity impact: none.

### Docs Updated
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`
- `.github/docs/ai-project-developer-guide.md`
- `.github/docs/huong-dan-su-dung.md`

### Rollback
- Restore `.github/docs/docs.html` and revert the inventory/count updates if a separate docs index is needed again.

## 2026-05-13 - Developer Guide And Presentation Refresh

### Plan
- Read the current `.github` AI package and turn the architecture, workflows, prompts, agents, skills, MCP, internal knowledge, and Deep Research governance into developer-facing documentation.
- Add a Vietnamese Markdown guide with Mermaid architecture/data-flow diagrams and practical prompt examples.
- Redesign the HTML presentation as a single-file guide with sidebar navigation, Tailwind layout, Prism code highlighting, Lucide icons, Inter font, Mermaid diagrams, callouts, and step-by-step execution sections.
- Keep active documentation aligned with Azure DevOps as the work item source and avoid reintroducing removed payment or web-specific guidance.

### Changed Files
- `.github/docs/ai-project-developer-guide.md`
- `.github/docs/ai-project-presentation.html`
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`
- `.github/docs/docs.html`
- `.github/docs/huong-dan-su-dung.md`

### Verification
- Commands run:
  - `rg --files -uu .github | Measure-Object`
  - prompt count check for `.github/prompts/*.prompt.md`
  - agent count check for `.github/agents/*.agent.md`
  - skill count check for `.github/skills/*`
  - `SKILL.md` inventory check
  - prompt/agent/instruction frontmatter inspection
  - secret pattern scan
  - active docs/surface scan for removed issue-tracker/payment/web-specific keywords
- Results:
  - `.github` file count: 83.
  - Prompt count: 22.
  - Agent count: 10.
  - Skill count: 18.
  - All skills contain `SKILL.md`.
  - Frontmatter present for prompts, agents, and instructions.
  - Secret pattern scan passed.
  - Active scope keyword scan returned no matches.
- Checks not run:
  - GitHub Actions not run because this repository is package-only and workflow is manual-only.
  - Browser screenshot review not run; HTML is static and can be opened directly from `.github/docs/ai-project-presentation.html`.

### Line Review
- Reviewer: Codex
- Critical/high findings:
  - None found.
- Resolved findings:
  - Removed an active guide reference to an out-of-scope issue tracker name so the docs consistently point to `dev.azure.com`.
- Residual risk:
  - The HTML uses CDN-hosted Tailwind, Prism, Lucide, Mermaid, and Inter assets; diagrams and styling require network access when opened offline.

### Security, Privacy, Data Impact
- Sensitive data touched: none.
- Auth/authz impact: none.
- Logging impact: none.
- Data integrity impact: none.

### Docs Updated
- `.github/docs/ai-project-developer-guide.md`
- `.github/docs/ai-project-presentation.html`
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`
- `.github/docs/docs.html`
- `.github/docs/huong-dan-su-dung.md`

### Rollback
- Remove `.github/docs/ai-project-developer-guide.md` and revert the presentation/docs index/changelog/log updates to restore the prior documentation set.

### Follow-Ups
- Open `.github/docs/ai-project-presentation.html` in a browser and review visual rendering after CDN assets load.
- Add real Azure DevOps MCP connector details only after enterprise owners approve scope and permissions.

## 2026-05-13 - Azure DevOps MCP And R&D Governance

### Plan
- Add governed Azure DevOps MCP intake for `dev.azure.com`.
- Add internal knowledge governance for NotebookLM-style source curation and private docs.
- Add Deep Research governance for evidence-backed architecture and library research.
- Keep all external context read-only by default and approval-gated for writes.

### Changed Files
- `.github/copilot-instructions.md`
- `.github/copilot/README.md`
- `.github/copilot/workflow-playbook.md`
- `.github/copilot/manual-tooling-guide.md`
- `.github/copilot/azure-devops-mcp-playbook.md`
- `.github/copilot/mcp-tool-registry.template.md`
- `.github/copilot/internal-knowledge-playbook.md`
- `.github/copilot/knowledge-source-register.template.md`
- `.github/copilot/deep-research-playbook.md`
- `.github/copilot/skills-index.md`
- `.github/copilot/prompt-catalog.md`
- `.github/copilot/agent-catalog.md`
- `.github/copilot/copilot-architecture.md`
- `.github/copilot/copilot-project-assessment.md`
- `.github/copilot/official-docs-snapshot.md`
- `.github/prompts/mcp.prompt.md`
- `.github/prompts/azure-devops-intake.prompt.md`
- `.github/prompts/db-schema-context.prompt.md`
- `.github/prompts/internal-knowledge.prompt.md`
- `.github/prompts/deep-research.prompt.md`
- `.github/prompts/architecture-research.prompt.md`
- `.github/skills/mcp-integration-governance/SKILL.md`
- `.github/skills/internal-knowledge-governance/SKILL.md`
- `.github/skills/deep-research-governance/SKILL.md`
- `.github/agents/knowledge-curator.agent.md`
- `.github/agents/research-architect.agent.md`
- `.github/workflows/manual-governance-checks.yml`
- `.github/docs/*`

### Verification
- Commands run:
  - `rg --files -uu .github`
  - frontmatter and `SKILL.md` inventory check
  - `rg -n -i "payment|payments|PaymentService|frontend|front-end|ui ux|ui/ux|web frontend" ...`
  - package count check for files, prompts, agents, and skills
  - secret pattern scan
- Results:
  - `.github` file count: 82.
  - Prompt count: 22.
  - Agent count: 10.
  - Skill count: 18.
  - Frontmatter and skill inventory passed.
  - No active out-of-scope issue-tracker/payment/frontend references in instructions, prompts, agents, skills, presentation, or user guide.
  - Secret pattern scan passed.
- Checks not run:
  - GitHub Actions not run because this repository is package-only and workflow is manual-only.

### Line Review
- Reviewer: Codex
- Critical/high findings:
  - None known at plan time.
- Resolved findings:
  - Replaced the earlier issue-tracker intake assumption with Azure DevOps intake.
- Residual risk:
  - Actual MCP connectors still require enterprise approval and runtime setup outside this package.

### Security, Privacy, Data Impact
- Sensitive data touched: none.
- Auth/authz impact: positive governance impact through allowlist and read-only defaults.
- Logging impact: pipeline logs and chat exports are explicitly caution-gated.
- Data integrity impact: database schema context is metadata-only by default.

### Docs Updated
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`
- `.github/docs/docs.html`
- `.github/docs/ai-project-presentation.html`
- `.github/docs/huong-dan-su-dung.md`

### Rollback
- Remove the new MCP, knowledge, and deep research files and revert the catalog/docs updates if the target repository does not want external context governance.

### Follow-Ups
- Add real project MCP connector entries after Azure DevOps, Slack, database schema, and internal knowledge owners approve scope.
- Decide whether Deep Research uses ChatGPT, OpenAI API, or another enterprise-approved research tool.

## 2026-05-13 - AI Project Presentation & Vietnamese User Guide

### Plan
- Đọc toàn bộ project, phân tích kiến trúc, agents, skills, prompts, instructions.
- Viết tài liệu hướng dẫn sử dụng bằng tiếng Việt, có sơ đồ Mermaid, dành cho team dev chưa nắm về AI.
- Tập trung: (1) sức mạnh AI vs project; (2) 7 luồng sử dụng chính.
- Tổng hợp thành HTML file hoàn chỉnh với Mermaid.js diagrams.

### Changed Files
- `.github/docs/ai-project-presentation.html` — **NEW**: HTML presentation tiếng Việt, 6 phần, 10+ Mermaid diagrams
- `.github/docs/feature-delivery-log.md` — entry này

### Verification
- File created: `.github/docs/ai-project-presentation.html` ✓
- Nội dung bao gồm:
  - Phần 1: Sức mạnh AI (evolution diagram, comparison table, stats)
  - Phần 2: Kiến trúc project (architecture diagram, 3-layer model, component table)
  - Phần 3: 7 luồng chính với flowchart riêng cho mỗi luồng
  - Phần 4: Quy trình 10 bước chuẩn (workflow diagram)
  - Phần 5: Quick start guide, scenario table, do/don't
  - Phần 6: Target model diagram, summary cards

### Line Review
- Reviewer: Copilot
- Critical/high findings: none
- Security: không có PII, credentials, production data trong HTML
- Residual risk: Mermaid.js load từ CDN — cần internet để render diagrams

### Security, Privacy, Data Impact
- Sensitive data: none — tài liệu nội bộ, không có production data
- Auth/authz: none
- Data integrity: none

### Docs Updated
- `.github/docs/feature-delivery-log.md` — entry này

### Rollback
- Xóa file `.github/docs/ai-project-presentation.html` để revert.

### Follow-Ups
- Mở file HTML trong browser để xem presentation hoàn chỉnh.
- Khi cần update: chỉnh sửa file `.github/docs/ai-project-presentation.html` trực tiếp.

---

## 2026-05-13 - Post-Generate Format Rule And User Guide

### Plan
- Add a rule requiring Copilot to format only the `.cs`/`.razor`/`.cshtml` files it just wrote, immediately after generation — not the whole project.
- Add user guide (`huong-dan-su-dung.md`) to `.github/docs/`.

### Changed Files
- `.github/copilot-instructions.md` — step 6 now includes immediate post-gen format command
- `.github/instructions/aspnet-core.instructions.md` — added Formatting Rules section
- `.github/prompts/implement.prompt.md` — format rule embedded in implementation rules
- `.github/prompts/fix.prompt.md` — format step added after file modification
- `.github/prompts/devloop.prompt.md` — format step added inside implement phase
- `.github/docs/project-docs-base.md` — format rule added to Banking Grade Delivery Rules
- `.github/docs/project-changelog.md` — entry added
- `.github/docs/feature-delivery-log.md` — this entry
- `.github/docs/huong-dan-su-dung.md` — new user guide (HTML+Markdown)

### Verification
- Commands run:
  - Grep scan: no references to removed hooks/ directory remain in any active file
  - Grep scan: format rule present in all 5 target files (copilot-instructions.md, aspnet-core.instructions.md, implement/fix/devloop prompts)
- Checks not run:
  - Runtime dotnet format execution (package-only repo, no .NET application code present)

### Line Review
- Reviewer: Copilot
- Critical/high findings: none
- Resolved findings: removed pre-commit hook approach (wrong timing); replaced with post-gen inline rule
- Residual risk: rule is instruction-level — actual execution depends on Copilot following the instruction at inference time

### Security, Privacy, Data Impact
- Sensitive data touched: none
- Auth/authz impact: none
- Logging impact: none
- Data integrity impact: none

### Docs Updated
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Rollback
- Remove the Formatting Rules sections from the five changed files to revert format behavior.

### Follow-Ups
- When this package is installed into a real .NET repository, validate that `dotnet format --include` works with the actual solution path.

---

## 2026-05-13 - Manual Governance Workflows And Scope Trim

### Plan
- Add manual-only governance workflow checks while CI is not yet enabled for this package repository.
- Remove out-of-scope payment-specific and web-frontend-specific Copilot assets.
- Replace generic npm verification examples with commands that match this `.github`-only repository.

### Changed Files
- `.github/workflows/manual-governance-checks.yml`
- `.github/copilot-instructions.md`
- `.github/instructions/banking-grade-engineering.instructions.md`
- `.github/agents/security-reviewer.agent.md`
- `.github/skills/business-logic-analysis/SKILL.md`
- `.github/skills/banking-grade-engineering/SKILL.md`
- `.github/copilot/*`
- `.github/copilot/references/*`
- `.github/docs/*`

### Removed Files
- `.github/skills/payments-risk-governance/SKILL.md`
- `.github/skills/frontend-quality/SKILL.md`
- `.github/agents/ui-ux-designer.agent.md`
- `.github/prompts/design.prompt.md`

### Verification
- Commands run:
  - `rg --files -uu .github`
  - `rg -n -i "payment|payments|frontend|front-end|ui ux|ui/ux|web frontend" .github`
- Results:
  - Manual workflow added under `.github/workflows/`.
  - Payment and frontend active assets removed.
  - Remaining keyword hits are limited to audit/history text and workflow checks for removed paths.
- Checks not run:
  - GitHub Actions not run because this repository is package-only and CI is intentionally manual for now.

### Line Review
- Reviewer: Codex
- Critical/high findings:
  - Initial workflow validation would have scanned docs history and failed on expected removal notes.
- Resolved findings:
  - Workflow now checks removed asset paths instead of scanning docs for historical words.
- Residual risk:
  - Target application repository still needs branch protection and CODEOWNERS to enforce these checks.

### Security, Privacy, Data Impact
- Sensitive data touched: none.
- Auth/authz impact: none.
- Logging impact: none.
- Data integrity impact: none.

### Docs Updated
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Rollback
- Revert this delivery if the target repository later needs payment or web frontend Copilot guidance.

### Follow-Ups
- Enable pull request triggers after this package is installed into a real application repository.
- Add CODEOWNERS and branch protection in the target repository.

## Entry Template

```markdown
## YYYY-MM-DD - [Feature or Change Name]

### Plan
- Plan path or summary:
- Approvals required:

### Changed Files
- 

### Verification
- Commands run:
- Results:
- Checks not run:

### Line Review
- Reviewer:
- Critical/high findings:
- Resolved findings:
- Residual risk:

### Security, Privacy, Data Impact
- Sensitive data touched:
- Auth/authz impact:
- Logging impact:
- Data integrity impact:

### Docs Updated
- 

### Rollback
- 

### Follow-Ups
- 
```

## 2026-05-13 - Standalone Banking Grade Copilot Package

### Plan
- Converted the Copilot customization into a standalone `.github/` package.
- Promoted only reviewed, Markdown-only, governance-safe skills.
- Removed dependency on external local folders.

### Changed Files
- `.github/copilot-instructions.md`
- `.github/instructions/banking-grade-engineering.instructions.md`
- `.github/instructions/copilot-package-knowledge-base.instructions.md`
- `.github/agents/security-reviewer.agent.md`
- `.github/prompts/banking-plan.prompt.md`
- `.github/prompts/line-review.prompt.md`
- `.github/prompts/docs-base-update.prompt.md`
- `.github/skills/*/SKILL.md`
- `.github/copilot/*`
- `.github/docs/*`

### Verification
- File inventory completed for `.github/`.
- Markdown/frontmatter inspection completed for active Copilot files.
- `.github/copilot-instructions.md` kept compact so banking gates remain near the top.
- Verified `.github/` has no references to external local folders that are required for operation.
- Verified 11 promoted skills exist as Markdown-only `SKILL.md` files.
- Runtime tests not applicable because this repository currently contains documentation/configuration only.

### Line Review
- Completed for the changed Copilot configuration and docs files in this delivery.

### Security, Privacy, Data Impact
- No production or customer data introduced.
- Added explicit sensitive-data handling rules.
- No shell scripts or tool automation copied into promoted skills.

### Docs Updated
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Rollback
- Revert the listed `.github/` files to the previous Copilot configuration if the policy is too strict for a target project.

### Follow-Ups
- Add CI, CODEOWNERS, branch protection, secret scanning, and stack-specific instructions when installed into a real codebase.

## 2026-05-13 - System Analysis And Codebase-Fit Hardening

### Plan
- Compared the trusted reference package against the current standalone package.
- Preserved current banking-grade standalone structure.
- Imported the stronger reference behaviors as clean Copilot-native files: system analysis, codebase reading, logic checking, ASP.NET/.NET governance, and dev-loop approval flow.

### Changed Files
- `.github/copilot-instructions.md`
- `.github/agents/system-analyst.agent.md`
- `.github/agents/planner.agent.md`
- `.github/agents/debugger.agent.md`
- `.github/agents/code-reviewer.agent.md`
- `.github/prompts/analyze-code.prompt.md`
- `.github/prompts/explain-code.prompt.md`
- `.github/prompts/logic-check.prompt.md`
- `.github/prompts/devloop.prompt.md`
- `.github/prompts/implement.prompt.md`
- `.github/prompts/plan.prompt.md`
- `.github/prompts/fix.prompt.md`
- `.github/prompts/review.prompt.md`
- `.github/instructions/aspnet-core.instructions.md`
- `.github/skills/system-analysis/SKILL.md`
- `.github/skills/codebase-reading/SKILL.md`
- `.github/skills/business-logic-analysis/SKILL.md`
- `.github/skills/code-solution-fit/SKILL.md`
- `.github/skills/aspnet-core-governance/SKILL.md`
- `.github/skills/dotnet-testing/SKILL.md`
- `.github/copilot/codebase-analysis-playbook.md`
- `.github/copilot/agent-catalog.md`
- `.github/copilot/prompt-catalog.md`
- `.github/copilot/skills-index.md`
- `.github/copilot/README.md`
- `.github/docs/*`

### Verification
- File inventory completed for `.github/`.
- Reference scan completed: no dependency on external local folders.
- Markdown/frontmatter inspection completed for active Copilot files.
- `.github/copilot-instructions.md` checked at 3982 characters so banking and codebase-first gates remain near the top.
- Verified promoted skills are Markdown-only `SKILL.md` files.
- Runtime tests not applicable because this repository currently contains documentation/configuration only.

### Line Review
- Completed for the changed Copilot configuration and docs files in this delivery.

### Security, Privacy, Data Impact
- No production or customer data introduced.
- No scripts or tool automation copied from reference package.
- Added codebase-first and business-logic controls without importing unsafe hooks/scripts.

### Docs Updated
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Rollback
- Revert the listed files if the target repository should not include ASP.NET/.NET or system-analysis enhancements.

### Follow-Ups
- Add target-repository-specific docs paths once this package is installed into a real codebase.

## 2026-05-13 - Reference-First Banking Flow Highlight

### Plan
- Checked whether the package already enforced: read old/reference project first, compare with current `.github`, create a short plan, wait for review/approval, then patch.
- Gap found: codebase-first and plan gates existed, but reference-first comparison was not promoted as a top critical gate.

### Changed Files
- `.github/copilot-instructions.md`
- `.github/instructions/banking-grade-engineering.instructions.md`
- `.github/copilot/codebase-analysis-playbook.md`
- `.github/copilot/workflow-playbook.md`
- `.github/prompts/devloop.prompt.md`
- `.github/prompts/banking-plan.prompt.md`
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification
- Commands run:
  - `rg -n "reference|old project|compare|plan|approval|business logic|codebase|debug|system analysis|changed line" .github`
  - `(Get-Content .github\copilot-instructions.md -Raw).Length`
- Results:
  - Reference-first comparison, system analysis, codebase-fit, plan approval, line review, and docs update rules are now present in top-level instructions and supporting playbooks/prompts.
  - `.github/copilot-instructions.md` is 3950 characters so critical gates stay compact and near the top.
- Checks not run:
  - Runtime tests not applicable because this package is Markdown configuration and documentation only.

### Line Review
- Reviewer: Codex
- Critical/high findings:
  - Missing explicit top-level reference-first comparison gate before this update.
- Resolved findings:
  - Added mandatory reference-first rule and mirrored it across workflow, analysis, banking plan, and docs.
- Residual risk:
  - Target repository still needs stack-specific verification commands after this standalone `.github/` package is moved.

### Security, Privacy, Data Impact
- Sensitive data touched: none.
- Auth/authz impact: none.
- Logging impact: none.
- Data integrity impact: none.

### Docs Updated
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Rollback
- Revert the listed files if a target repository does not want reference-first migration workflow enforced.

### Follow-Ups
- Add target-repository-specific docs paths and verification commands after installation into a real codebase.

## 2026-05-13 - Sanitized Reference Knowledge Migration

### Plan
- Compare old `skills/*/references` structure with current `.github/skills`.
- Keep skills short and governance-safe.
- Add sanitized reference knowledge under `.github/copilot/references/` for deeper Copilot retrieval.

### Changed Files
- `.github/copilot/references/README.md`
- `.github/copilot/references/aspnet-core-service-patterns.md`
- `.github/copilot/references/dotnet-data-integration-patterns.md`
- `.github/copilot/references/analysis-debug-review-patterns.md`
- `.github/copilot/README.md`
- `.github/copilot/copilot-architecture.md`
- `.github/copilot/skills-index.md`
- `.github/instructions/aspnet-core.instructions.md`
- `.github/skills/aspnet-core-governance/SKILL.md`
- `.github/skills/database-data-integrity/SKILL.md`
- `.github/skills/system-analysis/SKILL.md`
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification
- Commands run:
  - `rg --files -uu [old-reference-package]\.github\skills`
  - `Get-ChildItem -Recurse .github\skills -Force`
  - `rg -n "references|SKILL|skills|business logic|codebase|plan|debug|review|database|ASP.NET" ...`
- Results:
  - Old package contained many reference folders plus scripts, package manifests, tests, and `.env` samples.
  - Current package intentionally keeps skills Markdown-only and moves safe deeper knowledge to `.github/copilot/references/`.
- Checks not run:
  - Runtime tests not applicable because this package is Markdown configuration and documentation only.

### Line Review
- Reviewer: Codex
- Critical/high findings:
  - Detailed ASP.NET/data/debug reference depth was underrepresented after the first migration.
- Resolved findings:
  - Added sanitized reference docs and linked them from relevant skills/instructions.
- Residual risk:
  - Some old provider-specific/cloud/script references remain intentionally excluded until a bank-approved tool review.

### Security, Privacy, Data Impact
- Sensitive data touched: none.
- Auth/authz impact: none.
- Logging impact: none.
- Data integrity impact: positive governance impact through explicit data/integration reference rules.

### Docs Updated
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Rollback
- Remove `.github/copilot/references/` and revert linked docs if the target repository wants only compact skills.

### Follow-Ups
- Add target-repository-specific architecture docs after installing this package into a real codebase.
