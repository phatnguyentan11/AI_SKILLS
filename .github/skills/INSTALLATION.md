# Skills — Dependencies & Setup

Most skills in this folder are pure Markdown and need no install. The two exceptions ship Node.js scripts.

## Prerequisites

- **Node.js ≥ 18** (Windows: `winget install OpenJS.NodeJS.LTS` or download from https://nodejs.org/)
- PowerShell 5.1+ (default on Windows 10/11) or any POSIX shell.

## Per-skill install (PowerShell, from repo root)

### docs-seeker

Zero runtime dependencies — uses Node built-ins only. Tests need no `npm install`.

```powershell
# Smoke-test scripts
node AI/.github/skills/docs-seeker/scripts/detect-topic.js "Documentation for Astro"
```

### sequential-thinking

Only `jest` for tests; runtime scripts have zero deps.

```powershell
Push-Location AI/.github/skills/sequential-thinking
npm install      # installs jest
npm test
Pop-Location
```

## Environment variables

Loader priority (high → low):

1. `process.env`
2. `AI/.github/skills/<skill-name>/.env`
3. `AI/.github/skills/.env`
4. `AI/.github/.env`

See [`.env.example`](./.env.example) for available keys.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `node : command not found` | Install Node 18+ and reopen terminal. |
| Script can't find `.env` | Confirm file lives under `AI/.github/skills/` (not `.claude/`). |
| `npm install` fails behind proxy | Set `npm config set proxy http://...` then retry. |
