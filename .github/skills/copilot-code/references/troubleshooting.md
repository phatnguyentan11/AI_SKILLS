# Troubleshooting GitHub Copilot

## Diagnostics View

Right-click in the Chat view → **Diagnostics**

Shows all loaded:
- Custom agents (with source location)
- Prompt files
- Instruction files
- Skills
- Any errors

## Agent Not Appearing in Dropdown

1. Check file is in `.github/agents/` with `.md` extension
2. Check `user-invocable` is not set to `false`
3. Check `target` is not `github-copilot` (would hide from VS Code)
4. Reload VS Code window (`Developer: Reload Window`)
5. Check Diagnostics view for parse errors in frontmatter YAML

## Skills Not Being Loaded

1. Confirm file is named `SKILL.md` (uppercase, exact)
2. Confirm directory name matches `name` in frontmatter
3. Confirm `description` clearly describes when to activate
4. Check no YAML frontmatter syntax errors
5. Try a more explicit prompt that matches the skill's description

## Hooks Not Running

1. Confirm file is in `.github/hooks/` with `.json` extension
2. Confirm `type: "command"` is set on each hook entry
3. Check **GitHub Copilot Chat Hooks** output channel for errors
4. Check hook script has execute permissions (`chmod +x script.sh` on Linux/Mac)
5. Increase `timeout` if script is slow
6. Verify JSON output from script is valid (use `jq` to test)

## Hook Timeout Errors

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "command": "./slow-script.sh",
        "timeout": 60
      }
    ]
  }
}
```

## Instructions Not Being Applied

1. Confirm `copilot-instructions.md` is at `.github/copilot-instructions.md`
2. For path-specific: check `applyTo` glob pattern matches file being edited
3. Check file is valid Markdown (no parsing errors)
4. Instructions are silently truncated if too long — keep critical rules first

## Custom Agent Tool Errors

Agent says it can't do something (e.g., can't edit files):
- Check `tools` list includes required tool (`edit` for file editing)
- Omitting `tools` entirely = all tools available
- `tools: []` = NO tools (completely restricted)

## Subagent Not Working

- Confirm `agent/runSubagent` is in the agent's `tools` list (VS Code)
- Confirm target subagent exists in `.github/agents/`
- Confirm subagent's `user-invocable` is not the issue (subagent can still be invoked if `disable-model-invocation: false`)
- For `agents:` field — ensure `agent` tool is also in `tools` list

## MCP Server Not Connecting

1. Check `mcp.json` is in `.vscode/` directory
2. Verify server command/path is correct and executable
3. Check environment variables are properly set
4. View MCP output channel for connection errors
5. Test MCP server independently before using with Copilot

## Checking Loaded Hooks

1. Open Output panel (`Ctrl+Shift+U`)
2. Select **GitHub Copilot Chat Hooks** channel
3. Look for "Load Hooks" entries showing which files were loaded

## Viewing Agent Logs

Right-click Chat view → **View Logs** → look for agent execution details
