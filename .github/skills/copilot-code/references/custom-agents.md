# Custom Agents in VS Code

Custom agents are specialized Copilot personas with specific instructions, tools, and behavior. They enable consistent, role-specific AI assistance.

## File Locations

| Scope | Location |
|---|---|
| Workspace | `.github/agents/*.md` or `*.agent.md` |
| Workspace (Claude format) | `.claude/agents/*.md` |
| User profile | `~/.copilot/agents/` |
| Organization | `agents/` in `.github-private` repo |

VS Code detects any `.md` file in `.github/agents/` as a custom agent.

## YAML Frontmatter Properties

```yaml
---
name: agent-name                    # Display name (optional — defaults to filename)
description: "Agent purpose"        # Required. Shown in agents dropdown
target: vscode                      # Optional: 'vscode' | 'github-copilot' | unset = both
                                    # Set 'vscode' for agents using 'web', 'agent/runSubagent', 'todo'
model: claude-sonnet-4-5            # Optional: pin specific model
tools: ['read', 'search', 'edit']   # Optional: unset = all tools. [] = no tools
agents: ['*']                       # Optional: subagents allowed. [] = none. Requires 'agent' tool
argument-hint: "Describe your task" # Optional: hint shown in chat input
user-invocable: true                # Optional: false = subagent-only (hidden from dropdown)
disable-model-invocation: false     # Optional: true = manual selection only
handoffs:                           # Optional: guided sequential workflows
  - label: Start Implementation
    agent: implementation
    prompt: Now implement the plan.
    send: false
    model: GPT-5 (copilot)
hooks:                              # Optional: agent-scoped hooks (Preview)
  PostToolUse:                      # Requires chat.useCustomAgentHooks: true
    - type: command
      command: "./scripts/format.sh"
---
```

## Tool Aliases

| Alias | Description |
|---|---|
| `execute` | Shell commands (bash/powershell) |
| `read` | Read files |
| `edit` | Write/edit files |
| `search` | Search files (grep/glob) |
| `web` | Web search and fetch (VS Code only) |
| `agent/runSubagent` | Invoke subagent (VS Code only) |
| `todo` | Structured task lists (VS Code only) |
| `agent` | Invoke subagent (cloud agent) |
| `github/*` | GitHub MCP tools (cloud agent) |
| `playwright/*` | Browser automation MCP (cloud agent) |

Set `tools` to enable only what the agent needs (principle of least privilege).

## Handoffs

Handoffs create guided sequential workflows — transition buttons appear after a response:

```yaml
handoffs:
  - label: "Start Implementation"
    agent: implementation       # Target agent name
    prompt: "Implement the plan above."
    send: false                 # true = auto-submit prompt
    model: "Claude Sonnet 4.5 (copilot)"
```

Use handoffs for: Plan → Implement → Review workflows.

## Agent-Scoped Hooks (Preview)

Define hooks inline in the agent frontmatter — only run when this agent is active:

```yaml
hooks:
  PostToolUse:
    - type: command
      command: "dotnet format --include $TOOL_INPUT_FILE_PATH --no-restore"
  SessionStart:
    - type: command
      command: "echo 'Agent session started'"
```

Requires `chat.useCustomAgentHooks: true` in VS Code settings.

## Common Patterns

### Read-only research agent
```yaml
---
name: researcher
target: vscode
tools: ['read', 'search', 'web']
description: Research technical topics
---
```

### Full implementation agent
```yaml
---
name: implementer
tools: ['edit', 'execute', 'read', 'search']
description: Implement features and fix bugs
---
```

### Orchestrator agent (spawns subagents)
```yaml
---
name: planner
target: vscode
tools: ['agent/runSubagent', 'edit', 'read', 'search', 'todo', 'web']
agents: ['researcher', 'code-reviewer']
description: Research and create implementation plans
---
```

## File Naming

- Workspace agents: `my-agent.md` or `my-agent.agent.md` in `.github/agents/`
- The filename (minus `.md` / `.agent.md`) is used for deduplication
- Lowest-level config takes precedence (repo > org > enterprise)

## Sharing Across Teams

- Commit to `.github/agents/` for team sharing
- Enable `github.copilot.chat.organizationCustomAgents.enabled` for org-level discovery
- VS Code auto-discovers org-level agents the user has access to
