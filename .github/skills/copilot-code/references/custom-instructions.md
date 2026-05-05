# Custom Instructions

Custom instructions are always-on context automatically applied to every Copilot interaction within their scope. No manual invocation needed.

## File Locations

| Type | Location | Scope |
|---|---|---|
| Repo-wide | `.github/copilot-instructions.md` | All interactions in repo |
| Path-specific | `.github/instructions/*.instructions.md` | Files matching `applyTo` pattern |
| Third-party agents | `AGENTS.md` | Agents like Claude Code reading AGENTS.md |
| Personal (UI) | GitHub.com settings | User-level instructions |
| Org (UI) | GitHub org settings | Org-wide instructions |

## copilot-instructions.md

Simple Markdown — no frontmatter needed. Content is injected into every chat context.

```markdown
# Project Instructions

You are working on an ASP.NET Core .NET 8 service.

## Key Rules
- Use file-scoped namespaces
- Always return `Response<T>` wrapper — never raw objects
- Authorization via `[ValidAuthorize("ROLE")]` attribute
```

## Path-Specific Instructions (.instructions.md)

Use `applyTo` in frontmatter to scope instructions to specific file patterns:

```markdown
---
name: ASP.NET Standards
description: C# and ASP.NET Core coding rules
applyTo: "**/*.cs,**/*.csproj"
---

# C# Rules

- Use `async/await`. Never `.Result` or `.Wait()`.
- Prefix interfaces with `I`: `IUserRepository`
- File-scoped namespaces only
```

Multiple instruction files can apply to the same path — all are combined.

## AGENTS.md

Provides context to agents (like Claude Code) that look for `AGENTS.md`:

```markdown
# Agent Instructions

Follow the workflow in `.github/copilot-instructions.md`.

## Available Agents
| Agent | When to use |
|---|---|
| `@planner` | Before any implementation |
| `@tester` | After implementation |
```

## Instructions vs Skills vs Prompt Files

| Feature | Trigger | Best for |
|---|---|---|
| Custom instructions | Automatic, always | Coding standards, naming rules |
| Agent skills | Automatic, when relevant | Deep task-specific guidance |
| Prompt files | Manual `/command` | One-off repeatable tasks |

## Tips

- Keep `copilot-instructions.md` concise — it's injected into every prompt
- Use path-specific instructions for language or layer-specific rules
- Instructions are additive — all matching instructions are combined
- Max content: instructions are truncated if too long; keep critical info first
