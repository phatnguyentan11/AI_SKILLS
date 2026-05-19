# ASP.NET Core Service Patterns

Purpose: give Copilot enough backend architecture context without copying project-specific source details.

Use only when the target repository is an ASP.NET Core or .NET service. The real codebase always wins over generic examples unless it creates security, privacy, data integrity, or compliance risk.

## Analysis Order

1. Read target repo docs: codebase summary, architecture, standards, API docs, database docs, runbooks.
2. Locate entry points: controllers, minimal API routes, consumers, hosted services, jobs, or UI/API callers.
3. Trace flow through service, repository, integration, cache, queue, and response mapping.
4. Identify business rules, roles, validations, statuses, thresholds, and state transitions.
5. Create a plan before editing.

## Layer Responsibilities

| Layer | Owns | Must not own |
| --- | --- | --- |
| Controller/API boundary | Route, auth attributes, model binding, boundary validation, response mapping | Business rules, SQL, external HTTP calls |
| Service/application | Business logic, orchestration, state transitions, idempotency, integration decisions | Routing, raw SQL, transport-specific response shaping |
| Repository/data | Queries, persistence, transaction boundary support, data mapping | Business authorization, user-facing error policy |
| Gateway/integration service | External API calls, auth headers/tokens, timeout handling, response normalization | Controller response formatting, direct secret exposure |
| Middleware/filter | Cross-cutting validation, exception handling, correlation, request context | Feature-specific business logic |
| Configuration abstraction | Typed config, environment/secret lookup, cache of config values | Hardcoded URLs, credentials, tenant/account data |

## Request Lifecycle

```text
Request
-> middleware/filter
-> controller boundary validation and auth context
-> service business logic
-> repository/cache/integration/queue as needed
-> service result
-> controller response envelope
-> response
```

## Controller Rules

- Keep controllers thin and predictable.
- Validate shape and boundary constraints before calling services.
- Extract authenticated user/context using the existing project convention.
- Map service results to the existing response envelope.
- Do not introduce new response formats unless the approved plan requires it.
- Do not log full request bodies when they may contain PII, account data, tokens, or internal identifiers.

## Service Rules

- Put business logic in services.
- Keep role checks, workflow state checks, and domain invariants explicit.
- Call repositories through interfaces and existing dependency injection.
- Call external systems through gateway/integration services, not inline HTTP clients.
- Preserve idempotency and duplicate-submit behavior for regulated financial state, workflow, file, notification, and queue flows.
- Prefer small methods with clear branch names over hidden generic helpers.

## Repository Rules

- Use existing Dapper, EF Core, stored procedure, or repository conventions.
- Use parameterized SQL and typed models.
- Keep query naming and result mapping aligned with the codebase.
- Do not mix business authorization decisions into repositories.
- Use transactions where partial writes can corrupt state.
- Treat data repair, destructive migrations, and schema changes as approval-gated.

## Dependency Injection And Configuration

- Register services in the existing startup/module pattern.
- Respect lifetimes: scoped for request-bound services/repositories, singleton only for stateless or safe shared services.
- Avoid captive dependencies.
- Prefer typed configuration abstractions used by the codebase.
- Never hardcode secrets, URLs, subscription keys, account identifiers, or credentials.

## Error, Response, And Logging

- Preserve existing `Result`, response envelope, error code, resource, and localization patterns.
- User-facing errors should be stable and sanitized.
- Logs should include correlation and operational context, not sensitive payloads.
- Downstream errors should be mapped deliberately; do not leak raw provider messages to users.

## Test Expectations

- Add or update tests in the existing framework.
- Cover success, validation failure, authorization failure, downstream failure, idempotency, and edge cases.
- For bug fixes, add regression coverage that fails before the fix where practical.

## Retrieval Keywords

ASP.NET Core, C#, controller service repository, thin controller, business service, Dapper, EF Core, dependency injection, middleware, response envelope, Result pattern, banking backend.
