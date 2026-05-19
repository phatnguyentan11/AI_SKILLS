---
name: backend-api-governance
description: Use for backend services, APIs, auth flows, validation, service integration, errors, observability, performance, and data contracts.
---

# Backend API Governance

## When To Use

Use when changing backend code, API routes, service boundaries, authentication, authorization, external integrations, or server-side data handling.

## Rules

- Validate and normalize all inputs at trust boundaries.
- Enforce auth/authz close to protected resources.
- Use explicit error handling without leaking sensitive details.
- Avoid logging credentials, tokens, PII, internal bank identifiers, or full sensitive payloads.
- Preserve backward compatibility unless explicitly approved.
- Add tests for success, failure, authorization, and edge cases.
- Document API, config, and operational changes.

