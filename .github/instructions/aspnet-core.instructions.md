---
name: "ASP.NET Core Codebase Patterns"
description: "C#/.NET/ASP.NET Core guidance for projects using controller-service-repository architecture."
applyTo: "**/*.cs,**/*.csproj,**/*.sln,**/*.razor,**/*.cshtml"
---

# ASP.NET Core Codebase Patterns

Use these rules only when the target repository is a .NET or ASP.NET Core codebase.

For deeper sanitized patterns, use `.github/copilot/references/aspnet-core-service-patterns.md` and `.github/copilot/references/dotnet-data-integration-patterns.md` after reading the target codebase.

## Analysis First

- Read project docs first if present: `codebase-summary`, `system-architecture`, `code-standards`, `code-patterns`, controller docs, database docs, middleware docs.
- Identify the real architecture before coding: controller, service, repository, model, configuration, middleware, external integrations.
- Explain the existing flow before proposing a change.

## Architecture Rules

- Keep controllers thin. Controllers handle route, auth attributes, model binding, boundary validation, and response mapping.
- Put business logic in services.
- Put SQL/data access in repositories.
- Use interfaces for DI.
- Register services according to the existing startup/DI pattern.
- Do not skip layers to make implementation shorter.

## C# Rules

- Use `async/await`; async methods end with `Async`.
- Never block with `.Result` or `.Wait()`.
- Prefer readonly injected fields.
- Use structured logging templates; never string interpolation for logs.
- Do not log secrets, tokens, PII, account data, or full sensitive payloads.
- Use constants/resources/enums/config abstractions instead of magic values.

## Data Rules

- Use parameterized SQL or existing ORM/repository patterns.
- Preserve existing stored procedure/function conventions when present.
- Protect migrations with rollback notes and approval.
- Verify data contracts before changing DTO/result models.

## Testing Rules

- Follow existing test framework and naming.
- Add regression tests for bug fixes.
- Cover success, validation failure, authorization failure, downstream failure, and edge cases.
