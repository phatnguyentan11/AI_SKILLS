# Curated Skills Index

Purpose: document which skills are promoted into `.github/skills` and why.

## Promotion Criteria

A skill is promoted only when it is:

- truly useful for Copilot-assisted development
- reviewed and rewritten as Copilot-native Markdown
- free of shell scripts, browser automation, generated assets, credentials, or tool-specific side effects
- clear about when to use it
- compatible with banking governance
- safe to move as part of the standalone `.github/` package

## Promoted Skills

| Skill | Path | Why included |
| --- | --- | --- |
| Banking Grade Engineering | `.github/skills/banking-grade-engineering/SKILL.md` | Core regulated-delivery policy |
| System Analysis | `.github/skills/system-analysis/SKILL.md` | Architecture, flow, dependencies, and blast-radius analysis |
| Codebase Reading | `.github/skills/codebase-reading/SKILL.md` | Read and explain existing code before changing it |
| Business Logic Analysis | `.github/skills/business-logic-analysis/SKILL.md` | Business rules, invariants, roles, data contracts, and state transitions |
| Code Solution Fit | `.github/skills/code-solution-fit/SKILL.md` | Ensure solutions follow the existing codebase |
| Planning Governance | `.github/skills/planning-governance/SKILL.md` | Mandatory plan-before-dev behavior |
| Secure Code Review | `.github/skills/secure-code-review/SKILL.md` | Line-by-line review, security, privacy, data integrity |
| Testing Verification | `.github/skills/testing-verification/SKILL.md` | Evidence-based verification and no fake passing |
| Docs Base Maintenance | `.github/skills/docs-base-maintenance/SKILL.md` | Required docs updates after changes |
| Root Cause Debugging | `.github/skills/root-cause-debugging/SKILL.md` | Reproduce, trace, fix root cause, add regression coverage |
| Backend API Governance | `.github/skills/backend-api-governance/SKILL.md` | API, auth, validation, error, observability controls |
| Database Data Integrity | `.github/skills/database-data-integrity/SKILL.md` | Migrations, transactions, idempotency, rollback |
| Release DevOps Governance | `.github/skills/release-devops-governance/SKILL.md` | CI, release, environment, deployment safety |
| ASP.NET Core Governance | `.github/skills/aspnet-core-governance/SKILL.md` | Controller-service-repository, DI, auth, logging, async, repository rules |
| Dotnet Testing | `.github/skills/dotnet-testing/SKILL.md` | .NET test discovery, xUnit-style regression coverage, dotnet verification |
| MCP Integration Governance | `.github/skills/mcp-integration-governance/SKILL.md` | Azure DevOps, Slack, database schema, and enterprise MCP connector controls |
| Internal Knowledge Governance | `.github/skills/internal-knowledge-governance/SKILL.md` | NotebookLM-style docs, old project references, source register, private knowledge safety |
| Deep Research Governance | `.github/skills/deep-research-governance/SKILL.md` | Source-backed research, architecture comparison, and ADR-ready reports |

## Excluded Categories

The following categories are intentionally not promoted as raw skills:

- skills requiring shell scripts or package installs
- browser automation or local GUI control
- media generation or processing pipelines
- document binary manipulation scripts
- provider-specific financial-network scripts
- broad external-research automation
- template/demo skills without governance value

These can be added later only after a bank-approved tool and data-risk review.

## Reference Migration Decision

The old package used `skills/<skill>/references/` for detailed docs. This package does not copy those folders one-to-one. Raw references were reviewed and either:

- condensed into focused `SKILL.md` rules
- moved into `.github/copilot/references/` as sanitized RAG-friendly knowledge
- rejected because they depended on scripts, package installs, hooks, local paths, `.env` files, provider-specific commands, or project-specific identifiers

This keeps skills safe to trigger while preserving enough deep context for Copilot to reason about system analysis, ASP.NET Core patterns, data/integration flows, debugging, and review.

## Retrieval Keywords

curated skills, promoted skills, system analysis, codebase reading, business logic, code solution fit, ASP.NET Core, dotnet testing, banking governance, safe Copilot skills, no scripts, no secrets, secure review, testing, docs base, backend, database, release, MCP, Azure DevOps, internal knowledge, deep research.
