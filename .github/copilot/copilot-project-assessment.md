# Copilot Package Assessment

Reviewed on 2026-05-13.

## Overall Assessment

This `.github/` package is now structured as a standalone, banking-grade GitHub Copilot base.

Score after this revision: 9.2/10 for a portable instruction package.

## Strengths

- Uses official Copilot resource families: instructions, prompts, agents, and skills.
- Keeps all required package files under `.github/`.
- Promotes only curated Markdown-only skills.
- Adds strong system-analysis and codebase-fit guidance for reading, explaining, checking logic, debugging, and preserving business flow.
- Adds ASP.NET Core and dotnet testing governance with a local pre-push warning hook.
- Adds local pre-push governance checks for package validation, secret pattern scanning, and conditional .NET restore/build/format/test/dependency audit.
- Adds banking-grade gates for planning, verification, line review, docs updates, rollback, and sensitive-data handling.
- Removes payment-specific and web-frontend-specific guidance because they are outside the current project scope.
- Adds Azure DevOps MCP, internal knowledge, and deep research governance without storing connector secrets or enabling write operations by default.
- Avoids shell scripts, generated assets, credentials, and tool-specific automation in skills; the local warning hook is isolated under `.github/hooks` and `.github/scripts`.

## Remaining Risks

- No target application stack is known yet.
- ASP.NET/.NET guidance is included but should be treated as conditional path guidance, not universal architecture.
- Runtime CI is not enabled for this package repository; governance checks are local warning checks before `git push`.
- No CODEOWNERS or branch protection can be enforced from this package alone.
- Secret scanning and dependency checks are provided as local warning checks; target repositories still need CI enforcement if they require server-side gates.
- Human accountable review remains mandatory for regulated banking code.
- External connectors such as Azure DevOps, Slack, database schema readers, NotebookLM-style sources, and Deep Research require enterprise approval before use.

## Required Target-Repo Hardening

- Add CODEOWNERS.
- Enable branch protection and server-side CI later if the target repository needs enforced gates beyond local warnings.
- Add protected branch rules and mandatory human review.
- Add stack-specific path instructions once the real codebase is known.
- Add project-specific business glossary, role matrix, API contracts, and system architecture docs in the target repository.
- Add data-classification and logging standards specific to the bank.
- Add project-specific MCP connector registry and knowledge source register after enterprise owners approve the tools.

## Retrieval Keywords

Copilot assessment, banking-grade Copilot, standalone `.github`, regulated engineering, code review, docs base, plan before dev, enterprise governance.
