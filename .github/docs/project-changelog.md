# Project Changelog

All meaningful changes to the AI Copilot package are documented here.  
Format: `[vMAJOR.MINOR.PATCH] YYYY-MM-DD — Summary`  
Versioning: MAJOR = breaking architecture change; MINOR = new capability; PATCH = fix/update/cleanup.

---

## [v1.1.0] 2026-05-13 — Architecture diagram refresh + post-clone setup

- Added `.github/scripts/setup.ps1`: post-clone setup script that installs git hooks, validates Copilot package structure, checks agent/skill inventory, and prints onboarding summary. Replaces the manual `git config core.hooksPath` step.
- Updated `.github/docs/ai-project-developer-guide.md`:
  - Added 5-layer architecture diagram (Layer 1–5: instructions → conditional rules → agents → skills → prompts).
  - Added runtime integration diagram showing developer → chat → layers → enforcement → external context.
  - Updated component table with accurate file counts (81 total), added rows for conditional instructions, reference knowledge, and setup scripts.
  - Added Step 0 (post-clone setup) in Quick Start section referencing `setup.ps1`.
- Re-initialized `project-changelog.md` with semantic version tags.

---

## [v1.0.0] 2026-05-13 — Initial stable package

Standalone banking-grade Copilot governance package. Zero runtime dependencies. Portable to any repository.

### Instructions (4 files)

- `copilot-instructions.md`: always-on foundation — 10 critical banking gates + mandatory 10-step workflow (read → search → analyze → plan → implement → verify → review → docs → summarize).
- `banking-grade-engineering.instructions.md`: regulated delivery rules applied to all files (`applyTo: **`).
- `aspnet-core.instructions.md`: ASP.NET Core / C# / .NET patterns applied to `*.cs`, `*.csproj`, `*.sln`.
- `copilot-package-knowledge-base.instructions.md`: meta rules for maintaining the Copilot package itself (`applyTo: .github/**`).

### Agents (9 personas)

`Planner` · `System Analyst` · `Researcher` · `Code Reviewer` · `Security Reviewer` · `Tester` · `Debugger` · `Docs Manager` · `Research Architect`

### Skills (15 domain modules)

`banking-grade-engineering` · `planning-governance` · `secure-code-review` · `system-analysis` · `business-logic-analysis` · `root-cause-debugging` · `aspnet-core-governance` · `backend-api-governance` · `database-data-integrity` · `dotnet-testing` · `release-devops-governance` · `docs-base-maintenance` · `deep-research-governance` · `mcp-integration-governance` · `testing-verification`

### Prompts (21 slash-command workflows)

`plan` · `banking-plan` · `implement` · `test` · `fix` · `devloop` · `review` · `line-review` · `logic-check` · `scout` · `analyze-code` · `explain-code` · `ask` · `git` · `deep-research` · `architecture-research` · `mcp` · `azure-devops-intake` · `db-schema-context` · `docs-update` · `docs-base-update`

### Knowledge base (`.github/copilot/` — 14 files + 4 references)

Playbooks: `workflow-playbook.md` · `banking-grade-engineering.md` · `codebase-analysis-playbook.md` · `azure-devops-mcp-playbook.md` · `deep-research-playbook.md` · `manual-tooling-guide.md` · `copilot-architecture.md` · `agent-catalog.md` · `skills-index.md` · `prompt-catalog.md` · `mcp-tool-registry.template.md` · `official-docs-snapshot.md` · `copilot-project-assessment.md` · `README.md`

References: `aspnet-core-service-patterns.md` · `dotnet-data-integration-patterns.md` · `analysis-debug-review-patterns.md` · `README.md`

### Local enforcement

- `pre-commit` hook → `format-staged-files.ps1` (format warn, never blocks).
- `pre-push` hook → `pre-push-governance-check.ps1` (validates package files, scans secrets, delegates to `pre-push-dotnet-check.ps1` when `.sln`/`.csproj` present).
- `install-hooks.ps1`: manual hook installer with optional `-Strict` mode.

### Docs base (`.github/docs/` — 7 files)

`project-docs-base.md` · `project-changelog.md` · `feature-delivery-log.md` · `ai-project-developer-guide.md` · `ai-project-presentation.html` · `huong-dan-su-dung.md` · `README.md`
