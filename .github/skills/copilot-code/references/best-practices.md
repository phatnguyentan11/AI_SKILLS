# Best Practices

## General Principles

- **YAGNI** — Don't create agents, skills, or hooks until you need them
- **KISS** — Prefer simple instructions over complex agent configurations
- **Least privilege** — Give agents only the tools they actually need
- **Explicit over implicit** — Clear descriptions beat clever file naming

## Choosing the Right Feature

| Need | Use |
|---|---|
| Always-on coding standards | `copilot-instructions.md` |
| Layer/language-specific rules | `.instructions.md` with `applyTo` |
| Reusable task (generate, review) | Prompt file (`.prompt.md`) |
| Complex multi-tool workflow | Custom agent (`.agent.md`) |
| Deep task-specific guidance | Skill (`SKILL.md`) |
| Post-edit formatting | Hook (`PostToolUse`) |
| Block dangerous operations | Hook (`PreToolUse`) |
| External data/API access | MCP server |

## Custom Agent Design

- **One responsibility**: Each agent should do one thing well
- **Document the tools needed**: Wrong tool list = silent failures
- **Set `target: vscode`** when using `web`, `agent/runSubagent`, or `todo`
- **Use `argument-hint`** for agents that need input context
- **Test handoffs**: Verify referenced agents actually exist

```yaml
# Good: specific and scoped
---
name: test-generator
description: Generates xUnit tests for C# classes
tools: ['read', 'edit', 'search']
---

# Avoid: too broad
---
name: do-everything
tools: ['execute', 'read', 'edit', 'search', 'web', 'agent/runSubagent']
---
```

## Hook Security

- Review hook scripts from external repos before enabling
- Never store secrets in hook JSON files — use env vars or secret references
- Validate and sanitize `$TOOL_INPUT_FILE_PATH` and similar variables before using in shell commands
- Use `"enabled": false` to disable hooks without deleting them
- Set `"chat.tools.edits.autoApprove": false` to prevent agent from modifying hook scripts

## Skill Description Quality

The `description` field drives when the skill is activated — write it well:

```yaml
# Good: describes the "when" clearly
description: "Instructs Copilot on custom agents, skills, hooks, and MCP integration for VS Code. Use when asked about creating/configuring agents, prompt files, hooks, or custom instructions."

# Bad: too vague
description: "Copilot configuration"
```

## Instructions Efficiency

- `copilot-instructions.md` is injected into **every** prompt — keep it short
- Use bullet points, not prose
- Put the most critical rules first (truncated if too long)
- Use path-specific `.instructions.md` files for language/layer rules

## Sharing Across Team

1. Commit `.github/` customizations to version control
2. Use `chat.agentFilesLocations` to set alternative paths
3. Set `chat.useCustomizationsInParentRepositories: true` for monorepos
4. Document agents and skills in `AGENTS.md` for discoverability
5. Enable `github.copilot.chat.organizationCustomAgents.enabled` for org-wide agents

## Naming Conventions

| File | Example |
|---|---|
| Agent | `feature-name.md` (kebab-case) |
| Skill | `feature-name/SKILL.md` |
| Prompt | `task-name.prompt.md` |
| Instruction | `layer.instructions.md` |
| Hook | `purpose.json` |

## Versioning & Maintenance

- Test customizations after Copilot updates (tool names may change)
- Check Diagnostics view after updating agent files
- Keep a `CHANGELOG` or comment in agent files noting why choices were made
- Remove unused agents/skills — they add noise to the model context
