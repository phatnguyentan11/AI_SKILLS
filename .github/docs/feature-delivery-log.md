# Feature Delivery Log

Use this log after every feature, fix, migration, architecture change, security change, operational change, or setup change to this standalone `.github/` package.

## 2026-05-14 - Restore English Technical Terms And Redesign Overview Architecture Diagram

### Plan

- Keep Vietnamese instructional copy, but switch developer and AI technical terms back to English in the high-visibility introduce HTML areas.
- Replace the overview layered architecture Mermaid diagram with a larger HTML/CSS poster diagram.
- Increase diagram readability with larger titles, larger cell text, and calmer spacing.
- Re-run JavaScript syntax and governance checks.

### Changed Files

- `.github/introduce/html/assets/docs.js`
- `.github/introduce/html/assets/sea.css`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification

- Commands run:
  - `node --check .github\introduce\html\assets\docs.js`
  - `rg -n "Developer Workspace|Copilot Runtime|Policy Layer|Agent Orchestration|Skill Layer|Knowledge Base|Safety Guardrails|Evidence Output|Local Governance|Allowed input|Never send to AI|Required AI output|Plan before implement|Update docs after changes|Prompt Router|Policy Guard|Agent Runtime" .github\introduce\html\assets\docs.js .github\introduce\html\assets\sea.css`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File .github\scripts\pre-push-governance-check.ps1 -Mode Warn`
- Results:
  - JavaScript syntax check passed.
  - Overview architecture now renders from HTML/CSS blocks instead of a small Mermaid flowchart.
  - Key technical terms are restored to English in the updated sections.
  - Governance check passed.

### Line Review

- Reviewer: Codex
- Critical/high findings:
  - The layered architecture Mermaid diagram was too small to read comfortably in the docs layout.
  - Several developer and AI terms had been translated too aggressively, which reduced the natural product feel of the documentation.
- Resolved findings:
  - Replaced the layered architecture block with a poster-style HTML diagram.
  - Increased architecture title, subtitle, icon, and cell typography.
  - Restored English technical terms in the workflow, safety, tutorial pipeline, and quick-reference touchpoints that were updated in this pass.
- Residual risk:
  - Some older sections outside the touched areas may still contain mixed Vietnamese/English phrasing and can be normalized in a later editorial pass.

### Security, Privacy, Data Impact

- Sensitive data touched: none.
- Auth/authz impact: none.
- Logging impact: none.
- Data integrity impact: none.

### Docs Updated

- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Rollback

- Revert the listed HTML/CSS/docs files to restore the previous Mermaid architecture block and wording.

---

## 2026-05-14 - Polish Introduce HTML Shell, Branding, And Local Navigation

### Plan

- Align the introduce HTML brand, header icon, footer, and core color system around one product identity.
- Make the left sidebar collapse state expand the center content area instead of only hiding labels.
- Fix local `file://` navigation and TOC behavior so switching pages and sections does not trigger History API security errors.
- Remove the setup block from the agent-flow tutorial and clean up a few visible labels to better match the Vietnamese usage guide tone.
- Re-run JavaScript syntax and governance checks.

### Changed Files

- `.github/introduce/html/index.html`
- `.github/introduce/html/overview.html`
- `.github/introduce/html/usage.html`
- `.github/introduce/html/tutorial-agent-flow.html`
- `.github/introduce/html/quick-reference.html`
- `.github/introduce/html/assets/sea.css`
- `.github/introduce/html/assets/docs.js`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification

- Commands run:
  - `rg -n "Powered by VIB|Smartsales AI|Banking-grade Copilot Package|Setup auto-hook|Workflow|Architecture|System Map|Layers|Boundary|User Request|Quick Reference" .github\introduce\html`
  - `node --check .github\introduce\html\assets\docs.js`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File .github\scripts\pre-push-governance-check.ps1 -Mode Warn`
- Results:
  - JavaScript syntax check passed.
  - Governance check passed.
  - Header/footer branding is now consistent with `Project AI` and the SmartSales ownership/contact line.
  - Sidebar collapse state is wired to the layout grid and persisted locally.
  - `history.pushState` is skipped in local `file://` mode, and TOC clicks scroll smoothly without trying to mutate the URL in blocked contexts.
- Checks not run:
  - Browser screenshot review is still pending because headless browser capture was blocked earlier in this environment.

### Line Review

- Reviewer: Codex
- Critical/high findings:
  - The refreshed CSS shell and the old JavaScript state model were out of sync, so the left sidebar behavior was not as smooth as designed.
  - Footer/header still mixed old `Smartsales AI` and `Powered by VIB` product language with the newer `Project AI` content.
  - The tutorial flow still carried a setup section even though the user-facing usage guide was already focused on day-to-day operation.
- Resolved findings:
  - Reworked the header brand and footer to use one product identity and a neutral node icon.
  - Bound sidebar collapse to `.docs-layout.nav-collapsed` and `.left-sidebar.is-collapsed` with persisted state.
  - Added safe wrappers for History API usage and smooth TOC scrolling.
  - Removed the setup section from the tutorial flow and cleaned up several labels and headings.
