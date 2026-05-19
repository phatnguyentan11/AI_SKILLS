---
name: aspnet-core-governance
description: Use for ASP.NET Core, C#, controller-service-repository, Dapper/EF Core, middleware, dependency injection, API contracts, and .NET backend work.
---

# ASP.NET Core Governance

## When To Use

Use when the repository is a .NET or ASP.NET Core service.

For deeper reference material, use `.github/copilot/references/aspnet-core-service-patterns.md` after reading the actual codebase.

## Rules

- Read architecture and code standards docs first if present.
- Keep controller, service, repository, model, middleware, and configuration responsibilities separate.
- Use interfaces and existing DI registration pattern.
- Use `async/await`; never `.Result` or `.Wait()`.
- Use structured logging and never log secrets or PII.
- Use parameterized SQL and existing repository patterns.
- Keep auth attributes and authorization checks aligned with existing endpoints.
- Preserve response envelope and error-code conventions.
- Add tests using the existing framework and naming style.
