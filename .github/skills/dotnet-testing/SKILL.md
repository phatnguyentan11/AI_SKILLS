---
name: dotnet-testing
description: Use for .NET test planning, xUnit/NUnit/MSTest style, regression coverage, integration tests, and verification commands.
---

# Dotnet Testing

## When To Use

Use for .NET or ASP.NET Core test design and verification.

## Rules

- Discover existing test framework before writing tests.
- Prefer Arrange/Act/Assert.
- Name tests by behavior and expected result.
- Cover business success, validation failure, auth failure, downstream failure, and edge cases.
- Add regression tests for bugs.
- Use mocks only for legitimate external boundaries.
- Run `dotnet build` and relevant `dotnet test` commands or provide exact manual commands.

