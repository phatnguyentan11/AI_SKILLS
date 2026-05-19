# Analysis Debug Review Patterns

Purpose: strengthen Copilot for system analysis, code explanation, logic checking, debugging, and review.

## Code Reading Protocol

1. Start from the user-visible behavior or entry point.
2. Trace the exact execution path through layers.
3. Name the business rule each branch enforces.
4. Identify data read/write points and external side effects.
5. Check tests and docs that describe the same behavior.
6. State uncertainties before proposing code.

## Business Logic Check

For every meaningful branch, check:

- role or permission requirement
- input validation and normalization
- status/state transition
- thresholds, dates, currencies, precision, and rounding
- idempotency and duplicate requests
- downstream contract assumptions
- audit/logging requirement
- expected user-visible error

## Debugging Loop

1. Reproduce or collect evidence.
2. Define expected behavior and actual behavior.
3. Trace backward from symptom to owner layer.
4. Compare current data and branch conditions against business rules.
5. Change the smallest root-cause owner.
6. Add or update regression coverage.
7. Re-run targeted checks and record unrun checks.

## When Stuck

- Reduce the problem to one failing path.
- Compare a known-good similar flow in the same codebase.
- Remove assumptions that are not backed by code, tests, logs, or docs.
- Prefer explaining the current system over inventing a new abstraction.
- Ask for approval before touching data, auth, migration, deployment, or production-risk configuration.

## Review Pattern

Lead with findings ordered by severity. For each finding include:

```text
Severity:
File/symbol:
Issue:
Impact:
Recommended fix:
Verification:
```

Always check correctness, business logic, security, privacy, data integrity, rollback, observability, tests, and docs. If no issues are found, say so and list residual risk.

## Retrieval Keywords

system analysis, code explanation, business logic check, root cause debugging, line-by-line review, banking review, blast radius, evidence-based debugging, regression coverage.
