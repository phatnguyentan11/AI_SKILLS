<#
.SYNOPSIS
    Post-clone setup for this repository. Run once after cloning.

.DESCRIPTION
    Performs all one-time local setup steps needed after cloning:
      1. Installs git hooks by setting core.hooksPath to .github/hooks/.
      2. Validates that required Copilot package files are present.
      3. Optionally enables strict governance mode (blocks pushes on failures).

.PARAMETER Strict
    Enable AI_GOVERNANCE_STRICT=1 in local git config so the pre-push hook
    blocks pushes on governance failures instead of just warning.

.EXAMPLE
    .\.github\scripts\setup.ps1
    .\.github\scripts\setup.ps1 -Strict

.NOTES
    Run from any directory inside the cloned repository.
    Requires Git to be on the PATH.
#>

[CmdletBinding()]
param(
    [switch]$Strict
)

$ErrorActionPreference = "Stop"

function Write-Step { param([string]$M) Write-Host "[setup] $M" }
function Write-OK   { param([string]$M) Write-Host "[setup] OK  : $M" -ForegroundColor Green }
function Write-Warn { param([string]$M) Write-Host "[setup] WARN: $M" -ForegroundColor Yellow }
function Write-Fail { param([string]$M) Write-Host "[setup] FAIL: $M" -ForegroundColor Red }

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AI Copilot Package — Post-Clone Setup " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ── Resolve repo root ────────────────────────────────────────────────────────
$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) {
    Write-Fail "Not inside a git repository. Run this script from inside the cloned repo."
    exit 1
}
Set-Location $repoRoot
Write-Step "Repo root: $repoRoot"

# ── Install git hooks ────────────────────────────────────────────────────────
Write-Step "Installing git hooks ..."

$hooksDir = Join-Path $repoRoot ".github\hooks"
if (-not (Test-Path $hooksDir)) {
    Write-Fail "Hooks directory not found: $hooksDir"
    exit 1
}

git config core.hooksPath ".github/hooks"
if ($LASTEXITCODE -ne 0) {
    Write-Fail "Failed to set core.hooksPath."
    exit 1
}
Write-OK "core.hooksPath = .github/hooks"

foreach ($hook in @("pre-commit", "pre-push")) {
    $hookPath = Join-Path $hooksDir $hook
    if (Test-Path $hookPath) {
        Write-OK "$hook hook found."
    } else {
        Write-Warn "$hook hook not found at $hookPath"
    }
}

# ── Strict mode (optional) ───────────────────────────────────────────────────
if ($Strict) {
    # Use a proper git config key (not env.* which does not set shell env vars)
    git config --local "ai-governance.strict" "1"
    Write-OK "Strict mode enabled — pre-push hook will BLOCK on governance failures."
    Write-Step "  (stored as git config key: ai-governance.strict = 1)"
} else {
    Write-Step "Strict mode NOT enabled (default: warn only). Use -Strict to block pushes on failures."
}

# ── Validate Copilot package structure ───────────────────────────────────────
Write-Step "Validating Copilot package required files ..."

$required = @(
    ".github/copilot-instructions.md",
    ".github/copilot/blocked-rules.md",
    ".github/copilot/workflow-playbook.md",
    ".github/copilot/banking-grade-engineering.md",
    ".github/copilot/codebase-analysis-playbook.md",
    ".github/copilot/azure-devops-mcp-playbook.md",
    ".github/copilot/deep-research-playbook.md",
    ".github/instructions/banking-grade-engineering.instructions.md",
    ".github/docs/project-docs-base.md",
    ".github/docs/project-changelog.md"
)

$missing = $required | Where-Object { -not (Test-Path (Join-Path $repoRoot $_)) }
if ($missing.Count -gt 0) {
    $missing | ForEach-Object { Write-Warn "Missing required file: $_" }
    Write-Warn "$($missing.Count) required file(s) missing. Package may be incomplete."
} else {
    Write-OK "All required Copilot package files present ($($required.Count) checked)."
}

# ── Skills inventory check ───────────────────────────────────────────────────
$skillsDir = Join-Path $repoRoot ".github\skills"
if (Test-Path $skillsDir) {
    $skillCount = (Get-ChildItem -Path $skillsDir -Directory).Count
    Write-OK "$skillCount skill folder(s) found under .github/skills/"
} else {
    Write-Warn ".github/skills/ not found."
}

# ── Agents inventory check ───────────────────────────────────────────────────
$agentsDir = Join-Path $repoRoot ".github\agents"
if (Test-Path $agentsDir) {
    $agentCount = (Get-ChildItem -Path $agentsDir -File -Filter "*.agent.md").Count
    Write-OK "$agentCount agent file(s) found under .github/agents/"
} else {
    Write-Warn ".github/agents/ not found."
}

# ── Summary ──────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Cyan
Write-Host " Setup complete. Next steps:" -ForegroundColor Cyan
Write-Host "   1. Open VS Code in this repository." -ForegroundColor Cyan
Write-Host "   2. Start Copilot Chat with @workspace." -ForegroundColor Cyan
Write-Host "   3. Try /scout to map the codebase." -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan
Write-Host "   Docs:    .github/docs/ai-project-developer-guide.md" -ForegroundColor Cyan
Write-Host "   Prompts: .github/prompts/" -ForegroundColor Cyan
Write-Host "   Agents:  .github/agents/" -ForegroundColor Cyan
Write-Host "   Skills:  .github/skills/" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan
Write-Host ""
