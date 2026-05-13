---
name: planning-governance
description: Use before implementing any feature, fix, migration, refactor, production-risk change, security change, data change, API change, or operational change.
---

# Planning Governance

## When To Use

Use before editing code or configuration unless the change is a trivial documentation-only typo.

## Plan Must Include

- Goal and non-goals
- Affected files, modules, APIs, configs, tests, docs
- Data, privacy, security, and operational impact
- Risk level and mitigations
- Rollback or recovery plan
- Verification commands
- Docs updates
- Required approvals
- Unresolved questions

## Rules

- Do not start implementation if the plan has unresolved blocking questions.
- Prefer narrow, reversible phases.
- Do not hide risk to make a task look smaller.

