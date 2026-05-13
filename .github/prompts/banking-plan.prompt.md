---
name: banking-plan
description: Create a banking-grade implementation plan with risk, rollback, verification, review, and docs gates.
argument-hint: "[feature, fix, migration, or incident]"
agent: plan
---

# Banking Grade Plan

If a reference/old project, folder, diff, or snippet is provided, read it first and compare it with the current package/codebase before planning.

Use `#codebase` to inspect relevant files, tests, docs, configs, and existing patterns.

Create a plan with:

- goal and non-goals
- reference comparison summary when applicable
- impacted modules, files, APIs, data, configs, and docs
- security, privacy, compliance, and operational risks
- rollback or recovery plan
- implementation phases
- test and verification commands
- line-by-line review checklist
- docs base updates required in `.github/docs/`
- unresolved questions and approvals needed

Do not implement in this prompt.

Follow `.github/copilot-instructions.md` and `.github/copilot/banking-grade-engineering.md`.
