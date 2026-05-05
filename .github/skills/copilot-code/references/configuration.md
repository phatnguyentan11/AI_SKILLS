# Configuration Reference

Key VS Code settings and configuration for GitHub Copilot agent mode.

## VS Code Settings

```json
{
  // Enable organization-level custom agents
  "github.copilot.chat.organizationCustomAgents.enabled": true,

  // Custom locations for agent files
  "chat.agentFilesLocations": {
    ".github/agents": true
  },

  // Custom locations for prompt files
  "chat.promptFilesLocations": {
    ".github/prompts": true
  },

  // Custom locations for hook files
  "chat.hookFilesLocations": {
    ".github/hooks": true,
    ".claude/settings.json": true
  },

  // Enable agent-scoped hooks in .agent.md frontmatter
  "chat.useCustomAgentHooks": true,

  // Discover customizations from parent repo in monorepos
  "chat.useCustomizationsInParentRepositories": true,

  // Show prompt file recommendations when starting new chat
  "chat.promptFilesRecommendations": true,

  // Tool edit auto-approval (careful — allows agent to edit files without confirmation)
  "chat.tools.edits.autoApprove": false
}
```

## Tool Aliases (full list)

| Alias | Maps to | Surface |
|---|---|---|
| `execute` | shell, bash, powershell | VS Code + Cloud |
| `read` | Read, NotebookRead | VS Code + Cloud |
| `edit` | Edit, MultiEdit, Write, NotebookEdit | VS Code + Cloud |
| `search` | Grep, Glob | VS Code + Cloud |
| `agent` | Task, custom-agent | Cloud agent |
| `agent/runSubagent` | VS Code subagent tool | VS Code only |
| `web` | WebSearch, WebFetch | VS Code only |
| `todo` | TodoWrite | VS Code only |
| `github/*` | GitHub MCP tools | Cloud agent |
| `playwright/*` | Playwright MCP tools | Cloud agent |

## Customization Feature Matrix

| Feature | VS Code | Cloud Agent | CLI |
|---|---|---|---|
| Custom instructions | ✓ | ✓ | ✓ |
| Prompt files | ✓ | ✗ | ✗ |
| Custom agents | ✓ | ✓ (preview) | ✓ |
| Subagents | ✓ | ✓ (preview) | ✗ |
| Agent skills | ✓ | ✓ | ✓ |
| Hooks | ✓ (preview) | ✓ | ✓ |
| MCP servers | ✓ | ✓ | ✓ |

## Model Configuration

Specify model in agent or prompt file frontmatter:
```yaml
model: claude-sonnet-4-5      # Anthropic via Copilot
model: gpt-4o                 # OpenAI via Copilot
model: o3-mini                # OpenAI reasoning via Copilot
```

Format for handoffs: `Model Name (vendor)` — e.g., `GPT-5 (copilot)`, `Claude Sonnet 4.5 (copilot)`

## File Naming Conventions

| File type | Extension | Location |
|---|---|---|
| Custom agent | `.md` or `.agent.md` | `.github/agents/` |
| Agent skill | `SKILL.md` (uppercase) | `.github/skills/<name>/` |
| Prompt file | `.prompt.md` | `.github/prompts/` |
| Path instruction | `.instructions.md` | `.github/instructions/` |
| Repo instruction | — | `.github/copilot-instructions.md` |
| Hook | `.json` | `.github/hooks/` |
| MCP config | `mcp.json` | `.vscode/` |

## Quick Commands

| Task | Command |
|---|---|
| Open Agent Customizations editor | `Chat: Open Customizations` |
| Create new custom agent | `Chat: New Custom Agent` or `/create-agent` |
| Create new prompt file | `Chat: New Prompt File` or `/create-prompt` |
| Configure hooks | `Chat: Configure Hooks` or `/hooks` |
| View diagnostics | Right-click Chat → Diagnostics |
| List agents | `/agents` in chat |
| List prompts | `/prompts` in chat |
