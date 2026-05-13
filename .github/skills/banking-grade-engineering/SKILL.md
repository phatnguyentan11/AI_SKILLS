---
name: banking-grade-engineering
description: Use for software work in a bank, regulated service, identity, ledger, reporting, compliance, or production operations context. Enforces planning, data safety, security, line review, verification evidence, rollback, and docs updates.
---

# Banking Grade Engineering

## When To Use

Use for all work unless the task is purely conversational and unrelated to code, docs, configuration, security, data, or operations.

## Rules

- Plan before dev.
- Treat customer, account, transaction, card, identity, credential, token, internal bank, and production data as sensitive.
- Never place sensitive data in code, tests, prompts, screenshots, logs, docs, or commits.
- Require rollback notes for production-impacting changes.
- Review every changed line before completion.
- Update `.github/docs/` after feature, fix, migration, security, data, or operational changes.
- Report verification evidence and checks not run.

## Output Checklist

- Plan summary
- Changed files
- Verification evidence
- Line-review result
- Security/privacy/data impact
- Docs updated
- Rollback notes
- Residual risk
