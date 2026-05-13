# Deep Research Playbook

Purpose: govern AI-assisted research for libraries, architecture decisions, technical tradeoffs, and internal knowledge synthesis.

## When To Use

Use deep research for complex questions where a quick answer is not enough:

- compare architectures such as modular monolith vs microservices
- evaluate new libraries, frameworks, or SDKs
- research performance, reliability, security, or maintainability tradeoffs
- synthesize approved internal docs with external official sources
- draft architecture decision records

Do not use deep research to bypass engineering review, security review, procurement, legal review, or architecture governance.

## Source Policy

Prefer sources in this order:

1. Official vendor documentation.
2. Standards, specifications, and security advisories.
3. Source repositories and release notes.
4. Internal approved docs or Azure Wiki pages.
5. Reputable engineering writeups, only when clearly labeled as secondary evidence.

Avoid relying on anonymous posts, stale benchmarks, generated summaries without citations, or marketing-only pages.

## Banking Controls

- Use only approved public websites, approved MCP connectors, or approved internal vector/file search.
- Do not upload secrets, raw production logs, customer data, or restricted documents.
- Keep research prompts explicit about constraints, target stack, workload, compliance needs, and non-goals.
- Require source citations and separate facts from assumptions.
- Produce recommendation plus risks, not just a summary.
- Convert final technical decisions into an ADR or plan for human approval.

## Research Flow

```text
Clarify goal and constraints
-> define source allowlist
-> collect evidence with citations
-> compare options against project constraints
-> identify security, operational, data, and compliance risks
-> recommend option and alternatives
-> create ADR draft or banking-grade implementation plan
-> stop for human review
```

## Report Template

```text
Question:
Scope:
Non-goals:
Sources used:
Options compared:
Decision matrix:
Security/privacy/data impact:
Operational impact:
Recommendation:
ADR draft:
Residual risk:
Follow-ups:
```

## Retrieval Keywords

deep research, technical research, architecture comparison, ADR, source citations, library evaluation, internal docs synthesis, MCP research, file search.
