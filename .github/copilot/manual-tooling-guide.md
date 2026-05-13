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

manual tooling, terminal, GitHub CLI, gh, MCP, browser verification, Playwright, psql, fallback, banking governance.