- Residual risk:
  - The page content is still stored in one large `docs.js` file, so future content growth will benefit from splitting content data and UI logic.

### Security, Privacy, Data Impact

- Sensitive data touched: none.
- Auth/authz impact: none.
- Logging impact: none.
- Data integrity impact: none.

### Docs Updated

- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Rollback

- Revert the listed HTML/CSS/JS files and the new docs log entries.

---

## 2026-05-14 - Simplify Daily Usage Flow And Attempt Diagram Screenshot Check

### Plan

- Remove the setup step from the daily usage flow.
- Keep the usage page focused on how to use Project AI day to day.
- Capture screenshots of the introduce diagrams with a headless browser and inspect them.
- Run JavaScript and governance checks.

### Changed Files

- `.github/introduce/html/assets/docs.js`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification

- Commands run:
  - `node --check .github\introduce\html\assets\docs.js`
  - `Select-String -Path .github\introduce\html\assets\docs.js -Pattern 'setup hook|id="setup"|#setup|Setup nhanh|Bắt đầu sau khi clone|Sơ đồ thao tác hằng ngày|architecture-diagram|poster-diagram'`
  - Chrome/Edge headless screenshot attempts for `index.html` and `usage.html`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File .github\scripts\pre-push-governance-check.ps1 -Mode Warn`
- Results:
  - JavaScript syntax check passed.
  - Usage page no longer contains its own setup section or setup TOC item.
  - Headless screenshot capture was blocked by local browser/sandbox policy with `Access is denied`; external execution approval was also unavailable in this session.
  - Governance check passed.
- Checks not run:
  - Visual screenshot inspection could not be completed because browser capture was blocked by the environment.

### Line Review

- Reviewer: Codex
- Critical/high findings:
  - Daily usage page mixed usage workflow with setup instructions.
- Resolved findings:
  - Removed the setup section from `usage.html` render data.
  - Reworded the daily usage hero to focus on asking, prompt choice, execution, review, and docs update.
- Residual risk:
  - Diagram visual quality still needs manual browser screenshot review because automated capture was blocked.
  - Failed browser attempts left temporary Chrome profile folders in the workspace for later cleanup.

### Security, Privacy, Data Impact

- Sensitive data touched: none.
- Auth/authz impact: none.
- Logging impact: none.
- Data integrity impact: none.

### Docs Updated

- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Rollback

- Revert `docs.js` and the docs log entries.

---

## 2026-05-14 - Refresh Introduce Vietnamese Copy And Poster Diagrams

### Plan

- Replace non-accented Vietnamese in the rendered HTML content with proper Vietnamese copy.
- Redraw the architecture diagram as a vertical Project AI system map similar to the supplied reference style.
- Keep diagram content truthful to this repository instead of adding unrelated RAG, Redis, Postgres, or API runtime components.
- Normalize fallback HTML shells so initial page text also uses Vietnamese accents.
- Run JavaScript syntax and local governance checks.

### Changed Files

- `.github/introduce/html/index.html`
- `.github/introduce/html/overview.html`
- `.github/introduce/html/usage.html`
- `.github/introduce/html/tutorial-agent-flow.html`
- `.github/introduce/html/quick-reference.html`
- `.github/introduce/html/assets/docs.js`
- `.github/introduce/html/assets/sea.css`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification

- Commands run:
  - `node --check .github\introduce\html\assets\docs.js`
  - `Select-String -Path .github\introduce\html\assets\docs.js -Pattern 'Huong|Tong|Cach|Bat dau|So do|Luong|Chon|Khong|duoc|can co|Dung |Hay |Bang |Click tung|Diagram nay|Hover vao|Mo left|An left'`
  - UTF-8 text scan for common mojibake markers `Ã` and `Â` across introduce HTML and `docs.js`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File .github\scripts\pre-push-governance-check.ps1 -Mode Warn`
- Results:
  - JavaScript syntax check passed.
  - Non-accented Vietnamese scan returned only false positives from English/CSS identifiers such as `cache` and normal technical labels.
  - Mojibake marker scan returned no matches.
  - Governance check passed.

### Line Review

- Reviewer: Codex
- Critical/high findings:
  - The rendered HTML content still used non-accented Vietnamese.
  - The previous diagram was too generic and did not visually match the requested architecture-map style.
- Resolved findings:
  - Rewrote rendered copy with Vietnamese accents.
  - Added a 9-layer Project AI architecture poster that matches the actual package scope.
  - Replaced fallback HTML bodies with clean Vietnamese loading shells.
- Residual risk:
  - The diagram is HTML/CSS, not an exported static image; visual fidelity depends on browser CSS rendering.

### Security, Privacy, Data Impact

- Sensitive data touched: none.
- Auth/authz impact: none.
- Logging impact: none.
- Data integrity impact: none.

