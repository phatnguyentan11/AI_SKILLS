---
name: root-cause-debugging
description: Use for bugs, failing tests, CI failures, logs, incidents, performance regressions, unexpected behavior, or repeated fix failures.
---

# Root Cause Debugging

## When To Use

Use when behavior differs from expectation or verification fails.

## Process

1. Reproduce or collect concrete evidence.
2. Trace backward from symptom to owner module.
3. Inspect recent changes, config, data shape, logs, tests, and external dependencies.
4. Identify the smallest root-cause fix.
5. Add or update regression coverage.
6. Verify the original failing path.

## Rules

- Do not guess-and-patch.
- Do not mask symptoms.
- Do not ignore failed checks.
- Escalate destructive or production-risk actions for approval.

