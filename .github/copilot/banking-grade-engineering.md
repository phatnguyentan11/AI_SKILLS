# Banking Grade Engineering

Purpose: define strict AI-assisted development controls for software work in a bank or regulated financial environment.

## Required Delivery Gates

| Gate | Required output |
| --- | --- |
| Context discovery | Relevant files, docs, configs, tests, and current behavior |
| Plan before dev | Scope, non-goals, affected files, data impact, security risk, rollback, tests, docs, approvals |
| Implementation | Minimal durable change, existing patterns, no fake integrations, no hidden risk |
| Verification | Compile/typecheck/lint/tests/security checks or explicit unrun-check note |
| Line review | Every changed line reviewed for correctness, security, privacy, data integrity, auditability |
| Docs base update | `.github/docs/project-docs-base.md`, `.github/docs/project-changelog.md`, `.github/docs/feature-delivery-log.md` updated when relevant |
| Completion report | Evidence, residual risk, rollback, docs updated, next actions |

## Security And Privacy Rules

- Never include real customer, account, transaction, card, identity, credential, token, internal bank, or production data in code, tests, prompts, screenshots, logs, docs, or commits.
- Use sanitized examples and synthetic test data only.
- Never log secrets, tokens, passwords, OTPs, private keys, access tokens, refresh tokens, session IDs, customer identifiers, or sensitive payloads.
- Require authorization checks at trust boundaries.
- Validate input and normalize data before persistence or downstream calls.
- Treat external API calls, auth flows, database writes, and event handlers as high-risk.
- Prefer idempotency for webhook, transaction, queue, and retry paths.
- Prefer auditable and explicit control flow over clever abstractions.

## Data Integrity Rules

- Identify source of truth for every state-changing feature.
- Protect migrations with rollback notes and backup assumptions.
- Use transactions where partial writes can corrupt state.
- Handle retries, duplicate events, race conditions, clock skew, and stale reads.
- Preserve backward compatibility for persisted data and public contracts.

## Review Checklist

Review every changed line and confirm:

- requirement alignment
- edge cases
- auth/authz
- input validation
- error handling
- transactionality and idempotency
- sensitive data exposure
- logging and observability
- dependency and supply-chain risk
- tests and fixtures
- docs and runbooks
- rollback and operational safety

## Docs Base Rule

After each feature, fix, migration, or operational change, update `.github/docs/` unless the change is strictly internal and has no behavior, setup, risk, or maintenance impact.

Minimum docs:

- `.github/docs/project-docs-base.md`: current architecture, setup, behavior, commands, operational notes.
- `.github/docs/project-changelog.md`: dated history of meaningful changes.
- `.github/docs/feature-delivery-log.md`: delivery evidence, verification, risks, approvals, follow-ups.

## Completion Template

```text
Plan: [created/updated path or summary]
Changed files: [list]
Verification: [commands and results]
Line review: [completed / findings]
Security/privacy/data impact: [summary]
Docs updated: [paths]
Rollback: [notes]
Residual risk: [risk or none known]
Unrun checks: [checks or none]
```

## Retrieval Keywords

banking-grade engineering, regulated finance, plan before dev, line-by-line review, docs base, data privacy, PII, secrets, rollback, audit evidence, security review, financial software.
