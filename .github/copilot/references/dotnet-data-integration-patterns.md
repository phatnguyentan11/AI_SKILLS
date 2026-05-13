# .NET Data And Integration Patterns

Purpose: preserve useful data, external API, and file-flow knowledge from the reference package in a sanitized, banking-safe form.

Use only after reading the target codebase. Follow existing implementation patterns unless they create security, privacy, data integrity, or compliance risk.

## Data Access

- Identify the source of truth before changing queries or models.
- Preserve the existing repository, Dapper, EF Core, stored procedure, transaction, and mapping style.
- Use parameterized SQL or ORM parameters.
- Keep read models, write models, DTOs, and persistence models distinct when the codebase does.
- Check nullability, default values, enum/status mapping, timezone handling, and decimal precision.
- For migrations, include rollback notes, compatibility impact, data backfill plan, and approval.
- Do not use production customer/account/card/PII data in examples, tests, prompts, logs, or docs.

## Transaction And Consistency Rules

- Use transactions when multiple writes must succeed or fail together.
- Confirm idempotency for retries, queue consumers, webhooks, file imports, and transaction-like flows.
- Check duplicate-submit behavior and race conditions.
- Prefer append/audit-safe changes for regulated data.
- Document data ownership and downstream consumers when contracts change.

## External API Gateway Rules

- Use existing gateway/integration service classes.
- Keep URLs, credentials, subscription keys, client IDs, scopes, and tokens in approved configuration/secret stores.
- Set explicit timeout and retry behavior according to the codebase.
- Normalize provider responses before returning to business services.
- Map downstream errors to internal result/error-code conventions.
- Sanitize logs: no tokens, account/card data, PII, or full raw payloads.
- Refresh tokens or re-authenticate only through existing approved helpers.

## File And Blob Flows

- Validate file count, size, extension, MIME type, and business ownership at the boundary.
- Store file metadata separately from binary content when the codebase does.
- Use deterministic path/naming conventions that avoid leaking customer or account identifiers.
- Stream downloads; avoid loading large files into memory unless the codebase already proves it is safe.
- For zip/export flows, check memory, timeout, authorization, and audit requirements.
- For imports, validate rows before write, report partial failures clearly, and avoid committing corrupt partial data.
- For forwarding files to external APIs, validate and log only metadata.

## Caching And Messaging

- Treat cache as derived data unless the codebase documents otherwise.
- Define cache key ownership, invalidation, TTL, and stale-read behavior.
- For queues/jobs, verify retry policy, poison-message behavior, idempotency, and audit trail.
- Do not put sensitive payloads into cache or messages unless encryption and retention are approved.

## Verification Checklist

- Query/migration reviewed for data loss risk.
- Contract changes checked against callers and downstream consumers.
- Auth/authz checked for all read/write paths.
- Logs checked for sensitive data exposure.
- Regression tests or manual verification steps recorded.
- Rollback or recovery path documented.

## Retrieval Keywords

.NET data access, Dapper, EF Core, SQL Server, PostgreSQL, transaction, migration rollback, external API gateway, blob storage, file upload, cache, queue, idempotency, data integrity.
