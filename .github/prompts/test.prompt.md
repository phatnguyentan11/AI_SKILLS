---
name: test
agent: agent
description: Run tests, analyze results, and report coverage for the current changes
argument-hint: Specify test scope or module to test (e.g. 'auth module', 'all unit tests')
---

## Workflow

Use the `@tester` agent to run the test suite and provide a comprehensive quality report:

1. Run type checking and compile to detect syntax errors first.
2. Execute all relevant test suites (unit, integration, e2e where applicable).
3. Analyze test results — identify all failures with detailed error messages.
4. Generate and review code coverage reports.
5. Validate the build process completes successfully.
6. Report findings clearly with severity levels.

**IMPORTANT**: **NEVER** use fake data, mocks, cheats, or temporary solutions just to pass the build.
**IMPORTANT**: Fix all failing tests before marking the session complete.
