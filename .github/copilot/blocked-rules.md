# Blocked Rules

This file is the single source of truth for non-negotiable blocked rules.

When this package is applied to a real repository, update this file first. Other instructions, prompts, agents, skills, and scripts must treat the rules here as the highest-priority policy layer. If any other guidance conflicts with this file, this file wins.

## Operating Rules

- Do not duplicate blocked-rule configuration across other instruction files.
- Other files may reference this file, but must not maintain competing blocked lists.
- A blocked rule requires an explicit documented exception before generated code, review output, or local automation may allow it.
- Exceptions must include owner, reason, scope, expiry/review date, and rollback/removal plan.

## Blocked Dependencies And Platform Choices

- `Newtonsoft.Json` is blocked for .NET services. Use `System.Text.Json` unless an approved exception is documented in this file or in the target repository's approved architecture decision record.
- Parallel serializers are blocked. Do not introduce a second serializer strategy when one already exists.
- Parallel DI containers, service locator patterns, and ad hoc `new ServiceCollection` setup are blocked in application code.
- Parallel configuration loaders are blocked. Use the repository's centralized configuration/options pattern.
- Parallel logging wrappers, error-envelope formats, exception handlers, retry policies, validators, mapper utilities, repository abstractions, and HTTP client factories are blocked when an approved component already exists.
- Console/file logging in application code is blocked unless the repository explicitly approves it for a CLI/tooling project. Use the approved structured logging abstraction.

## Blocked Security And Privacy Behaviors

- Logging or returning card number/PAN, CVV, PIN, OTP, passwords, access tokens, refresh tokens, account identifiers, customer identifiers, raw request/response bodies, production data, secrets, or internal bank identifiers is blocked.
- Returning stack traces, exception internals, connection strings, SQL text, downstream raw payloads, tokens, or sensitive infrastructure details to clients is blocked.
- Using real production/customer/bank data in code, tests, prompts, screenshots, docs, logs, or commits is blocked.
- Weakening tests, faking integrations, hiding verification failures, or claiming completion without evidence is blocked.

## Blocked Architecture Behaviors

- Creating new helpers, wrappers, middleware, validators, mappers, common services, serializers, clients, retry policies, exception handlers, or DI/config patterns before searching for approved existing components is blocked.
- Creating speculative layers, base classes, generic frameworks, reflection-heavy abstractions, or future-proofing that is not required by the current task is blocked.
- Skipping established controller/service/repository/application/domain/infrastructure boundaries to make code shorter is blocked.
- Scattering dependency registration, middleware setup, serialization setup, options binding, or client policy setup outside the centralized composition pattern is blocked.

## Local Scan Rules

The pre-push governance script reads the tab-delimited block below. Format:

`ID<TAB>file globs<TAB>regex<TAB>message`

```blocked-scan
BR-DOTNET-001	*.csproj,*.props,*.targets	(?i)<PackageReference\s+Include=["']Newtonsoft\.Json["']	out-of-policy JSON package Newtonsoft.Json; prefer System.Text.Json unless an approved exception is documented
BR-DOTNET-002	*.cs	(?i)\busing\s+Newtonsoft\.Json\b	out-of-policy Newtonsoft.Json usage; prefer System.Text.Json unless an approved exception is documented
BR-LOG-001	*.cs	(?i)\bConsole\.(Write|WriteLine)\s*\(	console logging in application code; use the approved structured logging abstraction
BR-ERROR-001	*.cs	(?i)\b(StackTrace|ex\.ToString\(\)|exception\.ToString\(\))\b	possible stack trace/internal exception exposure; never return stack traces to clients
BR-LOG-002	*.cs	(?i)\b(CardNumber|PAN|CVV|PIN|OTP|Password|AccessToken|RefreshToken)\b.*\b(Log|Logger|WriteLine)\b	possible sensitive-data logging; sanitize or remove before push
BR-LOG-003	*.cs	(?i)\b(Log|Logger|WriteLine)\b.*\b(CardNumber|PAN|CVV|PIN|OTP|Password|AccessToken|RefreshToken)\b	possible sensitive-data logging; sanitize or remove before push
BR-DI-001	*.cs	(?i)new\s+ServiceCollection\s*\(	ad hoc service collection detected; use centralized DI/composition root
```