### Docs Updated

- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Rollback

- Revert the listed HTML, CSS, JS, and docs log files.

---

## 2026-05-14 - Fix History API SecurityError In Local Introduce HTML

### Plan

- Reproduce the reported error path from `docs.js`.
- Explain and fix the `file://` History API limitation without reintroducing page reloads.
- Verify JavaScript syntax and local governance.

### Changed Files

- `.github/introduce/html/assets/docs.js`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification

- Commands run:
  - `node --check .github\introduce\html\assets\docs.js`
  - `Select-String -Path .github\introduce\html\assets\docs.js -Pattern 'history\.pushState|history\.replaceState|safePushPageState|safeReplaceHash|file:' -Context 1,1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File .github\scripts\pre-push-governance-check.ps1 -Mode Warn`
- Results:
  - `pushState` and `replaceState` are only called through safe wrappers.
  - Local `file://` pages render content without trying to mutate URL to another HTML file.
  - Governance check passes.

### Line Review

- Reviewer: Codex
- Critical/high findings:
  - Browser blocks `history.pushState(..., "index.html")` from a `file://` page because local file documents have unique `null` origins.
- Resolved findings:
  - Added `canUpdateHistoryUrl`, `safePushPageState`, and `safeReplaceHash`.
  - On `file://`, internal navigation updates content and active navigation but skips URL mutation.
- Residual risk:
  - When opened with `file://`, browser back/forward cannot track virtual page changes because URL mutation is intentionally disabled.

### Security, Privacy, Data Impact

- Sensitive data touched: none.
- Auth/authz impact: none.
- Logging impact: none.
- Data integrity impact: none.

### Docs Updated

- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Rollback

- Revert the safe History API wrappers in `docs.js` and the docs log entries.

---

## 2026-05-14 - Remove Introduce HTML Navigation Jitter And Add Layered Diagrams

### Plan

- Re-check the left-panel behavior when switching guide pages.
- Remove the fetch/fallback reload path that caused local HTML navigation to jitter.
- Fix right-side progress/TOC and tutorial step panel interactions after content changes.
- Add layered Project AI diagrams similar to the supplied reference image.
- Run JS syntax and local governance verification.

### Changed Files

- `.github/introduce/html/assets/docs.js`
- `.github/introduce/html/assets/sea.css`
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification

- Commands run:
  - `node --check .github\introduce\html\assets\docs.js`
  - `Select-String -Path .github\introduce\html\assets\docs.js -Pattern 'fetch\(|is-swapping|window.location.href\s*=|PAGE_DATA|renderPage|step-tab|toc-link'`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File .github\scripts\pre-push-governance-check.ps1 -Mode Warn`
- Results:
  - `docs.js` no longer uses `fetch()` for internal page navigation.
  - Left panel remains stable; center content and right-side progress/TOC update from bundled page data.
  - Step panel clicks stay local to the tutorial stepper.
  - Governance check passes.

### Line Review

- Reviewer: Codex
- Critical/high findings:
  - Internal navigation still had a full reload fallback when `fetch()` failed from local `file://`.
  - The right-side progress panel needed explicit rebinding after dynamic content replacement.
- Resolved findings:
  - Replaced fetch-based navigation with in-memory `PAGE_DATA` rendering.
  - Rebound TOC links, step tabs, copy buttons, and diagram interactions after every render.
  - Added layered architecture diagrams for the main Project AI views.
- Residual risk:
  - Static HTML still depends on browser JavaScript for the smooth single-shell experience.

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

- Revert `docs.js`, `sea.css`, and the docs record updates to restore the previous fetch-based navigation.

---

## 2026-05-14 - Improve Introduce HTML Left Panel And Footer

### Plan

- Replace the left-panel toggle icon with `<<` and `>>`.
- Collapse the grid column, not just the sidebar contents, so the main content gets more room.
- Keep the header brand stable as `Project AI`.
- Add a SmartSales ownership/contact footer.
- Intercept HTML navigation so supported browsers update the center content and right-side TOC without re-rendering the left panel.

### Changed Files

- `.github/introduce/html/index.html`
- `.github/introduce/html/overview.html`
- `.github/introduce/html/usage.html`
- `.github/introduce/html/tutorial-agent-flow.html`
- `.github/introduce/html/quick-reference.html`
- `.github/introduce/html/assets/sea.css`
- `.github/introduce/html/assets/docs.js`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification

