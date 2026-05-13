---
name: "Banking Grade Engineering"
description: "Regulated financial-services delivery rules for planning, security, review, verification, and docs."
applyTo: "**"
---

# Banking Grade Engineering Instructions

- Treat every change as potentially regulated until proven otherwise.
- If an old/reference project, folder, diff, or snippet is provided, read it first and compare it with the current package/codebase before planning.
- Analyze system flow, business logic, data contracts, dependencies, side effects, and blast radius before proposing a solution.
- Plan before editing. Include scope, affected files, security/privacy risk, data impact, rollback, verification, and docs impact.
- Wait for developer/user plan review and approval before implementation unless the request is explicitly docs-only.
- Base solutions on the existing codebase structure, naming, contracts, tests, and patterns. Do not invent parallel architecture.
- Use least privilege and defense in depth for auth, authorization, tokens, data access, secrets, logging, external APIs, and deployment.
- Never use production customer data, account data, card data, PII, secrets, or internal bank identifiers in examples, prompts, tests, logs, screenshots, or docs.
- Review every changed line before completion. Record critical findings, resolved findings, residual risk, and checks not run.
- Update `.github/docs/` after every feature, fix, migration, or operational change.
- Do not proceed with destructive database, migration, auth, encryption, permission, or deployment actions without explicit user approval and rollback notes.
