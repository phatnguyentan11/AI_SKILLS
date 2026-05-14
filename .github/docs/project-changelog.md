# Project Changelog

## [v1.3.14] 2026-05-14 - Restore English technical terms and redesign layered architecture diagram

- Switched key developer and AI technical terms in the introduce HTML back to English while keeping the surrounding guidance in Vietnamese.
- Replaced the small Mermaid-based layered architecture block with a larger HTML/CSS poster diagram for better readability.
- Increased architecture diagram typography, spacing, and card sizing so the overview can be read without zooming.

## [v1.3.13] 2026-05-14 - Polish introduce docs shell, branding, and local navigation

- Refined the introduce HTML visual system with a tighter blue palette, calmer glass navigation, larger hero typography, and more consistent spacing.
- Standardized the introduce brand header/footer around `Project AI` with the neutral node icon and SmartSales ownership/contact.
- Fixed the left sidebar collapse behavior so the layout actually expands the center content instead of only hiding labels.
- Restored safe local navigation for `file://` usage by guarding History API calls and handling in-page TOC scrolling without `pushState` errors.
- Removed the tutorial setup section from the agent-flow page and cleaned up several visible labels to better match the Vietnamese docs tone.

## [v1.3.12] 2026-05-14 - Simplify daily usage flow and document screenshot check attempt

- Removed the setup section from the daily usage page so it focuses on actual Project AI usage flow.
- Updated the daily usage hero copy to emphasize asking, prompt selection, execution, review, and docs update.
- Attempted browser-headless screenshots for diagram verification; local browser execution was blocked by environment sandbox/security policy.

## [v1.3.11] 2026-05-14 - Refresh introduce content with Vietnamese copy and poster diagrams

- Rewrote the introduce HTML render data with Vietnamese accented copy.
- Replaced the previous generic layered diagram with a Project AI architecture poster: Developer Workspace, Copilot Runtime, Policy Layer, Agent Orchestration, Skills, Knowledge Base, Safety Guardrails, Evidence, and Local Governance.
- Simplified the five HTML pages into clean Vietnamese shells; `docs.js` now owns the rendered content consistently.
- Updated diagram styling so the architecture reads closer to a vertical system map instead of loose cards.

## [v1.3.10] 2026-05-14 - Guard History API for local file usage

- Fixed `SecurityError: Failed to execute 'pushState' on 'History'` when introduce HTML is opened directly with `file://`.
- Added safe wrappers around `history.pushState` and `history.replaceState`.
- Kept left-panel navigation rendering center content from bundled `PAGE_DATA` even when URL mutation is blocked by the browser.

## [v1.3.9] 2026-05-14 - Remove local HTML navigation jitter and add layered diagrams

- Replaced fetch-based HTML navigation with bundled in-page `PAGE_DATA` rendering so local `file://` usage no longer falls back to full-page reload.
- Kept the left panel stable while only the center content and right-side progress/TOC panel update.
- Fixed step/progress interactions by rebinding right-panel links and step tabs after each render.
- Added layered Project AI architecture diagrams for overview, usage, agent flow, and quick reference pages.

## [v1.3.8] 2026-05-14 - Improve introduce HTML navigation shell

- Changed the left-panel toggle to `<<` / `>>`.
- Made collapsed left panel shrink the layout column so the main content gets more horizontal space.
- Added a SmartSales ownership/contact footer to the introduce HTML shell.
- Added client-side navigation for HTML pages so clicks update main content and right-side tracking without re-rendering the left panel when browser fetch support is available.
- Standardized the tutorial page brand header back to `Project AI`.

## [v1.3.7] 2026-05-14 - Remove UI documentation-guide framing

- Removed style-guide and external docs-writing references from the introduce README.
- Kept introduce entry points focused on Project AI usage only: overview, daily usage, agent flow, and quick reference.
- Removed remaining `docs experience` / `Docs + Agent Layer` phrasing from the HTML overview.
- Removed `.github/introduce/03-ai-docs-presentation.md` and presenter links from the active introduce set.
- Kept the current local-only boundary unchanged.

## [v1.3.6] 2026-05-14 - Refocus introduce HTML on Project AI usage

