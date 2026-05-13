# Codebase Analysis Playbook

Purpose: make Copilot strong at system analysis, code explanation, business-logic review, debugging, and codebase-fit solutions.

## Mandatory Analysis Order

1. If an old/reference project, folder, diff, or snippet is provided, read it before the current patch work.
2. Compare reference behavior with the current package/codebase and keep only trusted, Copilot-safe guidance.
3. Read project docs if present: architecture, codebase summary, code standards, code patterns, API docs, database docs, runbooks.
4. Locate relevant source files with `#codebase`, file search, symbol search, and references.
5. Map the current flow before proposing changes.
6. Identify business rules, roles, data contracts, state transitions, and external integrations.
7. Identify blast radius: code, tests, configs, docs, database, queues, jobs, APIs, UI, logs.
8. Only then create a plan or propose a solution.

## Reference Comparison Output

Use this format when a trusted old/reference project is provided:

```text
Reference read:
Current package/codebase match:
Trusted rules to keep:
Rules to reject or rewrite:
Short change plan:
Approval needed:
```

## What To Extract From Existing Code

- Entry points: controller/action, route, handler, job, consumer, UI event, command.
- Layer path: presentation -> service/application -> repository/data -> external systems.
- Data contracts: request DTO, response DTO, result model, persistence model, integration payload.
- Business logic: role rules, validations, thresholds, statuses, transitions, idempotency keys.
- Error behavior: exception handling, result envelope, error codes, retry behavior, logging.
- Side effects: writes, messages, emails, cache, external calls, files, notifications.
- Tests: unit, integration, e2e, regression, existing test style.

## Code Explanation Output

Use this format when explaining code:

```text
Entry point:
Flow:
Business rules:
Data read/write:
External dependencies:
Error handling:
Security/privacy:
Tests/docs:
Risks/unknowns:
```

## Codebase-Fit Solution Rules

- Reuse existing layers, naming, response types, error patterns, config abstractions, logging style, and test style.
- Do not invent a parallel architecture.
- Do not bypass service/repository boundaries.
- Do not add helpers, abstractions, parameters, or new modules unless current code already needs them.
- Prefer minimal change in existing files over replacement files.
- When codebase conventions conflict with generic best practice, follow the codebase unless it creates security/data risk.

## Debugging Rules

- Reproduce or collect evidence first.
- Trace backward from symptom to owner layer.
- Compare expected business rule to actual branch/condition/data.
- Inspect null/empty states, retry/idempotency, concurrency, stale cache, config, permissions, and downstream failures.
- Add or update regression coverage after root cause is found.

## Retrieval Keywords

system analysis, codebase understanding, explain code, business logic, blast radius, code flow, request lifecycle, debugging, codebase-fit solution.
