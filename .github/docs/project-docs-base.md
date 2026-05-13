# Project Docs Base

Last updated: 2026-05-13

## Purpose

This document is the living docs base for the standalone `.github/` GitHub Copilot package. Keep it aligned with current instructions, prompts, agents, skills, governance, and operating behavior.

## Current Scope

This package contains banking-grade GitHub Copilot customization assets:

- `.github/copilot-instructions.md`
- `.github/instructions/*.instructions.md`
- `.github/prompts/*.prompt.md`
- `.github/agents/*.agent.md`
- `.github/skills/*/SKILL.md`
- `.github/workflows/*.yml`
- `.github/copilot/**/*.md`
- `.github/docs/*.md`

## Analysis-First Focus

This package prioritizes system analysis before solutioning:

- when a reference/old project is provided, read it first and compare it with the current package/codebase
- use `.github/copilot/references/` for sanitized deep reference knowledge when skills are too short
- read existing code and docs before proposing changes
- explain current flow and business logic before editing
- map blast radius across code, tests, configs, data, APIs, jobs, queues, and docs
- create a plan and wait for developer/user review before implementation
- base solutions on the existing codebase structure and patterns

## Curated Skills

The package includes curated Markdown-only skills for:

- banking-grade engineering
- system analysis
- codebase reading
- business logic analysis
- code solution fit
- planning governance
- secure code review
- testing verification
- docs base maintenance
- root cause debugging
- backend API governance
- database data integrity
- release/devops governance
- ASP.NET Core governance
- dotnet testing

## Banking Grade Delivery Rules

- Reference/old project comparison is mandatory when such input is provided.
- Plan before dev.
- Developer/user reviews and approves the plan before implementation.
- Solution must fit the existing codebase first.
- Review every changed line.
- Protect secrets, credentials, customer data, account data, card data, PII, and internal bank identifiers.
- Run or record verification checks.
- Update this docs base after each feature or behavior change.
- Record rollback and residual risk for production-impacting changes.

## Verification Commands

This repository currently contains the `.github` Copilot package only. Verify with file inventory, Markdown/frontmatter inspection, package-scope scans, and manual workflow review.

Run from the repository root:

```powershell
rg --files -uu .github
Get-ChildItem .github\skills -Directory | ForEach-Object { if (-not (Test-Path (Join-Path $_.FullName "SKILL.md"))) { throw "Missing SKILL.md: $($_.FullName)" } }
Test-Path .github\prompts\design.prompt.md
Test-Path .github\agents\ui-ux-designer.agent.md
Test-Path .github\skills\frontend-quality\SKILL.md
Test-Path .github\skills\payments-risk-governance\SKILL.md
$secretPattern = '(?i)(password|passwd|pwd|secret|token|api[_-]?key|client[_-]?secret)\s*[:=]\s*["''][^"''\s]{12,}["'']'
Get-ChildItem .github -Recurse -File | Select-String -Pattern $secretPattern
```

The four `Test-Path` checks for removed assets should return `False`; the secret-pattern command should return no matches.

The `.github/workflows/manual-governance-checks.yml` workflow is manual-only because CI is not enabled for this package repository yet. When copied into a real application repository, enable branch protection and decide whether to trigger the workflow on pull requests.

## Operational Notes

- Copilot is an assistant, not the final approver.
- Human review remains mandatory for regulated banking code.
- MCP and terminal execution depend on local/enterprise policy.