- Removed the HTML presentation page and removed presentation/navigation entries from the introduce HTML experience.
- Replaced the generic package-guide framing with direct Project AI usage guidance.
- Removed HTML landing sections about UI mockups, UX design logic, Mermaid examples, and frontend tech stack recommendations.
- Follow-up cleanup later removed the Markdown presentation notes as well so introduce only contains Project AI usage docs.

## [v1.3.5] 2026-05-14 - Stabilize introduce HTML left navigation

- Removed the `Docs Home` label from introduce HTML navigation and replaced it with `Package Guide`.
- Standardized the left sidebar across all introduce HTML pages so page selection does not change the left-panel structure.
- Kept only the active navigation item changing per page.

## [v1.3.4] 2026-05-14 - Replace placeholder intro copy with package-specific guidance

- Updated introduce HTML and README copy to describe the real `.github` Copilot package, local checks, prompts, agents, skills, and blocked-rules workflow.
- Removed generic marketing-style phrasing from the docs landing page.
- Kept the existing HTML layout and interactions unchanged.

## [v1.3.3] 2026-05-14 - Split introduce HTML into dedicated folder

- Moved visual introduce HTML into `.github/introduce/html/` while keeping Markdown files in `.github/introduce/` root.
- Added separate HTML pages for overview, usage guide, presentation, and quick reference.
- Replaced the visual CSS with `.github/introduce/html/assets/sea.css` using a light sea-blue theme.
- Added more HTML/CSS diagrams for AI system flow, data flow, working flow, user thinking flow, local governance, and prompt selection.
- Upgraded the HTML docs app with a 3-column layout, sidebar search/collapse, right-side active TOC, code copy, term tooltips, interactive diagrams, and a detailed agent-flow tutorial page.

## [v1.3.2] 2026-05-14 - Visual introduce docs refresh

- Added `.github/introduce/index.html` as a lively visual landing page for the introduce documentation.
- Added `.github/introduce/assets/introduce.css` for responsive card, flow, callout, and dashboard-style presentation.
- Rewrote introduce Markdown docs with clearer Vietnamese copy and more overview-to-detail Mermaid diagrams.
- Kept the same local-only governance boundary; no PR, branch protection, CODEOWNERS, GitHub Actions, or CI/CD changes.

## [v1.3.1] 2026-05-14 - Move non-technical guide docs out of docs folder

- Removed old onboarding/presentation files from `.github/docs/`:
  - `.github/docs/ai-project-developer-guide.md`
  - `.github/docs/ai-project-presentation.html`
  - `.github/docs/huong-dan-su-dung.md`
- Kept technical docs records in `.github/docs/`: README, docs base, changelog, and delivery log.
- Kept replacement onboarding, usage, overview, presentation, and quick-reference content under `.github/introduce/`.

## [v1.3.0] 2026-05-14 - Professional introduce documentation set

- Added `.github/introduce/` as the focused entry point for onboarding and presentation docs.
- Added system overview, usage guide, keynote-style presentation script, and quick reference docs in Vietnamese.
- Kept the current local-only governance scope: no PR template, CODEOWNERS, branch protection, or CI/CD enforcement added.
- Updated docs base and README entry points to include the new introduce documentation set.

## [v1.2.1] 2026-05-14 - Central blocked-rules authority

- Added `.github/copilot/blocked-rules.md` as the single source of truth for non-negotiable blocked rules.
- Updated top-level, banking, and ASP.NET instructions to reference blocked-rules instead of maintaining duplicate blocked lists.
- Updated setup and pre-push validation to require the blocked-rules file.
- Changed the pre-push .NET policy scan to load tab-delimited scan rules from blocked-rules instead of hardcoding them in the script.

## [v1.2.0] 2026-05-14 - Component-first .NET banking policy hardening

- Hardened top-level Copilot instructions with component-first, dependency allowlist, centralized DI/config, KISS/DRY/YAGNI, sensitive logging, and stack-trace exposure gates.
- Updated ASP.NET Core instructions with .NET 8 style guidance, `System.Text.Json` preference, centralized options/DI rules, and error/logging policy.
- Updated banking-grade instructions to require approved existing components before new helper/middleware/library generation.
- Added pre-push policy scans for Newtonsoft.Json usage, console logging, possible stack trace exposure, sensitive-data logging, and ad hoc `new ServiceCollection`.
- Updated docs base with the new style-governance behavior.

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