- Commands run:
  - `Select-String -Path .github\introduce\html\*.html,.github\introduce\html\assets\*.css,.github\introduce\html\assets\*.js -Pattern '☰|â˜°|Copilot Skill Agent Platform|Micro UX|Package Guide|Presentation Mode|UI Mockup|Tech Stack'`
  - `node --check .github\introduce\html\assets\docs.js`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File .github\scripts\pre-push-governance-check.ps1 -Mode Warn`
- Results:
  - No old hamburger icon or mismatched tutorial brand remains.
  - Left panel collapse uses `<<` / `>>`.
  - Footer ownership exists through the shared HTML shell script.
  - Governance check passes.

### Line Review

- Reviewer: Codex
- Critical/high findings:
  - Collapsing the left panel only hid content; the grid still reserved the full sidebar width.
  - Navigating between pages reloaded the shell, which made the left panel feel unstable.
- Resolved findings:
  - Added a collapsed layout state on `.docs-layout`.
  - Persisted collapse state in local storage.
  - Added same-shell HTML navigation for the central content and right-side TOC.
  - Standardized the tutorial header brand.
- Residual risk:
  - Browser `fetch()` may be blocked when opening HTML directly with `file://`; in that case navigation falls back to normal page load.

### Security, Privacy, Data Impact

- Sensitive data touched: none.
- Auth/authz impact: none.
- Logging impact: none.
- Data integrity impact: none.

### Docs Updated

- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Rollback

- Revert the listed HTML/CSS/JS files and the docs log entries.

---

## 2026-05-14 - Remove UI Guide Framing From Introduce Docs

### Plan

- Remove content that reads like guidance for designing a documentation UI.
- Keep only Project AI usage paths, commands, agents, skills, and local governance notes.
- Re-scan introduce HTML/README for UI-guide wording.
- Run local governance check.

### Changed Files

- `.github/introduce/README.md`
- `.github/introduce/01-system-overview.md`
- `.github/introduce/03-ai-docs-presentation.md` (deleted)
- `.github/introduce/html/overview.html`
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification

- Commands run:
  - `Select-String -Path .github\introduce\*.md,.github\introduce\html\*.html,.github\docs\project-docs-base.md -Pattern 'Package Guide|UI Mockup|Tech Stack|UX Logic|docs app|mockup|D3.js|GSAP|Motion for React|React Flow|Floating UI|Fuse.js|Shiki|Next.js|Astro|micro-interactions|Docs Experience|Docs UI|design|Presentation Mode|presentation.html|phong cách|Style tài liệu|Google Developer|Microsoft Learn|Diataxis|diễn giả|diễn giải thật pro|docs experience|Docs \+ Agent|03-ai-docs-presentation|Presenter|keynote' -CaseSensitive:$false`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File .github\scripts\pre-push-governance-check.ps1 -Mode Warn`
- Results:
  - UI/design/presentation-guide wording scan returned no matches in active introduce entry points.
  - Project AI usage navigation remains intact.
  - Governance check passed.

### Line Review

- Reviewer: Codex
- Critical/high findings:
  - Introduce README still exposed style-guide references and presentation-oriented material after the HTML refocus.
- Resolved findings:
  - Rewrote README as a Project AI usage entry point.
  - Removed external documentation style references from the active reader path.
  - Replaced remaining HTML overview wording with prompt/agent terminology.
  - Deleted the introduce presentation Markdown and removed presenter links from the system overview.
- Residual risk:
  - Historical changelog/delivery-log entries still record older UI-focused iterations as history.

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

- Revert the listed files to restore the previous introduce README and overview wording.

---

## 2026-05-14 - Refocus Introduce HTML On Project AI Usage

### Plan

- Remove HTML content that describes how to design a docs UI.
- Keep only guidance for using Project AI in this repository.
- Remove Package Guide and Presentation Mode from HTML navigation.
- Keep Markdown docs available for GitHub/checks.

### Changed Files

- `.github/introduce/html/index.html`
- `.github/introduce/html/overview.html`
- `.github/introduce/html/usage.html`
- `.github/introduce/html/tutorial-agent-flow.html`
- `.github/introduce/html/quick-reference.html`
- `.github/introduce/html/presentation.html` (deleted)
- `.github/introduce/README.md`
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification

- Commands run:
  - `Select-String -Path .github\introduce\html\*.html,.github\introduce\README.md,.github\docs\project-docs-base.md -Pattern 'Package Guide|UI Mockup|Tech Stack|UX Logic|docs app|mockup|D3.js|GSAP|Motion for React|React Flow|Floating UI|Fuse.js|Shiki|Next.js|Astro|micro-interactions|Docs Experience|Docs UI|design|Presentation Mode|presentation.html|phong cách|Style tài liệu|Google Developer|Microsoft Learn|Diataxis|diễn giả|diễn giải thật pro|docs experience|Docs \+ Agent' -CaseSensitive:$false`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File .github\scripts\pre-push-governance-check.ps1 -Mode Warn`
- Results:
  - HTML introduce pages no longer contain UI mockup/design-tech-stack guidance.
  - HTML navigation focuses on Project AI usage.
  - Governance check passed.

### Line Review

- Reviewer: Codex
- Critical/high findings:
  - HTML docs still answered the earlier UI-design prompt instead of only teaching how to use Project AI.
- Resolved findings:
  - Rewrote the landing HTML as a Project AI usage guide.
  - Removed UI mockup, UX logic, Mermaid sample, frontend tech stack, and presentation HTML page.
  - Kept Project AI usage, workflow, components, safety, and local governance guidance.
