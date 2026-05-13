# Project Changelog

## 2026-05-13

- Added manual-only `.github/workflows/manual-governance-checks.yml` for build, test, lint, secret pattern scanning, CodeQL SAST, and .NET dependency audit.
- Removed out-of-scope payment-specific and web-frontend-specific Copilot assets and catalog references.
- Replaced generic npm verification examples with repository-accurate `.github` package verification commands.
- Added system-analysis focus based on trusted reference package:
  - codebase reading before planning
  - code explanation prompts
  - business logic and logic-check prompts
  - codebase-fit solution rules
  - ASP.NET Core and dotnet testing governance
  - system analyst custom agent
- Added plan approval gate before implementation.
- Promoted reference/old-project-first comparison into the critical banking gates and delivery workflow.
- Added sanitized `.github/copilot/references/` knowledge so old skill references are represented without copying unsafe scripts or project-specific local material.
- Converted the Copilot base into a standalone `.github/` package.
- Moved explanatory knowledge into `.github/copilot/`.
- Moved docs base into `.github/docs/`.
- Removed package references to external local folders.
- Replaced migration-only skill with curated Copilot skills.
- Added banking-grade engineering gates:
  - plan before dev
  - line-by-line review
  - security/privacy/data controls
  - rollback notes
  - verification evidence
  - docs base update after every feature
