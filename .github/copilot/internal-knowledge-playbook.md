# Internal Knowledge Playbook

Purpose: govern how internal documentation, coding standards, old project knowledge, and incident history are made available to AI tools.

## Knowledge Layers

| Layer | Use | Storage |
| --- | --- | --- |
| Project Copilot references | Stable engineering rules and sanitized patterns for Copilot retrieval | `.github/copilot/references/` |
| Docs base | Current package behavior, changelog, delivery evidence | `.github/docs/` |
| NotebookLM-style notebook | Human-facing onboarding and document Q&A over approved internal sources | Enterprise-approved NotebookLM workspace or equivalent |
| Enterprise vector/file search | Large private corpora for Deep Research or internal agents | Approved private vector store or search service |

## Source Eligibility

Allowed when approved:

- coding conventions
- architecture docs
- API contracts
- runbooks
- sanitized bug retrospectives
- old project design notes after security review
- database schema docs without row data
- onboarding material

Not allowed:

- production customer data
- account, card, identity, credential, token, OTP, session, or secret data
- raw production logs
- private chat exports without approval
- vendor contracts or legal documents outside approved scope
- documents without ownership or retention approval

## NotebookLM-Style Governance

- Use only organization-approved work or enterprise accounts.
- Keep notebooks project-specific; do not mix unrelated domains.
- Register every source in `.github/copilot/knowledge-source-register.template.md` or a project-specific copy.
- Prefer sanitized Markdown/PDF exports of internal docs.
- Do not upload secrets, raw logs, or production data.
- Treat answers as source-grounded assistance, not final approval.
- Require citations or source references for decisions.

## Old Project Migration Flow

```text
Collect old project docs/code snippets
-> classify data sensitivity
-> remove secrets, identifiers, production data, and customer examples
-> extract reusable patterns and business rules
-> store concise sanitized guidance in `.github/copilot/references/`
-> register source and review owner
-> update docs base and changelog
```

## Output Template

```text
Knowledge request:
Sources used:
Data classification:
Answer:
Evidence/citations:
Assumptions:
Recommended codebase follow-up:
Residual risk:
```

## Retrieval Keywords

internal knowledge, NotebookLM, onboarding, coding convention, old project knowledge, private docs, source register, RAG governance, sanitized references.
