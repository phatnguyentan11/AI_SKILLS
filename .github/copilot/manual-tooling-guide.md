# Manual Tooling Guide

Purpose: define safe fallbacks when Copilot cannot directly execute a tool.

## Rule

If Copilot cannot execute an action directly, provide:

- exact command
- working directory
- expected success signal
- failure output to paste back
- next step after success or failure

## Terminal

Use `/terminal` or a VS Code terminal when available.

Template:

```text
Run from repository root:
[command]

Success means:
[expected output]

If it fails, paste:
- command
- full error
- first stack trace
```

## Local Pre-Push Governance

This package uses a local Git pre-push hook as a developer warning gate before `git push`, not a build pipeline.

Enable once per clone:

```bash
git config core.hooksPath .github/hooks
```

The hook runs `.github/scripts/pre-push-governance-check.ps1` in warning mode. It checks package structure, `SKILL.md` inventory, YAML frontmatter, likely secrets, and conditional .NET restore/build/format/test/dependency audit when a target repository contains `.sln` or `.csproj` files.

Default behavior:

- warnings are printed before push
- push is allowed
- no remote pipeline is triggered

Strict local enforcement:

```powershell
.github\scripts\pre-push-governance-check.ps1 -Mode Strict
```

or set `AI_GOVERNANCE_STRICT=1` before pushing.

## GitHub CLI

Use for PRs, issues, CI, and workflow logs when authenticated.

```bash
gh auth status
gh pr status
gh run list --limit 10
gh run view <run-id> --log-failed
```

Do not push, merge, or open PRs unless the user asks.

## MCP

Copilot flow:

1. Ask whether the MCP server is enabled and approved for the repository.
2. If enabled, use the exposed tool.
3. If unavailable, ask the user to paste output or provide a manual fallback.
4. Continue with repository context.

### Azure DevOps

Use Azure DevOps MCP only for approved `dev.azure.com` organizations, projects, repositories, teams, and domains.

Default to read-only:

- read Azure Boards work item context
- read related Azure Repos, Azure Wiki, and Azure Pipelines metadata when needed
- summarize only decision-relevant details

Do not update work items, create branches, create pull requests, post comments, queue pipelines, or export broad logs without explicit approval.

Manual fallback:

```text
Ask the user to paste:
- dev.azure.com work item URL or ID
- title and description
- acceptance criteria
- relevant links
- current state, priority, and tags
```

### Slack

Use only approved channels or threads. Do not read private messages, export broad channel history, or post messages unless explicitly approved.

### Database Schema

Use read-only metadata only: schemas, tables, columns, indexes, constraints, stored procedure signatures, and migration history. Do not query row data or run DML/DDL without approval.

## Browser And UI Verification

Use browser DevTools, Playwright, screenshots, or enabled MCP tools only when approved.

Check:

- desktop and mobile viewport
- loading, empty, error, and success states
- keyboard navigation and focus
- text overflow and layout shifts
- console and network errors
- sensitive data exposure in UI and logs

## Database

- Never ask for production credentials in chat.
- Prefer read-only inspection first.
- Require backups and explicit approval for destructive operations.

Examples:

```bash
psql "$DATABASE_URL" -c "\dt"
psql "$DATABASE_URL" -c "EXPLAIN ANALYZE <query>;"
```

## Retrieval Keywords

manual tooling, terminal, GitHub CLI, gh, MCP, Azure DevOps, dev.azure.com, Slack, database schema, browser verification, Playwright, psql, fallback, banking governance.