- Residual risk:
  - Historical changelog/delivery-log entries still record earlier UI-focused iterations as past artifacts.

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

- Restore `.github/introduce/html/presentation.html` and revert the listed files.

---

## 2026-05-14 - Stabilize Introduce HTML Left Navigation

### Plan

- Remove `Docs Home` from introduce HTML navigation labels.
- Keep the left sidebar structure identical across all introduce HTML pages.
- Only change the active item when a page is selected.
- Verify local governance still passes.

### Changed Files

- `.github/introduce/html/index.html`
- `.github/introduce/html/overview.html`
- `.github/introduce/html/usage.html`
- `.github/introduce/html/tutorial-agent-flow.html`
- `.github/introduce/html/presentation.html`
- `.github/introduce/html/quick-reference.html`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification

- Commands run:
  - `Select-String -Path .github\introduce\html\*.html -Pattern 'Docs Home|sidebar-title|Package Guide|System Overview|Usage Guide|Agent Flow Tutorial|Presentation Mode|Quick Reference'`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File .github\scripts\pre-push-governance-check.ps1 -Mode Warn`
- Results:
  - `Docs Home` no longer appears in introduce HTML pages.
  - Left sidebar uses the same `Copilot Package` title and same navigation items across pages.
  - Governance check passed.

### Line Review

- Reviewer: Codex
- Critical/high findings:
  - Left sidebar was hardcoded differently per page, so navigating to Overview/Usage/Tutorial changed the rendered panel structure.
- Resolved findings:
  - Standardized sidebar title, search placeholder, group label, and nav items across introduce HTML pages.
  - Removed `Docs Home` from top and left navigation labels.
- Residual risk:
  - Static HTML navigation still reloads the page; a single-page app would be needed for zero reload transitions.

### Security, Privacy, Data Impact

- Sensitive data touched: none.
- Auth/authz impact: none.
- Logging impact: none.
- Data integrity impact: none.

### Docs Updated

- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Rollback

- Revert the listed files to restore the previous introduce HTML navigation labels and sidebar structures.

---

## 2026-05-14 - Replace Placeholder Intro Copy

### Plan

- Re-read introduce HTML and Markdown for generic placeholder or marketing-style copy.
- Replace vague hero and table text with package-specific guidance.
- Keep HTML structure, interactions, Markdown files, and local-only boundary unchanged.

### Changed Files

- `.github/introduce/html/index.html`
- `.github/introduce/README.md`
- `.github/introduce/03-ai-docs-presentation.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification

- Commands run:
  - `Select-String -Path .github\introduce\**\*.html,.github\introduce\*.md -Pattern 'cuốn|mượt|đúng flow|vừa rõ|giữ chân|mockup docs|Documentation nên|đẹp, nhanh|trẻ hơn|vui hơn|UI có thể đẹp|tech phức tạp' -CaseSensitive:$false`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File .github\scripts\pre-push-governance-check.ps1 -Mode Warn`
- Results:
  - Placeholder/marketing phrase scan returned no matches.
  - Governance check passed.

### Line Review

- Reviewer: Codex
- Critical/high findings:
  - Landing copy still described a generic docs website rather than this real Copilot package.
- Resolved findings:
  - Replaced generic hero copy with concrete package purpose: instructions, blocked rules, prompts, agents, skills, setup script, and local governance check.
  - Renamed the mockup section to two practical documentation flows.
- Residual risk:
  - Some historical delivery-log entries still mention older deleted guide/presentation files as past artifacts.

### Security, Privacy, Data Impact

- Sensitive data touched: none.
- Auth/authz impact: none.
- Logging impact: none.
- Data integrity impact: none.

### Docs Updated

- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Rollback

- Revert the listed files to restore the previous introduce copy.

---

## 2026-05-14 - Split Introduce HTML Into Dedicated Folder

### Plan

- Keep Markdown introduce docs in `.github/introduce/` root for GitHub/check readability.
- Move all visual HTML into `.github/introduce/html/`.
- Use a light sea-blue visual system for all introduce HTML pages.
- Add separate HTML pages for overview, usage, tutorial, presentation, and quick reference.
- Add more system/data/working/user-thinking diagrams using static HTML/CSS.

### Changed Files

- `.github/introduce/README.md`
- `.github/introduce/html/index.html`
- `.github/introduce/html/overview.html`
- `.github/introduce/html/usage.html`
- `.github/introduce/html/tutorial-agent-flow.html`
- `.github/introduce/html/presentation.html`
- `.github/introduce/html/quick-reference.html`
- `.github/introduce/html/assets/sea.css`
- `.github/introduce/html/assets/docs.js`
- `.github/introduce/index.html` (deleted)
- `.github/introduce/assets/introduce.css` (deleted)
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification

- Commands run:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File .github\scripts\pre-push-governance-check.ps1 -Mode Warn`
  - `Get-ChildItem .github\introduce -Recurse -File`
  - `Select-String -Path .github\introduce\html\*.html -Pattern '<link rel="stylesheet"|system flow|Data flow|Working flow|User thinking|Safety flow|Local governance|Prompt'`
