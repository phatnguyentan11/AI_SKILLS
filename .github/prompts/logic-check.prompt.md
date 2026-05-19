---
name: logic-check
description: Check business logic, code logic, edge cases, and integration behavior against the existing codebase.
argument-hint: "[file, change, flow, or issue]"
agent: agent
---

# Logic Check

Use `#codebase` and changed files when available.

Check:

- requirement alignment
- business invariants and role rules
- null/empty/error cases
- state transitions and idempotency
- concurrency and retry behavior
- data contract compatibility
- downstream integration impact
- tests and docs coverage

Lead with findings ordered by severity. If no issue is found, list residual risk and untested paths.

Follow `.github/copilot-instructions.md` and `.github/copilot/codebase-analysis-playbook.md`.

