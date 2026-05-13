---
name: mcp
description: Select MCP tools or provide manual fallback steps.
argument-hint: "[task]"
agent: ask
---

# MCP

Identify whether MCP would help with the task.

If MCP is enabled:

- name the relevant MCP server or tool
- explain what it should retrieve or execute
- continue with the returned context

If MCP is unavailable:

- provide manual steps
- ask the user to paste output
- continue with repository context

Follow `.github/copilot-instructions.md` and `.github/copilot/manual-tooling-guide.md`.
