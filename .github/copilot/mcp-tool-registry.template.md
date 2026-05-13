# MCP Tool Registry Template

Purpose: document approved MCP connectors before they are used by Copilot or any AI agent.

Copy this template into a project-specific docs location and complete one entry per connector. Do not store secrets here.

## Connector Entry

| Field | Value |
| --- | --- |
| Connector name |  |
| MCP server/package |  |
| Owner/team |  |
| Business purpose |  |
| Environment | local / test / staging / production |
| Data classification | public / internal / confidential / restricted |
| Approved domains/tools |  |
| Allowed actions | read-only / write-approved / admin-approved |
| Explicitly forbidden actions |  |
| Auth method | Entra ID / OAuth / PAT / service identity / other |
| Secret storage | user profile / enterprise vault / managed identity / other |
| Audit evidence location |  |
| Retention notes |  |
| Rollback/disable path |  |
| Approval owner |  |
| Last reviewed | YYYY-MM-DD |

## Recommended Baseline Entries

### Azure DevOps

- Purpose: read Azure Boards work items, Azure Repos context, Azure Wiki docs, and Azure Pipelines status from approved `dev.azure.com` organizations.
- Default action mode: read-only.
- Recommended domains: `core`, `work`, `work-items`, `repositories`, `wiki`, `pipelines`.
- Forbidden without approval: work item writes, PR creation, branch creation, pipeline mutation, broad log export.

### Slack

- Purpose: read approved engineering channels or threads for incident and requirement context.
- Default action mode: read-only.
- Forbidden without approval: posting messages, joining channels, exporting channel history, reading private messages.
- Sensitive data note: summarize threads; do not paste full chat histories into prompts or docs.

### Database Schema

- Purpose: read metadata such as schemas, tables, columns, indexes, constraints, stored procedure signatures, and migration history.
- Default action mode: read-only metadata.
- Forbidden without approval: querying table data, running DML/DDL, reading production rows, exporting data.
- Sensitive data note: schema names can reveal internal systems; avoid broad disclosure in generated docs.

## Review Checklist

- Least privilege is documented.
- Tool list is narrow and task-specific.
- Write operations are disabled or approval-gated.
- Secrets are not stored in repo files.
- Sensitive data classes are identified.
- Audit and disable paths are known.
- Human owner is assigned.

## Retrieval Keywords

MCP registry, connector allowlist, Azure DevOps MCP, Slack MCP, database schema MCP, tool governance, least privilege, audit, banking AI connectors.