- Results:
  - Governance check passed.
  - Package required files remain present.
  - Markdown introduce docs remain available for GitHub/checks.
  - Visual HTML is isolated under `.github/introduce/html/`.
  - HTML pages link to the shared sea-blue stylesheet.
  - HTML pages use shared interaction logic for sidebar search/collapse, active TOC, copy buttons, diagram hover, term tooltips, and tutorial steps.
  - No PR, branch protection, CODEOWNERS, GitHub Actions, or CI/CD changes are introduced.

### Line Review

- Reviewer: Codex
- Critical/high findings:
  - Visual HTML lived beside Markdown, which made the introduce root less clean.
- Resolved findings:
  - Split HTML and CSS into dedicated `html/` and `html/assets/` folders.
  - Preserved Markdown files in the introduce root.
  - Added dedicated visual pages, a 3-column docs app layout, and richer sea-blue diagrams.
- Residual risk:
  - Static HTML visual rendering has not been opened in a GUI browser in this session.

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

- Delete `.github/introduce/html/`, restore `.github/introduce/index.html` and `.github/introduce/assets/introduce.css`, then revert docs base/changelog/log updates.

---

## 2026-05-14 - Visual Introduce Docs Refresh

### Plan

- Make `.github/introduce/` more vivid and easier to present.
- Add a CSS-backed visual landing page without changing the local-only governance scope.
- Rewrite the introduce Markdown docs with clearer diagrams from overview to detail.
- Keep `.github/docs/` as technical records only.

### Changed Files

- `.github/introduce/README.md`
- `.github/introduce/index.html`
- `.github/introduce/assets/introduce.css`
- `.github/introduce/01-system-overview.md`
- `.github/introduce/02-huong-dan-su-dung.md`
- `.github/introduce/03-ai-docs-presentation.md`
- `.github/introduce/04-quick-reference.md`
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification

- Commands run:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File .github\scripts\pre-push-governance-check.ps1 -Mode Warn`
  - `Select-String -Path .github\introduce\*.md -Pattern '```mermaid|# |## '`
- Results:
  - Governance check passed.
  - Package required files remain present.
  - Secret scan passed.
  - Banking .NET policy scan passed.
  - No application runtime code is affected.
  - Visual docs remain local-only and do not add CI/CD or PR enforcement.

### Line Review

- Reviewer: Codex
- Critical/high findings:
  - Introduce docs were functionally correct but visually flat for onboarding and presentation use.
  - Diagrams existed, but the reader path from overview to implementation details could be clearer.
- Resolved findings:
  - Added visual HTML/CSS landing page.
  - Added more Mermaid diagrams for package map, layered architecture, local governance, prompt choice, agent choice, task flow, and safety boundaries.
- Residual risk:
  - Mermaid rendering depends on the Markdown viewer.
  - The HTML landing page is static and should be visually reviewed in a browser when convenient.

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

- Revert the introduce files and docs base/changelog/log updates to restore the previous introduce documentation.

---

## 2026-05-14 - Clean Non-Technical Docs From Docs Folder

### Plan

- Keep `.github/docs/` focused on technical package records only.
- Remove old system-description, usage-guide, and presentation files from `.github/docs/`.
- Keep the replacement onboarding and presentation material in `.github/introduce/`.
- Update docs base and changelog to reflect the new folder boundary.

### Changed Files

- `.github/docs/ai-project-developer-guide.md` (deleted)
- `.github/docs/ai-project-presentation.html` (deleted)
- `.github/docs/huong-dan-su-dung.md` (deleted)
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification

- Commands run:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File .github\scripts\pre-push-governance-check.ps1 -Mode Warn`
  - `Get-ChildItem .github\docs -File`
- Results:
  - Governance check passed.
  - Package required files remain present.
  - `.github/docs/` now contains only `README.md`, `project-docs-base.md`, `project-changelog.md`, and `feature-delivery-log.md`.
  - `.github/introduce/` keeps user-facing introduction and usage docs.

### Line Review

- Reviewer: Codex
- Critical/high findings:
  - `.github/docs/` mixed technical records with onboarding/presentation content.
- Resolved findings:
  - Removed old guide/presentation files from `.github/docs/`.
  - Kept user-facing material under `.github/introduce/`.
- Residual risk:
  - Historical delivery-log and changelog entries may still mention deleted files as past artifacts.

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

- Restore the three deleted files from git history and revert the docs base/changelog/log updates.

---

## 2026-05-14 - Professional Introduce Documentation Set

### Plan

- Re-read the current `.github` package structure, docs base, guide, changelog, delivery log, scripts, hooks, prompts, agents, skills, and knowledge base.
- Reference public technical documentation guidance for clear developer docs, task-oriented procedures, information/reference separation, and Markdown diagrams.
- Add a focused `.github/introduce/` folder for onboarding, usage, presentation, and quick-reference docs.
- Keep the current local-only governance boundary and avoid adding PR, branch protection, or CI/CD enforcement.

