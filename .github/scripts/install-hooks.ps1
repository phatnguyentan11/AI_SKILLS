<#
.SYNOPSIS
    Install git hooks for this repository by setting core.hooksPath.

.DESCRIPTION
    Configures git to use .github/hooks/ as the hooks directory.
    Run this once after cloning the repository.

.PARAMETER Strict
    If set, also configures AI_GOVERNANCE_STRICT=1 in the local git environment
    so that the pre-push hook will block pushes on governance failures.

.EXAMPLE
    .\.github\scripts\install-hooks.ps1
    .\.github\scripts\install-hooks.ps1 -Strict
#>

[CmdletBinding()]
param(
    [switch]$Strict
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host "[hooks-install] $Message"
}

function Write-OK {
    param([string]$Message)
    Write-Host "[hooks-install] OK: $Message" -ForegroundColor Green
}

function Write-Fail {
    param([string]$Message)
    Write-Host "[hooks-install] FAIL: $Message" -ForegroundColor Red
}

# Resolve repo root
$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) {
    Write-Fail "Not inside a git repository."
    exit 1
}
Set-Location $repoRoot

$hooksDir = Join-Path $repoRoot ".github\hooks"
if (-not (Test-Path $hooksDir)) {
    Write-Fail "Hooks directory not found: $hooksDir"
    exit 1
}

# Set core.hooksPath
Write-Step "Setting core.hooksPath to .github/hooks ..."
git config core.hooksPath ".github/hooks"
if ($LASTEXITCODE -ne 0) {
    Write-Fail "Failed to set core.hooksPath."
    exit 1
}
Write-OK "core.hooksPath = .github/hooks"

# Verify pre-push hook exists
$prePushHook = Join-Path $hooksDir "pre-push"
if (Test-Path $prePushHook) {
    Write-OK "pre-push hook found: $prePushHook"
} else {
    Write-Host "[hooks-install] WARNING: pre-push hook not found at $prePushHook" -ForegroundColor Yellow
}

# Optionally enable strict mode
if ($Strict) {
    Write-Step "Setting ai-governance.strict = 1 in local git config ..."
    # Use a proper git config key; env.* namespace does NOT set shell environment variables
    git config --local "ai-governance.strict" "1"
    Write-OK "Strict mode enabled. Pre-push hook will BLOCK push on governance failures."
} else {
    Write-Host "[hooks-install] Strict mode NOT enabled (default: warn only). Use -Strict to block pushes on failures." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "[hooks-install] Git hooks installed successfully." -ForegroundColor Green
Write-Host "[hooks-install] The pre-push governance check will run on every 'git push'."
Write-Host "[hooks-install] To test manually: pwsh -File .github\scripts\pre-push-governance-check.ps1"
