# Agent Catalog

Purpose: list custom agent profiles in this standalone Copilot package.

Custom agents live in `.github/agents/*.agent.md`.

## Agents

| Copilot agent profile                        | Purpose                                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------- |
| `.github/agents/system-analyst.agent.md`     | Analyze architecture, code flow, business logic, dependencies, and blast radius |
| `.github/agents/planner.agent.md`            | Create plans, risks, phases, approvals, rollback, and validation strategy       |
| `.github/agents/researcher.agent.md`         | Search codebase/docs and summarize relevant context                             |
| `.github/agents/tester.agent.md`             | Identify verification commands and analyze failures                             |
| `.github/agents/debugger.agent.md`           | Reproduce, trace root cause, and propose minimal fixes                          |
| `.github/agents/code-reviewer.agent.md`      | Review changes with severity-ranked findings                                    |
| `.github/agents/security-reviewer.agent.md`  | Review banking-grade security, privacy, data integrity, and audit risks         |
| `.github/agents/docs-manager.agent.md`       | Update docs, changelog, delivery log, and standards                             |
| `.github/agents/research-architect.agent.md` | Produce evidence-backed architecture research and ADR-ready recommendations     |

## Agent Design Rules

- Use agents for persistent personas.
- Use prompts for one-off workflows.
- Use skills for reusable capabilities with domain resources.
- Keep each agent role narrow.
- Avoid assuming custom agents can run terminal or MCP tools unless enabled in the client.

## Retrieval Keywords

custom agents, `.agent.md`, system analyst, planner, researcher, tester, debugger, code reviewer, security reviewer, docs manager, research architect, banking-grade review, business logic.
