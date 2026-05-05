---
name: dotnet-best-practices
description: Ensure .NET/C# code meets best practices for the solution/project. Use when reviewing C# code quality, design patterns, dependency injection, error handling, performance, or SOLID principles.
allowed-tools: [read, search]
---

# .NET/C# Best Practices

Ensure .NET/C# code meets best practices specific to this solution/project.

## Documentation & Structure

- Create comprehensive XML documentation comments for all public classes, interfaces, methods, and properties
- Include parameter descriptions and return value descriptions in XML comments
- Follow the established namespace structure: `{Project}.{Layer}.{Feature}`

## Design Patterns & Architecture

- Use primary constructor syntax for dependency injection where clear
- Implement interface segregation with clear naming conventions (prefix interfaces with `I`)
- Follow the Factory pattern for complex object creation
- Use `sealed` classes when no inheritance is intended
- Prefer `record` types for immutable DTOs

## Dependency Injection & Services

- Use constructor dependency injection
- Register services with appropriate lifetimes (Singleton, Scoped, Transient)
- Use `Microsoft.Extensions.DependencyInjection` patterns
- Implement service interfaces for testability
- Never inject Scoped into Singleton (captive dependency)

## Async/Await Patterns

- Use `async/await` for all I/O operations and long-running tasks
- Return `Task` or `Task<T>` from async methods
- Use `CancellationToken` on all async methods
- Handle async exceptions properly
- Never use `.Result` or `.Wait()` — always `await`

## Error Handling & Logging

- Use structured logging with `Microsoft.Extensions.Logging`
- Include scoped logging with meaningful context
- Throw specific exceptions with descriptive messages
- Use `Result<T>` pattern for business logic — not exceptions

## Performance & Security

- Use C# 12+ features and .NET 8+ optimizations where applicable
- Implement proper input validation and sanitization
- Use parameterized queries for database operations
- Follow OWASP Top 10 secure coding practices

## Code Quality

- Ensure SOLID principles compliance
- Avoid code duplication through base classes and utilities
- Use meaningful names that reflect domain concepts
- Keep methods focused and cohesive (< 30 lines preferred)
- Keep files under 200 lines — split if exceeded

When reviewing .NET/C# code, identify issues and suggest improvements that follow these best practices.
