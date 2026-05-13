# Prompt Catalog

Purpose: list reusable prompt files in this standalone Copilot package.

Prompt files live in `.github/prompts/*.prompt.md` and can be invoked manually in compatible Copilot clients.

## Prompt Files

| Prompt file | Purpose |
| --- | --- |
| `.github/prompts/ask.prompt.md` | Answer technical questions with repository context |
| `.github/prompts/analyze-code.prompt.md` | Analyze architecture, code flow, business logic, dependencies, and blast radius |
| `.github/prompts/explain-code.prompt.md` | Explain existing code and business flow |
| `.github/prompts/plan.prompt.md` | Create implementation plans |
| `.github/prompts/banking-plan.prompt.md` | Create regulated finance plans with risk, rollback, approvals, verification, and docs gates |
| `.github/prompts/implement.prompt.md` | Implement scoped changes |
| `.github/prompts/fix.prompt.md` | Diagnose and fix issues |
| `.github/prompts/logic-check.prompt.md` | Check business logic, code logic, edge cases, and integration behavior |
| `.github/prompts/test.prompt.md` | Find, run, and analyze tests |
| `.github/prompts/review.prompt.md` | Review code or recent changes |
| `.github/prompts/line-review.prompt.md` | Review every changed line for banking-grade delivery |
| `.github/prompts/docs-update.prompt.md` | Update project documentation |
| `.github/prompts/docs-base-update.prompt.md` | Update `.github/docs/` after a feature, fix, migration, or operational change |
| `.github/prompts/scout.prompt.md` | Locate relevant files and symbols |
| `.github/prompts/git.prompt.md` | Prepare commits, pushes, and PR commands |
| `.github/prompts/mcp.prompt.md` | Select MCP tools or manual fallbacks |
| `.github/prompts/azure-devops-intake.prompt.md` | Read approved Azure DevOps work item context and produce codebase-fit plan inputs |
| `.github/prompts/db-schema-context.prompt.md` | Use read-only database schema metadata for planning, review, or debugging |
| `.github/prompts/internal-knowledge.prompt.md` | Query or curate approved internal knowledge sources |
| `.github/prompts/deep-research.prompt.md` | Produce evidence-backed research reports with approved sources |
| `.github/prompts/architecture-research.prompt.md` | Compare architecture options and produce ADR-ready recommendations |
| `.github/prompts/devloop.prompt.md` | Run analyze -> plan -> approval -> implement -> test -> review -> docs loop |

## Prompt Design Rules

- Keep prompt files task-specific.
- Reference `.github/copilot/workflow-playbook.md` instead of duplicating all workflow rules.
- Use `#codebase` for broad repository retrieval.
- Ask only blocking questions.
- Report verification evidence.

## Retrieval Keywords

prompt files, `.prompt.md`, analyze code, explain code, logic check, devloop, plan, fix, test, review, docs, scout, git, MCP, Azure DevOps, database schema, internal knowledge, deep research, architecture research, banking plan, line review, docs base update.
