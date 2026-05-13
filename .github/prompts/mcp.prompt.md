---
name: mcp
description: Select MCP tools or provide manual fallback steps.
argument-hint: "[task]"
agent: ask
---

# MCP

Identify whether MCP would help with the task. Prefer approved read-only context first.

If MCP is enabled:

- name the relevant MCP server or tool
- state the approved scope and data classification
- explain what it should retrieve or execute
- continue with the returned context

If MCP is unavailable:

- provide manual steps
- ask the user to paste output
- continue with repository context

For Azure DevOps work items from `dev.azure.com`, use `/azure-devops-intake` when the task starts from an Azure Boards item.

For database context, use `/db-schema-context` and schema metadata only.

For internal documentation or old project knowledge, use `/internal-knowledge`.

Follow `.github/copilot-instructions.md`, `.github/copilot/manual-tooling-guide.md`, `.github/copilot/azure-devops-mcp-playbook.md`, and `.github/skills/mcp-integration-governance/SKILL.md`.
