---
name: review
description: Review code or recent changes for correctness, security, performance, and tests.
argument-hint: "[scope]"
agent: agent
---

# Review

Use `#codebase` and changed files when available.

Perform a line-by-line review for changed code. In banking contexts, assume auth, data, privacy, audit, and rollback risk until checked.

Lead with findings ordered by severity:

- Critical
- High
- Medium
- Low

Each finding should include file or symbol reference, impact, and recommended fix. Focus on bugs, regressions, business-logic mismatch, security, data loss, broken contracts, performance, missing tests, docs gaps, rollback gaps, audit gaps, and maintainability.

If there are no meaningful issues, say so and mention residual risk or unrun checks.

Follow `.github/copilot-instructions.md`, `.github/copilot/codebase-analysis-playbook.md`, and `.github/copilot/banking-grade-engineering.md`.
