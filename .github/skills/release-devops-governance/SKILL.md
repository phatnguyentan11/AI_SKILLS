---
name: release-devops-governance
description: Use for CI/CD, deployment, environment variables, infrastructure, release notes, rollback, monitoring, and operational readiness.
---

# Release DevOps Governance

## When To Use

Use when changing CI, deployment, infrastructure, environment config, build scripts, operational runbooks, or release behavior.

## Rules

- Separate local, test, staging, and production assumptions.
- Never expose secrets or environment values.
- Require rollback or recovery notes for release-impacting changes.
- Include verification commands and monitoring signals.
- Prefer reproducible commands.
- Do not deploy or mutate production without explicit approval.
- Update docs and delivery log.

