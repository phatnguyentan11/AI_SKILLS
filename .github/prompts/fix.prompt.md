---
name: fix
description: Diagnose and fix a bug, failing test, type error, UI issue, log issue, or CI failure.
argument-hint: "[issue, log, or failing command]"
agent: agent
---

# Fix

Use `#codebase` to trace the issue before editing.

Process:

1. Reproduce or identify evidence.
2. Explain the affected code path and business rule.
3. Trace root cause.
4. Make the smallest safe change based on existing patterns.
5. Add regression coverage when appropriate.
6. Run or provide verification commands.

Do not weaken tests, hide errors, or fake data just to pass.

Follow `.github/copilot-instructions.md`, `.github/copilot/workflow-playbook.md`, `.github/copilot/codebase-analysis-playbook.md`, and `.github/copilot/manual-tooling-guide.md`.
