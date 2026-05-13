---
name: azure-devops-intake
description: Read approved Azure DevOps work item context from dev.azure.com and turn it into codebase-fit plan inputs.
argument-hint: "[work item id or dev.azure.com URL]"
agent: agent
---

# Azure DevOps Intake

Use approved Azure DevOps MCP context when available. If MCP is unavailable, ask the user to paste the work item title, description, acceptance criteria, and relevant links.

Read only what is needed:

- work item title, type, state, description, acceptance criteria
- area, iteration, tags, priority, severity
- related work items, branches, pull requests, wiki pages, pipeline status when relevant

Then inspect `#codebase` and produce:

- requirement summary
- acceptance criteria summary
- affected modules/files
- existing patterns to reuse
- business rules and data contracts
- security/privacy/data impact
- verification commands
- unresolved questions
- recommended `/banking-plan` inputs

Do not write to Azure DevOps, create branches, create PRs, update work item state, or queue pipelines without explicit approval.

Follow `.github/copilot/azure-devops-mcp-playbook.md`, `.github/copilot/mcp-tool-registry.template.md`, and `.github/copilot-instructions.md`.