### Changed Files

- `.github/introduce/README.md`
- `.github/introduce/01-system-overview.md`
- `.github/introduce/02-huong-dan-su-dung.md`
- `.github/introduce/03-ai-docs-presentation.md`
- `.github/introduce/04-quick-reference.md`
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`
- `.github/docs/README.md`
- `.github/copilot/README.md`

### Verification

- Commands run:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File .github\scripts\pre-push-governance-check.ps1 -Mode Warn`
- Results:
  - Package required files remain present.
  - Skill inventory and YAML frontmatter checks passed.
  - Secret scan passed.
  - Banking .NET policy scan passed.
  - No .NET application code detected, so build/test/lint/audit checks were not applicable.

### Line Review

- Reviewer: Codex
- Critical/high findings:
  - Existing user-facing guide mixed Markdown and HTML and showed encoding artifacts in local terminal output, making it less suitable as a crisp first entry point.
  - Existing docs included broader PR/branch protection guidance, while the current operating decision is local-only.
- Resolved findings:
  - Added a focused introduce layer with clear reader paths: overview, usage guide, presentation, quick reference.
  - Kept server-side governance as a future option, not part of the current workflow.
- Residual risk:
  - The introduce docs are Markdown-only; rendering quality depends on the viewer's Mermaid support.

### Security, Privacy, Data Impact

- Sensitive data touched: none.
- Auth/authz impact: none.
- Logging impact: none.
- Data integrity impact: none.

### Docs Updated

- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`
- `.github/docs/README.md`
- `.github/copilot/README.md`

### Rollback

- Delete `.github/introduce/` and revert the docs base, changelog, and delivery-log entries.

---

## 2026-05-14 - Central Blocked Rules Authority

### Plan

- Add one central blocked-rules file for non-negotiable policy.
- Update instructions to reference the central file instead of duplicating blocked lists.
- Make local governance read scan rules from the central file.
- Require the file during setup and pre-push package validation.

### Changed Files

- `.github/copilot/blocked-rules.md`
- `.github/copilot-instructions.md`
- `.github/instructions/aspnet-core.instructions.md`
- `.github/instructions/banking-grade-engineering.instructions.md`
- `.github/scripts/setup.ps1`
- `.github/scripts/pre-push-governance-check.ps1`
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification

- Commands run:
  - `.github\scripts\pre-push-governance-check.ps1 -Mode Warn`
- Results:
  - Package validation passed, including required `.github/copilot/blocked-rules.md`.
  - Skill inventory and YAML frontmatter checks passed.
  - Secret scan passed.
  - Banking .NET policy scan loaded rules from `.github/copilot/blocked-rules.md` and passed.
  - No .NET application code detected, so build/test/lint/audit checks were not applicable.

### Line Review

- Reviewer: Codex
- Critical/high findings:
  - Blocked rules were starting to spread across instruction files and script constants, which would make real-bank rollout drift-prone.
- Resolved findings:
  - Centralized blocked policy in `.github/copilot/blocked-rules.md`.
  - Kept other files as references to the central authority.
- Residual risk:
  - Markdown policy still needs human/Copilot adherence for rules that cannot be expressed as local regex scan rules.

### Security, Privacy, Data Impact

- Sensitive data touched: none.
- Auth/authz impact: none.
- Logging impact: no new logging sink; stronger central blocked policy.
- Data integrity impact: none.

### Docs Updated

- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Rollback

- Remove `.github/copilot/blocked-rules.md`, restore hardcoded policy scan rules, and revert instruction references.

---

## 2026-05-14 - Component-First .NET Banking Policy Hardening

### Plan

- Review current Copilot instructions, ASP.NET rules, banking rules, agents, prompts, and local governance script.
- Close free-style gaps by requiring existing approved components before new code generation.
- Add concrete .NET banking policy gates for dependencies, DI/config, logging, exceptions, and modern .NET 8 style.
- Add lightweight local pre-push detection for high-signal policy violations.

### Changed Files

- `.github/copilot-instructions.md`
- `.github/instructions/aspnet-core.instructions.md`
- `.github/instructions/banking-grade-engineering.instructions.md`
- `.github/scripts/pre-push-governance-check.ps1`
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification

- Commands run:
  - `.github\scripts\pre-push-governance-check.ps1 -Mode Warn`
- Results:
  - Package validation passed.
  - Skill inventory and YAML frontmatter checks passed.
  - Secret scan passed.
  - Banking .NET policy scan passed.
  - No .NET application code detected, so build/test/lint/audit checks were not applicable.

### Line Review

- Reviewer: Codex
- Critical/high findings:
  - Existing instructions were strong on regulated delivery but too generic to reliably stop free-style helpers, out-of-policy dependencies, scattered DI/config, and duplicate middleware/utilities.
- Resolved findings:
  - Added component-first gates, approved-dependency rules, .NET 8 guidance, centralized DI/config policy, sensitive logging red lines, and local policy scans.
- Residual risk:
  - Prompt-level governance still depends on Copilot adherence. Target repositories should add server-side CI/CODEOWNERS/package allowlist enforcement for hard blocking.

### Security, Privacy, Data Impact

- Sensitive data touched: none.
- Auth/authz impact: none.
- Logging impact: stronger restrictions for sensitive-data logging and stack-trace exposure.
- Data integrity impact: none.

### Docs Updated

- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Rollback

- Revert the listed files to restore the prior regulated-delivery-only behavior.

---

## 2026-05-13 - Package Cleanup: Remove Redundant Skills, Agents, and Prompts

### Plan

- Remove `Knowledge Curator` agent (role not needed without dedicated knowledge tool).
- Remove `codebase-reading` and `code-solution-fit` skills (covered by `system-analysis` and `banking-grade-engineering`).
- Remove `internal-knowledge-governance` skill, `internal-knowledge-playbook.md`, `knowledge-source-register.template.md`, and `/internal-knowledge` prompt (NotebookLM flow removed).
- Clean all stale refs including NotebookLM nodes in Mermaid diagrams.

### Changed Files

- `.github/agents/knowledge-curator.agent.md` (deleted)
- `.github/skills/codebase-reading/` (deleted)
- `.github/skills/code-solution-fit/` (deleted)
- `.github/skills/internal-knowledge-governance/` (deleted)
- `.github/prompts/internal-knowledge.prompt.md` (deleted)
- `.github/copilot/internal-knowledge-playbook.md` (deleted)
- `.github/copilot/knowledge-source-register.template.md` (deleted)
- `.github/copilot/agent-catalog.md`
- `.github/copilot/skills-index.md`
- `.github/copilot/prompt-catalog.md`
- `.github/copilot/README.md`
- `.github/copilot/official-docs-snapshot.md`
- `.github/copilot/copilot-project-assessment.md`
- `.github/scripts/pre-push-governance-check.ps1`
- `.github/docs/ai-project-developer-guide.md`
- `.github/docs/ai-project-presentation.html`
- `.github/docs/huong-dan-su-dung.md`
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`

