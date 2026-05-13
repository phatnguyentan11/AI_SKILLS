---
name: deep-research
description: Create an evidence-backed research report using approved public, MCP, and internal sources.
argument-hint: "[research question]"
agent: agent
---

# Deep Research

Use for complex research that needs multiple sources and citations.

Before research:

- clarify goal, constraints, non-goals, target stack, and decision deadline
- define approved source list
- identify whether internal sources, Azure DevOps MCP, database schema metadata, or web sources are allowed

Report:

- question and scope
- sources used
- option comparison
- decision matrix
- security/privacy/data impact
- operational impact
- recommendation
- residual risks
- ADR or implementation-plan follow-up

Do not use unapproved internal data, secrets, production logs, customer data, or uncited claims.

Follow `.github/copilot/deep-research-playbook.md` and `.github/skills/deep-research-governance/SKILL.md`.
