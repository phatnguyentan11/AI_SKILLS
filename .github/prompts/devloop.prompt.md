---
name: devloop
description: Run the full plan-approved development loop: analyze, plan, wait for approval, implement, test, review, document.
argument-hint: "[feature or bug fix]"
agent: agent
---

# Dev Loop

Use this only when the user wants end-to-end execution.

Flow:

1. If a reference/old project is provided, read it first and compare it with the current package/codebase.
2. Analyze codebase and business logic.
3. Create a short plan with blast radius, risks, rollback, verification, docs updates.
4. Stop for developer/user plan review and approval.
5. Implement one phase at a time after approval.
6. Verify with build/typecheck/lint/tests/security checks.
7. Review every changed line.
8. Update `.github/docs/`.
9. Report evidence, residual risk, and unrun checks.

Do not skip the approval gate.

Follow `.github/copilot-instructions.md`, `.github/copilot/workflow-playbook.md`, and `.github/copilot/codebase-analysis-playbook.md`.
