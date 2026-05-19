---
name: secure-code-review
description: Use for reviewing code changes, pull requests, generated code, security-sensitive code, banking workflows, or any completion gate before work is called done.
---

# Secure Code Review

## When To Use

Use after implementation and whenever the user asks for review.

## Review Every Changed Line For

- Correctness and edge cases
- Auth/authz
- Input validation and output encoding
- Secrets, PII, logs, and data exposure
- Data integrity, transactions, idempotency, concurrency
- Error handling and observability
- Dependency and supply-chain risk
- Tests and fixtures
- Docs, runbooks, and rollback

## Output

Lead with severity-ranked findings. Include file or symbol references, impact, fix recommendation, residual risk, and checks not run.

