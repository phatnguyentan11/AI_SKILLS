# Project Docs Base

Last updated: 2026-05-14

## Purpose

This document is the living docs base for the standalone `.github/` GitHub Copilot package. Keep it aligned with current instructions, prompts, agents, skills, governance, and operating behavior.

## Current Scope

This package contains banking-grade GitHub Copilot customization assets:

- `.github/copilot-instructions.md`
- `.github/copilot/blocked-rules.md`
- `.github/instructions/*.instructions.md`
- `.github/prompts/*.prompt.md`
- `.github/agents/*.agent.md`
- `.github/skills/*/SKILL.md`
- `.github/hooks/pre-push`
- `.github/scripts/pre-push-governance-check.ps1`
- `.github/copilot/**/*.md`
- `.github/docs/*.md`
- `.github/introduce/*.md`
- `.github/introduce/html/*.html`
- `.github/introduce/html/assets/*.css`

## Developer-Facing Documentation

Developer-facing Project AI usage documents live under `.github/introduce/` so `.github/docs/` can remain focused on technical package records:

- `.github/introduce/README.md` - entry point for the introduction docs.
- `.github/introduce/html/index.html` - visual CSS entry page for using Project AI.
- `.github/introduce/html/*.html` - separate visual pages for usage guide, overview, tutorial, and quick reference.
- `.github/introduce/html/assets/sea.css` - responsive sea-blue CSS for the visual introduce pages.
- `.github/introduce/html/assets/docs.js` - lightweight bundled page routing, stable sidebar search/collapse, scroll TOC tracking, code copy, diagram hover, tooltips, and tutorial steps.
- `.github/introduce/html/assets/docs.js` now renders HTML content from local `PAGE_DATA` so the introduce site can work smoothly from `file://` without a fetch-driven full-page reload.
- `.github/introduce/01-system-overview.md` - architect-level overview, current scope, local-only boundary, and system diagrams.
- `.github/introduce/02-huong-dan-su-dung.md` - concise Vietnamese usage guide for developers.
- `.github/introduce/04-quick-reference.md` - daily prompt, agent, command, and safety cheat sheet.

The older guide and presentation files under `.github/docs/` were removed because they duplicated the introduce layer and made the docs folder mix technical records with onboarding content.

## Analysis-First Focus

This package prioritizes system analysis before solutioning:

- when a reference/old project is provided, read it first and compare it with the current package/codebase
- use `.github/copilot/references/` for sanitized deep reference knowledge when skills are too short
- read existing code and docs before proposing changes
- use approved Azure DevOps MCP, internal knowledge, or deep research sources only when they are in scope and read-only by default
- explain current flow and business logic before editing
- map blast radius across code, tests, configs, data, APIs, jobs, queues, and docs
- create a plan and wait for developer/user review before implementation
- base solutions on the existing codebase structure and patterns

## Curated Skills

The package includes curated Markdown-only skills for:

- banking-grade engineering
- system analysis
- business logic analysis
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
- MCP integration governance
- deep research governance

## External Context And R&D Governance

The package now supports governed external context and research workflows:

- Azure DevOps MCP for approved `dev.azure.com` work item, repo, wiki, and pipeline context
- Slack MCP as an optional approved read-only source for engineering thread context
- database schema MCP for metadata only, never production rows
- Deep Research workflows for architecture and library research with citations and ADR-ready outputs

All external sources are read-only by default, least-privilege, approval-gated for writes, and forbidden from exposing secrets, customer data, account data, card data, PII, raw production logs, or unrestricted attachments.

## Banking Grade Delivery Rules

- `.github/copilot/blocked-rules.md` is the single source of truth for non-negotiable blocked rules and wins over conflicting guidance.
- Reference/old project comparison is mandatory when such input is provided.
- Plan before dev.
- Developer/user reviews and approves the plan before implementation.
- Solution must fit the existing codebase first.
- Existing approved components must be searched and suggested before generating new helpers, middleware, libraries, DI/config patterns, serializers, validators, logging wrappers, or exception handling.
- Blocked dependency, serializer, DI/config, logging, exception, and architecture rules are maintained only in `.github/copilot/blocked-rules.md`.
- Dependency injection, configuration, middleware, serialization, logging, and exception handling must follow the existing centralized composition pattern.
- Review every changed line.
- Protect secrets, credentials, customer data, account data, card data, PII, and internal bank identifiers.
- Never log sensitive banking data or return stack traces/internal exception details to clients.
- Run or record verification checks.
- Update this docs base after each feature or behavior change.
- Record rollback and residual risk for production-impacting changes.

## Verification Commands

This repository currently contains the `.github` Copilot package only. Verify with file inventory, Markdown/frontmatter inspection, package-scope scans, and local pre-push governance checks.

Run from the repository root:

```powershell
rg --files -uu .github
Get-ChildItem .github\skills -Directory | ForEach-Object { if (-not (Test-Path (Join-Path $_.FullName "SKILL.md"))) { throw "Missing SKILL.md: $($_.FullName)" } }
.github\scripts\pre-push-governance-check.ps1 -Mode Warn
$secretPattern = '(?i)(password|passwd|pwd|secret|token|api[_-]?key|client[_-]?secret)\s*[:=]\s*["''][^"''\s]{12,}["'']'
Get-ChildItem .github -Recurse -File | Select-String -Pattern $secretPattern
```

The secret-pattern command should return no matches.

Enable the local warning hook with:

```powershell
git config core.hooksPath .github/hooks
```

The hook warns developers before `git push` but does not block by default. To enforce locally, run `.github\scripts\pre-push-governance-check.ps1 -Mode Strict` or set `AI_GOVERNANCE_STRICT=1` before pushing. Target repositories can still add server-side CI later if hard enforcement is required.

## Operational Notes

- Copilot is an assistant, not the final approver.
- Human review remains mandatory for regulated banking code.
- MCP and terminal execution depend on local/enterprise policy.
- Azure DevOps, Slack, database schema, private knowledge, and Deep Research sources must be approved and registered before use.
