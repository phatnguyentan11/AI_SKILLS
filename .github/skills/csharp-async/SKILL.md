---
name: csharp-async
description: Get best practices for C# async programming. Use when writing async methods, handling Tasks, parallelism, cancellation tokens, or diagnosing deadlocks and async anti-patterns.
allowed-tools: [read, search]
---

# C# Async Programming Best Practices

Help follow best practices for asynchronous programming in C#.

## Naming Conventions

- Use the `Async` suffix for all async methods
- Match method names with their synchronous counterparts when applicable (`GetDataAsync()` for `GetData()`)

## Return Types

- Return `Task<T>` when the method returns a value
- Return `Task` when the method doesn't return a value
- Consider `ValueTask<T>` for high-performance scenarios to reduce allocations
- Avoid returning `void` for async methods except for event handlers

## Exception Handling

- Use try/catch blocks around await expressions
- Avoid swallowing exceptions in async methods
- Use `ConfigureAwait(false)` in library code to prevent deadlocks
- Propagate exceptions with `Task.FromException()` instead of throwing in async Task returning methods

## Performance

- Use `Task.WhenAll()` for parallel execution of multiple tasks
- Use `Task.WhenAny()` for implementing timeouts or taking the first completed task
- Avoid unnecessary async/await when simply passing through task results
- Use `CancellationToken` for long-running operations

## Common Pitfalls

- **Never** use `.Wait()`, `.Result`, or `.GetAwaiter().GetResult()` in async code
- Avoid mixing blocking and async code
- Don't create `async void` methods (except for event handlers)
- Always await Task-returning methods

## Implementation Patterns

- Implement the async command pattern for long-running operations
- Use async streams (`IAsyncEnumerable<T>`) for processing sequences asynchronously
- Consider the task-based asynchronous pattern (TAP) for public APIs

When reviewing C# code, identify async issues and suggest improvements following these best practices.