### Verification

- Agent count: 9 (was 11).
- Skill count: 15 (was 18).
- Prompt count: 21 (was 22).
- No stale refs to deleted files in active package files.
- Filesystem matches docs.

### Security, Privacy, Data Impact

- None.

### Rollback

- Restore deleted files from git history and revert catalog/docs/index edits.

---

- Remove `codebase-reading` skill (covered by `system-analysis`).
- Remove `code-solution-fit` skill (covered by `banking-grade-engineering` and `planning-governance`).
- Remove `internal-knowledge-governance` skill (content now in `internal-knowledge-playbook.md` and prompt).
- Clean up all stale refs including NotebookLM nodes in Mermaid diagrams.

### Changed Files

- `.github/agents/knowledge-curator.agent.md` (deleted)
- `.github/skills/codebase-reading/` (deleted)
- `.github/skills/code-solution-fit/` (deleted)
- `.github/skills/internal-knowledge-governance/` (deleted — was already missing)
- `.github/copilot/agent-catalog.md`
- `.github/copilot/skills-index.md`
- `.github/docs/ai-project-developer-guide.md`
- `.github/docs/ai-project-presentation.html`
- `.github/docs/huong-dan-su-dung.md`
- `.github/docs/project-docs-base.md`
- `.github/docs/project-changelog.md`
- `.github/prompts/internal-knowledge.prompt.md`

### Verification

- Agent count: 9 (was 11).
- Skill count: 15 (was 18).
- No stale refs to deleted skills/agents in active package files.
- Mermaid diagrams updated; NotebookLM nodes removed.

### Security, Privacy, Data Impact

- None.

### Rollback

- Restore deleted files from git history and revert catalog/docs/index edits.

---

## 2026-05-13 - Remove Notebook Task Analyst Agent

### Plan

- Remove the Notebook Task Analyst agent and all NotebookLM-flow references from the package.
- Internal knowledge queries are handled by `/internal-knowledge` prompt and `internal-knowledge-playbook.md`.

### Changed Files

- `.github/agents/notebook-task-analyst.agent.md` (deleted)
- `.github/copilot/agent-catalog.md`
- `.github/docs/ai-project-developer-guide.md`
- `.github/docs/ai-project-presentation.html`
- `.github/docs/huong-dan-su-dung.md`
- `.github/docs/project-changelog.md`
- `.github/docs/feature-delivery-log.md`

### Verification

- Agent count: 10 (was 11).
- No remaining references to `notebook-task-analyst` or `@Notebook Task Analyst` in active package files.

### Security, Privacy, Data Impact

- None.

### Rollback

- Restore `.github/agents/notebook-task-analyst.agent.md` from git history and revert catalog/docs edits.

---

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
