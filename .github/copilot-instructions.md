# GitHub Copilot Project Instructions

> Repository-wide instructions automatically applied to every Copilot interaction.
> For agent skills, see `.github/skills/` — Copilot loads them automatically when relevant.
> For custom agents, see `.github/agents/`. For reusable prompts, see `.github/prompts/`.

---

## Core Engineering Philosophy

**Always follow the holy trinity: YAGNI · KISS · DRY**
- **YAGNI** (You Aren't Gonna Need It) — Only build what the current task requires.
- **KISS** (Keep It Simple, Stupid) — Prefer the simplest solution that works.
- **DRY** (Don't Repeat Yourself) — Eliminate duplication; extract shared logic.

**Advanced Architectural & Clean Code Principles:**
- **Separation of Concerns (SoC)** — Divide the system into distinct modules, each addressing a separate domain or infrastructure concern.
- **Composition Over Inheritance** — Favor assembling interchangeable behaviors over building rigid, deeply nested class hierarchies.
- **Fail Fast** — Stop operation and report errors immediately upon encountering an invalid state, preventing cascading system failures.
- **Boy Scout Rule** — Always leave the codebase a little cleaner than you found it.

---

## Primary Workflow

When given a task, follow this lifecycle in order:

### 1. Planning
- **Before coding**, delegate to the `@planner` agent to create an implementation plan saved in `./plans/`.
- During planning, spawn multiple `@researcher` agents in parallel for different technical topics.
- Validate the plan's assumptions, surface blockers, and confirm priorities before execution.
- **Do NOT start implementing** until the plan is approved.

### 2. Implementation
- Study the implementation plan end-to-end before writing code.
- Only read the general plan (`plan.md`) and implement phases one by one — do not read all phases at once.
- Follow architectural patterns from `./docs/` (code standards, system architecture, design guidelines).
- After creating or modifying any code file, run the compile/typecheck command to catch errors immediately.
- **DO NOT** create new "enhanced" files — always update existing files directly.
- **DO NOT** simulate or mock implementations — always implement real, production-quality code.

### 3. Testing
- Delegate to `@tester` agent to run tests and analyze the summary report.
- Write comprehensive unit and integration tests covering error scenarios and edge cases.
- **NEVER use fake data, mocks, cheats, or temporary solutions just to pass a build or CI.**
- Fix failing tests immediately. Do not finish a session with failing tests.
- Repeat testing until all tests pass.

### 4. Code Review
- After implementation, delegate to `@code-reviewer` agent to review code.
- If critical issues are found, fix them and re-run tests before marking complete.

### 5. Integration
- Ensure seamless integration, follow API contracts, maintain backward compatibility.
- Document breaking changes.
- Delegate to `@docs-manager` agent to update `./docs/` documentation if needed.

### 6. Debugging
- When bugs or CI/CD failures are reported, delegate to `@debugger` agent first.
- Implement the fix based on the debugger's root cause analysis.
- Re-run tests via `@tester` agent and repeat until resolved.

---

## Agent Orchestration Protocol

### Sequential Chaining
Chain agents when tasks have dependencies — each completes fully before the next begins:
- **Planning → Implementation → Testing → Review**: Standard feature development
- **Research → Design → Code → Documentation**: New system components

### Parallel Execution
Spawn multiple agents simultaneously for independent work:
- **Code + Tests + Docs**: Non-conflicting components
- **Multiple Researchers**: Different technical topics in parallel
- **Careful coordination**: Ensure no file conflicts or shared resource contention.
- Plan integration points before parallel execution begins.

---

## Development Rules

### Code Quality
- Write clean, readable, maintainable code.
- Follow established architectural patterns from `./docs/code-standards.md`.
- Add meaningful comments for complex logic only.
- Use try/catch error handling and follow OWASP security standards.
- Don't be overly strict on style formatting — prioritize functional, readable code.
- Run compile/typecheck/build after every change.

### File Management
- **File naming**: Use kebab-case with descriptive names (readability over brevity).
- **File size limit**: Keep files under **200 lines**. If a file exceeds this:
  - Split into smaller focused components/modules.
  - Extract utility functions into separate files.
  - Create dedicated service classes for business logic.
- Follow codebase structure documented in `./docs/`.

### Pre-commit & Push Rules
- Run linting before every commit.
- Run tests before every push — **do not bypass failing tests**.
- Keep commits atomic and focused on the actual change.
- **NEVER commit secrets**: No API keys, passwords, `.env` files, or credentials.
- Use conventional commit format: `type(scope): description`
  - Types: `feat | fix | docs | chore | refactor | perf | test | build | ci`

### Security
- Validate all inputs at system boundaries.
- Follow OWASP Top 10 — catch and fix vulnerabilities immediately.
- Never expose sensitive data in logs, error messages, or commits.
- Verify authentication, authorization, CORS, and CSP configurations.

---

## Documentation Management

### Key Documents (always read before working in a repo)
- `./docs/code-standards.md` — Coding conventions for this project
- `./docs/system-architecture.md` — System architecture details
- `./docs/development-roadmap.md` — Development roadmap and milestones
- `./docs/project-changelog.md` — Version history and changes
- `./docs/aspnet/` — ASP.NET Core reference docs (API design, auth, DI, middleware, testing)

### Auto-update Triggers
The `@project-manager` agent MUST update these documents when:
- A development phase status changes (In Progress → Complete)
- Major features are implemented or released
- Significant bugs are resolved or security patches applied
- Project timeline or scope adjustments are made

### Update Protocol
1. **Before updates**: Read current roadmap and changelog status.
2. **During updates**: Maintain version consistency and formatting.
3. **After updates**: Verify links, dates, and cross-references.
4. **Quality check**: Ensure updates align with actual implementation progress.

---

## Copilot-Specific Instructions

### Response Quality Standards
- **Token efficiency**: Sacrifice grammar for concision in reports.
- **Honest & Brutally Direct**: No sugarcoating — state problems clearly.
- **Unresolved Questions**: Always list unresolved questions at the end of reports.
- **No AI attribution**: Never include phrases like "As an AI..." in commits, PRs, or docs.
