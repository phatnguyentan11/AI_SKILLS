---
name: csharp-xunit
description: Get best practices for xUnit unit testing, including data-driven tests. Use when writing or reviewing xUnit test classes, Theory/Fact attributes, assertions, mocking, or test organization.
allowed-tools: [read, search]
---

# xUnit Best Practices

Help write effective unit tests with xUnit, covering standard and data-driven testing approaches.

## Project Setup

- Use a separate test project with naming convention `[ProjectName].Tests`
- Reference `Microsoft.NET.Test.Sdk`, `xunit`, and `xunit.runner.visualstudio` packages
- Create test classes that match the classes being tested (`CalculatorTests` for `Calculator`)
- Use `dotnet test` for running tests

## Test Structure

- No test class attributes required (unlike MSTest/NUnit)
- Use `[Fact]` attribute for simple tests
- Follow the Arrange-Act-Assert (AAA) pattern
- Name tests using: `MethodName_Scenario_ExpectedBehavior`
- Use constructor for setup and `IDisposable.Dispose()` for teardown
- Use `IClassFixture<T>` for shared context between tests in a class
- Use `ICollectionFixture<T>` for shared context between multiple test classes

## Standard Tests

- Keep tests focused on a single behavior
- Avoid testing multiple behaviors in one test method
- Use clear assertions that express intent
- Make tests independent and idempotent (can run in any order)
- Avoid test interdependencies

## Data-Driven Tests

- Use `[Theory]` combined with data source attributes
- Use `[InlineData]` for inline test data
- Use `[MemberData]` for method-based test data
- Use `[ClassData]` for class-based test data
- Use meaningful parameter names in data-driven tests

## Assertions

- Use `Assert.Equal` for value equality
- Use `Assert.Same` for reference equality
- Use `Assert.True`/`Assert.False` for boolean conditions
- Use `Assert.Contains`/`Assert.DoesNotContain` for collections
- Use `Assert.Throws<T>` or `await Assert.ThrowsAsync<T>` to test exceptions
- Consider FluentAssertions library for more readable assertions

## Mocking and Isolation

- Use NSubstitute or Moq alongside xUnit
- Mock dependencies to isolate units under test
- Use interfaces to facilitate mocking
- Consider a DI container for complex test setups

## Test Organization

- Group tests by feature or component
- Use `[Trait("Category", "CategoryName")]` for categorization
- Use collection fixtures to group tests with shared dependencies
- Use `ITestOutputHelper` for test diagnostics
- Skip tests conditionally with `Skip = "reason"` in fact/theory attributes
