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
- Use existing service-registration extension methods, options bindings, middleware registration, filters, validators, result envelopes, clients, and common helpers before creating new ones.
- Do not introduce platform choices or duplicate patterns blocked by `.github/copilot/blocked-rules.md`.
- Do not skip layers to make implementation shorter.

## Dependency And Configuration Policy

- Prefer packages already present in the solution or listed in repository standards.
- Follow `.github/copilot/blocked-rules.md` for blocked packages, serializers, DI/config patterns, logging choices, and cross-cutting components.
- Bind configuration centrally with the repository's established pattern, preferably options classes and validation where already used.
- Register dependencies in the existing composition root or module installer. Do not use service locator patterns, manual container construction, or scattered one-off setup.
- Reuse existing middleware/filter/error-envelope conventions before adding a new cross-cutting component.

## C# Rules

- Use `async/await`; async methods end with `Async`.
- Never block with `.Result` or `.Wait()`.
- Prefer readonly injected fields.
- Use structured logging templates; never string interpolation for logs.
- Do not log secrets, tokens, PII, account data, or full sensitive payloads.
- Use constants/resources/enums/config abstractions instead of magic values.
- Prefer modern .NET 8/C# style when it improves clarity and matches the codebase: file-scoped namespaces, global usings, primary constructors, pattern matching, collection expressions, `required` members, `DateOnly`/`TimeOnly`, and minimal allocations.
- Use `Span<T>`, `ReadOnlySpan<T>`, `Memory<T>`, pooling, or allocation-focused code only on proven hot paths or measured performance-sensitive code. Do not replace simple readable loops for style points.
- Keep Clean Architecture minimal: controller/API boundary, application/service logic, domain rules, infrastructure/data access. Add layers only when the existing project already has them or the requirement needs them now.

## Error Handling And Logging Policy

- Use the existing exception middleware/filter/problem-details/error-envelope pattern.
- Never return client-facing error details blocked by `.github/copilot/blocked-rules.md`.
- Log exception context with structured templates and sanitized identifiers only.
- Treat data listed in `.github/copilot/blocked-rules.md` as sensitive by default.
- Prefer stable error codes and safe user-facing messages over ad hoc exception text.

## Data Rules

- Use parameterized SQL or existing ORM/repository patterns.
- Preserve existing stored procedure/function conventions when present.
- Protect migrations with rollback notes and approval.
- Verify data contracts before changing DTO/result models.

## Testing Rules

- Follow existing test framework and naming.
- Add regression tests for bug fixes.
- Cover success, validation failure, authorization failure, downstream failure, and edge cases.
