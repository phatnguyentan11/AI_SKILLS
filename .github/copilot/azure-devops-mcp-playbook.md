# Azure DevOps MCP Playbook

Purpose: define how Copilot may use Azure DevOps context from `dev.azure.com` through approved MCP connectors.

## Scope

Use Azure DevOps MCP for repository delivery context:

- Azure Boards work items: Epic, Feature, User Story, Bug, Task
- Azure Repos: repositories, branches, pull requests, code search
- Azure Pipelines: build and release status, failed job summaries
- Azure Wiki: approved internal technical documentation

Do not use Azure DevOps MCP for production secrets, customer data, account data, private credentials, or unrestricted pipeline logs.

## Default Safety Model

- Read-only by default.
- Use least-privilege organization, project, repository, team, and domain allowlists.
- Prefer narrow domains such as `core`, `work`, `work-items`, `repositories`, `wiki`, and `pipelines`.
- Do not create or update work items, comments, branches, pull requests, build definitions, variable groups, or pipeline runs unless the user explicitly approves that action.
- Treat work item comments, attachments, pipeline logs, and wiki pages as potentially sensitive.
- Summarize only decision-relevant details. Do not paste large raw payloads into prompts or docs.

## Recommended MCP Domains

| Need | Domains |
| --- | --- |
| Work item intake | `core`, `work`, `work-items` |
| Code planning with repo context | `core`, `work-items`, `repositories`, `search` |
| Technical docs lookup | `core`, `wiki` |
| Build failure triage | `core`, `pipelines`, `repositories` |
| Security or compliance review | `core`, `work-items`, `repositories`, `advanced-security` when approved |

## Example Local MCP Configuration

Keep this as a reference only. Do not commit real organization names, project names, tokens, or user identifiers.

```json
{
  "inputs": [
    {
      "id": "ado_org",
      "type": "promptString",
      "description": "Azure DevOps organization name from dev.azure.com"
    }
  ],
  "servers": {
    "azure_devops_readonly": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@azure-devops/mcp",
        "${input:ado_org}",
        "-d",
        "core",
        "work",
        "work-items",
        "repositories",
        "wiki",
        "pipelines"
      ]
    }
  }
}
```

## Work Item Intake Flow

```text
Azure Boards work item or dev.azure.com URL
-> verify connector approval and scope
-> read title, description, acceptance criteria, state, area, iteration, links
-> read related repo/wiki/pipeline context only when needed
-> search local codebase
-> map business rules, affected files, data impact, tests, docs, risk
-> create banking-grade plan
-> stop for developer approval
```

## Output Template

```text
Azure DevOps context:
- Work item:
- Project/team:
- Requirement summary:
- Acceptance criteria:
- Related code/docs:
- Unknowns:

Codebase match:
- Existing modules:
- Similar patterns:
- Data/contracts:

Plan inputs:
- Affected files:
- Risks:
- Verification:
- Docs:
- Approval needed:
```

## Approval-Gated Actions

Require explicit approval before:

- writing work item comments or state changes
- creating branches, commits, pull requests, or review comments
- queueing, canceling, or rerunning pipelines
- reading broad pipeline logs that may contain secrets
- reading attachments with unknown sensitivity
- connecting to additional projects, orgs, or repositories outside the allowlist

## Retrieval Keywords

Azure DevOps MCP, dev.azure.com, Azure Boards, work item intake, Azure Repos, Azure Pipelines, Azure Wiki, MCP domains, read-only connector, banking governance.
