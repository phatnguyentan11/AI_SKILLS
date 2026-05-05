# Agent Instructions

This repository uses GitHub Copilot with a full custom agent ecosystem. When working on tasks, follow the workflow defined in `.github/copilot-instructions.md`.

## Core Philosophy

**YAGNI · KISS · DRY** — Always follow the holy trinity. Build only what is needed, keep it simple, eliminate duplication.

## Primary Workflow

1. **Plan** — Use `@planner` to create a plan in `./plans/` before implementing anything significant.
2. **Implement** — Follow the plan phase by phase. Run compile/typecheck after every file change.
3. **Test** — Delegate to `@tester`. Never skip failing tests. Never use fake data.
4. **Review** — Delegate to `@code-reviewer`. Fix critical issues before marking complete.
5. **Document** — Delegate to `@docs-manager` to keep `./docs/` up to date.
6. **Debug** — When bugs arise, delegate to `@debugger` for root cause analysis first.

## Available Custom Agents

| Agent | Trigger |
|-------|---------|
| `@planner` | Before any significant implementation |
| `@researcher` | Technical research needed |
| `@code-reviewer` | After implementation or before merging |
| `@tester` | After implementation, after bug fixes |
| `@debugger` | When bugs or CI/CD failures occur |
| `@git-manager` | When user says "commit", "push" |
| `@docs-manager` | After major code changes |
| `@project-manager` | Progress tracking, roadmap updates |
| `@brainstormer` | Architecture decisions, feature exploration |
| `@scout` | Finding files across large codebases |
| `@database-admin` | Database optimization and diagnostics |

## Available Skills

Skills are in `.github/skills/` and loaded automatically when relevant. Key skills:
- `planning`, `research`, `debugging`, `code-review`
- `sequential-thinking`, `docs-seeker`
- `backend-development`, `databases`, `devops`
- `ef-core`, `dotnet-best-practices`, `csharp-async`, `csharp-xunit`
- `problem-solving`

## Available Prompts

Use prompts from `.github/prompts/` in chat with `/plan`, `/code`, `/fix`, `/debug`, `/test`, `/brainstorm`, `/scout`, `/ask`, `/watzup`.

## Key Rules

- Files must be under **200 lines** — split if larger.
- Use kebab-case for file names.
- **NEVER commit** secrets, API keys, `.env` files, or credentials.
- Conventional commits: `type(scope): description`
- No AI attribution in commits, PRs, or documentation.
