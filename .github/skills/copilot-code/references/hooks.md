# Hooks in VS Code (Preview)

Hooks execute shell commands at specific lifecycle points during agent sessions. Deterministic, guaranteed execution — unlike instructions or prompts.

## Hook File Locations

| Scope | Location |
|---|---|
| Workspace | `.github/hooks/*.json` |
| Claude format | `.claude/settings.json`, `.claude/settings.local.json` |
| User | `~/.copilot/hooks/` |
| Agent-scoped | `hooks:` field in `.agent.md` frontmatter |

## Lifecycle Events (8 total)

| Event | When it fires | Common uses |
|---|---|---|
| `SessionStart` | First prompt of new session | Inject context, validate project state |
| `UserPromptSubmit` | User submits any prompt | Audit requests, inject context |
| `PreToolUse` | Before agent invokes a tool | Block dangerous ops, require approval |
| `PostToolUse` | After tool completes | Run formatters, linters, log results |
| `PreCompact` | Before context is compacted | Export state before truncation |
| `SubagentStart` | Subagent is spawned | Track nested agent usage |
| `SubagentStop` | Subagent completes | Aggregate results, cleanup |
| `Stop` | Agent session ends | Generate reports, send notifications |

## Hook Configuration Format

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "command": "npx prettier --write \"$TOOL_INPUT_FILE_PATH\"",
        "windows": "npx prettier --write \"%TOOL_INPUT_FILE_PATH%\"",
        "timeout": 30,
        "env": {
          "MY_VAR": "value"
        }
      }
    ],
    "PreToolUse": [
      {
        "type": "command",
        "command": "./scripts/validate-tool.sh"
      }
    ]
  }
}
```

### Hook Command Properties

| Property | Type | Description |
|---|---|---|
| `type` | string | Must be `"command"` |
| `command` | string | Default command (cross-platform) |
| `windows` | string | Windows-specific override |
| `linux` | string | Linux-specific override |
| `osx` | string | macOS-specific override |
| `cwd` | string | Working directory (relative to repo root) |
| `env` | object | Additional environment variables |
| `timeout` | number | Timeout in seconds (default: 30) |

## Hook Input/Output

Every hook receives JSON via **stdin**:
```json
{
  "timestamp": "2026-05-05T10:00:00.000Z",
  "cwd": "/path/to/workspace",
  "sessionId": "session-id",
  "hookEventName": "PostToolUse",
  "tool_name": "editFiles",
  "tool_input": { "filePath": "src/main.cs" }
}
```

Return JSON via **stdout** to influence agent:
```json
{
  "continue": true,
  "systemMessage": "Warning: file has lint errors"
}
```

### Exit Codes

| Code | Meaning |
|---|---|
| `0` | Success — parse stdout as JSON |
| `2` | Blocking error — stop and show error to model |
| Other | Non-blocking warning — show to user, continue |

## PreToolUse — Block Dangerous Operations

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "command": "./scripts/security-check.sh"
      }
    ]
  }
}
```

Script output to control tool execution:
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Destructive command blocked by policy"
  }
}
```

`permissionDecision` values: `"allow"` | `"deny"` | `"ask"`

## PostToolUse — Auto-Format After Edits

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "command": "dotnet format --include \"$TOOL_INPUT_FILE_PATH\" --no-restore",
        "windows": "dotnet format --include \"%TOOL_INPUT_FILE_PATH%\" --no-restore"
      }
    ]
  }
}
```

## SessionStart — Inject Context

Script stdout `additionalContext` is added to the agent's conversation:
```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Branch: main | .NET 8 | Last build: OK"
  }
}
```

## Stop Hook — Prevent Premature Stop

```json
{
  "hookSpecificOutput": {
    "hookEventName": "Stop",
    "decision": "block",
    "reason": "Run test suite before finishing"
  }
}
```

> **Warning**: Check `stop_hook_active` field to prevent infinite loops — blocked stop hooks consume premium requests.

## Agent-Scoped Hooks (Preview)

Define hooks in `.agent.md` frontmatter — only run when that agent is active:

```yaml
---
name: strict-formatter
hooks:
  PostToolUse:
    - type: command
      command: "dotnet format --include $TOOL_INPUT_FILE_PATH"
---
```

Requires `chat.useCustomAgentHooks: true` in VS Code settings.

## VS Code vs Claude Code Differences

| Difference | Claude Code | VS Code |
|---|---|---|
| Tool names | `Write`, `Edit` | `create_file`, `replace_string_in_file` |
| Property casing | `snake_case` | `camelCase` |
| Matchers | Supported | Parsed but ignored (all hooks run) |
| Event names | `pre-tool`, `post-tool` | `PreToolUse`, `PostToolUse` |

## Security

- Hooks execute with VS Code's permissions — review carefully
- Never hardcode secrets in hook scripts
- Validate and sanitize all input from the agent
- Use `chat.tools.edits.autoApprove` to prevent agent from editing hook scripts
