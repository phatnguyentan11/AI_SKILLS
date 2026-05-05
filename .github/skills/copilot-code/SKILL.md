---
name: copilot-code
description: Use when users ask about GitHub Copilot features in VS Code, including agent mode, custom agents, agent skills, prompt files, custom instructions, hooks, MCP servers, handoffs, configuration, troubleshooting, or enterprise deployment. Activate for questions like 'How do I use Copilot agent mode?', 'How to create a custom agent?', 'How to set up MCP?', 'Create a skill', 'Configure hooks', or 'Fix Copilot issues'.
allowed-tools: [read, search, web]
---

# GitHub Copilot Expert (VS Code)

GitHub Copilot in VS Code is an AI-powered coding assistant with an agent mode that enables autonomous, multi-step task execution. It is extensible through custom agents, skills, prompt files, instructions, hooks, and MCP servers.

## When to Use This Skill

Use when users need help with:
- Understanding GitHub Copilot agent mode features and capabilities
- Creating or managing custom agents (`.github/agents/*.md`)
- Creating or managing agent skills (`.github/skills/`)
- Creating prompt files / slash commands (`.github/prompts/*.prompt.md`)
- Writing custom instructions (`.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`)
- Configuring hooks (`.github/hooks/*.json`)
- Configuring MCP servers for external tool integration
- Setting up agent handoffs between custom agents
- Troubleshooting Copilot issues
- Enterprise deployment and organization-level customization
- Understanding the customization cheat sheet

**Activation examples:**
- "How do I create a custom agent?"
- "What tools can my agent use?"
- "How to set up MCP servers?"
- "Create a new skill for X"
- "How to configure hooks in VS Code?"
- "What are handoffs and how do I use them?"
- "Fix Copilot agent not using my instructions"

## Core Architecture

**Custom Agents**: Specialist personas defined in `.github/agents/*.md` with specific instructions, tool restrictions, model preferences, and handoffs.

**Agent Skills**: Modular capabilities in `.github/skills/<name>/SKILL.md` — loaded automatically when relevant to the task.

**Prompt Files**: Reusable slash commands in `.github/prompts/*.prompt.md` — invoked manually via `/command-name` in chat.

**Custom Instructions**: Always-on context in `.github/copilot-instructions.md` (repo-wide) or `.github/instructions/*.instructions.md` (path-specific).

**Hooks**: Shell commands executing at lifecycle events (PreToolUse, PostToolUse, SessionStart, Stop, etc.) stored in `.github/hooks/*.json`.

**MCP Servers**: Model Context Protocol integrations connecting external tools and APIs.

**Handoffs**: Guided sequential workflows that transition between agents with pre-filled prompts.

## Quick Reference

Load these references when needed for detailed guidance:

### Customization Features
- **Custom Agents**: `references/custom-agents.md`
  - Agent frontmatter, tools, handoffs, scoped hooks, file locations

- **Agent Skills**: `references/agent-skills.md`
  - SKILL.md format, allowed-tools, directory structure, best practices

- **Prompt Files**: `references/prompt-files.md`
  - .prompt.md format, variables, agent/tools frontmatter, slash commands

- **Custom Instructions**: `references/custom-instructions.md`
  - copilot-instructions.md, path-specific instructions, AGENTS.md

### Extension & Integration
- **Hooks**: `references/hooks.md`
  - All 8 lifecycle events, hook format, input/output, OS-specific commands

- **MCP Integration**: `references/mcp-integration.md`
  - mcp.json configuration, built-in servers (github, playwright), custom servers

### Configuration & Troubleshooting
- **Configuration**: `references/configuration.md`
  - VS Code settings, tool aliases, model selection, chat.agentFilesLocations

- **Troubleshooting**: `references/troubleshooting.md`
  - Diagnostics view, common issues, hook debugging, agent not loading

- **Best Practices**: `references/best-practices.md`
  - YAGNI/KISS/DRY, security, tool restrictions, sharing agents across teams

## Common Workflows

### Create a Custom Agent
```
1. Create .github/agents/my-agent.md
2. Add YAML frontmatter: name, description, tools, target
3. Write agent instructions in Markdown body
4. Select agent from dropdown in Chat view
```

### Create an Agent Skill
```
1. Create .github/skills/my-skill/SKILL.md
2. Add frontmatter: name, description
3. Write instructions in Markdown body
4. Copilot loads it automatically when relevant
```

### Create a Prompt File
```
1. Create .github/prompts/my-task.prompt.md
2. Add frontmatter: description, agent, tools (optional)
3. Write prompt in Markdown body
4. Invoke with /my-task in chat
```

### Configure a Hook
```
1. Create .github/hooks/my-hook.json
2. Define hooks object with event → command array
3. Hook runs automatically at the configured lifecycle event
```

## Instructions for Copilot

When responding to GitHub Copilot questions:

1. **Identify the topic** from the user's question
2. **Load relevant references** from the Quick Reference section above
3. **Provide specific guidance** using information from loaded references
4. **Include examples** when helpful — prefer VS Code-specific examples

**Loading references:**
- Read reference files only when needed for the specific question
- Multiple references can be loaded for complex queries

**For custom agent questions:** Load `references/custom-agents.md`

**For skill creation:** Load `references/agent-skills.md`

**For prompt file questions:** Load `references/prompt-files.md`

**For custom instructions:** Load `references/custom-instructions.md`

**For hook questions:** Load `references/hooks.md`

**For MCP questions:** Load `references/mcp-integration.md`

**For configuration/settings:** Load `references/configuration.md`

**For troubleshooting:** Load `references/troubleshooting.md`

**For best practices:** Load `references/best-practices.md`

**Documentation links:**
- Customization cheat sheet: https://docs.github.com/en/copilot/reference/customization-cheat-sheet
- Custom agents config reference: https://docs.github.com/en/copilot/reference/custom-agents-configuration
- VS Code custom agents: https://code.visualstudio.com/docs/copilot/customization/custom-agents
- VS Code hooks: https://code.visualstudio.com/docs/copilot/customization/hooks
- VS Code agent skills: https://code.visualstudio.com/docs/copilot/customization/agent-skills
- Adding skills (GitHub docs): https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/add-skills
- Awesome Copilot: https://github.com/github/awesome-copilot

Provide accurate, actionable guidance based on the loaded references and official documentation.
