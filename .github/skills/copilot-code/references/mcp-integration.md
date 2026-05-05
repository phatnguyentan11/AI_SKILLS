# MCP Integration

Model Context Protocol (MCP) servers connect Copilot to external tools, APIs, and databases.

## Configuration File Locations

| Scope | Location |
|---|---|
| Workspace | `.vscode/mcp.json` or `mcp.json` |
| User | VS Code user settings |
| Cloud agent | Repository settings on GitHub.com |
| Custom agent | `mcp-servers:` in agent frontmatter (cloud agent only) |

## mcp.json Format

```json
{
  "servers": {
    "my-server": {
      "type": "stdio",
      "command": "node",
      "args": ["./path/to/server.js"],
      "env": {
        "API_KEY": "${input:apiKey}"
      }
    },
    "my-http-server": {
      "type": "http",
      "url": "https://my-mcp-server.example.com/sse",
      "headers": {
        "Authorization": "Bearer ${input:token}"
      }
    }
  }
}
```

## Built-in MCP Servers (Cloud Agent)

Available out-of-the-box for Copilot cloud agent:

| Server | Tools | Notes |
|---|---|---|
| `github` | All read-only tools by default | Token scoped to source repo |
| `playwright` | All playwright tools | Only access to localhost |

Reference in agent tools:
```yaml
tools: ['github/*', 'playwright/*']
# Or specific tools:
tools: ['github/list_issues', 'playwright/navigate']
```

## Using MCP Tools in Agents

In custom agent frontmatter:
```yaml
tools: ['read', 'edit', 'search', 'my-mcp-server/*']
```

Or specific tools from an MCP server:
```yaml
tools: ['read', 'edit', 'my-mcp-server/get-data', 'my-mcp-server/update-record']
```

## MCP in Custom Agent Profiles (Cloud Agent only)

```yaml
---
name: my-agent
description: Agent with custom MCP
tools: ['read', 'edit', 'custom-mcp/tool-1']
mcp-servers:
  custom-mcp:
    type: local
    command: node
    args: ['./mcp-server.js']
    tools: ["*"]
    env:
      API_KEY: ${{ secrets.COPILOT_MCP_ENV_VAR_VALUE }}
---
```

> `mcp-servers` in agent YAML is **cloud agent only** — not used in VS Code agents.

## Secret References in MCP Config

Supported patterns:
- `$ENV_VAR` — environment variable
- `${ENV_VAR}` — environment variable (Claude Code syntax)
- `${ENV_VAR:-default}` — with default value
- `${{ secrets.VAR_NAME }}` — from Copilot "copilot" environment (cloud agent)
- `${{ vars.VAR_NAME }}` — from Copilot variables (cloud agent)

## Common MCP Servers

| Use case | MCP Server |
|---|---|
| GitHub issues/PRs | GitHub MCP (`github/awesome-copilot`) |
| Browser automation | Playwright MCP |
| Database access | Various DB MCP servers |
| File system | Built-in filesystem MCP |
| Web search | Various search MCP servers |

Find more at: https://github.com/github/awesome-copilot
