# Feature Delivery Log

Use this log after every feature, fix, migration, architecture change, security change, operational change, or setup change to this standalone `.github/` package.

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
