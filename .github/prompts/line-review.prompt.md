---
name: line-review
description: Perform banking-grade line-by-line review of changed code.
argument-hint: "[scope or diff]"
agent: agent
---

# Line By Line Review

Use `#codebase` and changed files when available.

Review every changed line for:

- correctness and edge cases
- security and authorization
- PII, secrets, logging, and data exposure
- data integrity, transactions, idempotency, concurrency
- error handling and observability
- dependency and supply-chain risk
- tests, docs, and rollback coverage

Lead with findings ordered by severity. If no meaningful issues are found, say so and list residual risk plus checks not run.

Follow `.github/copilot-instructions.md` and `.github/copilot/banking-grade-engineering.md`.
