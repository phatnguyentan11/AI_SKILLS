---
name: mcp-integration-governance
description: Use when connecting Copilot or AI agents to MCP tools such as Azure DevOps, Slack, database schema readers, internal search, or other enterprise systems.
---

# MCP Integration Governance

## When To Use

Use before selecting, configuring, or using any MCP connector or tool.

## Rules

- Confirm the MCP server is approved for the repository and task.
- Use read-only access by default.
- Prefer narrow tool/domain allowlists.
- Do not store tokens, PATs, credentials, or organization secrets in repository files.
- Do not read production customer data, raw sensitive logs, private messages, or unrestricted attachments.
- Require explicit approval for write operations, pipeline actions, database actions, or broad exports.
- Summarize only decision-relevant context.
- Record connector owner, scope, data classification, and disable path.

## Output

- Connector/tool selected
- Approved scope
- Data classification
- Allowed actions
- Forbidden actions
- Manual fallback
- Approval needed

