<#
.SYNOPSIS
    Pre-push .NET build check. Blocks push if dotnet build fails on .NET changes.

.DESCRIPTION
    Detects .NET-related files (.cs, .csproj, .sln) in the current push.
    If any are found, runs dotnet build. Blocks the push on failure.
#>

$ErrorActionPreference = "Stop"

function Write-Info  { param([string]$m) Write-Host "[dotnet-check] $m" }
function Write-Block { param([string]$m) Write-Host "[dotnet-check] $m" -ForegroundColor Red }

$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) {
    Write-Info "Cannot resolve git root. Skipping."
    exit 0
}
Set-Location $repoRoot

# ── Determine changed files in this push ─────────────────────────────────────
$pushedFiles = @()
$null = git rev-parse "@{u}" 2>$null
if ($LASTEXITCODE -eq 0) {
    $pushedFiles = @(git diff --name-only "@{u}" HEAD 2>$null)
}
if ($pushedFiles.Count -eq 0) {
    $pushedFiles = @(git diff --name-only HEAD~1 HEAD 2>$null)
}

# ── Check for .NET changes ────────────────────────────────────────────────────
$dotnetExts = @(".cs", ".csproj", ".sln", ".props", ".targets")
$hasDotnetChange = $pushedFiles | Where-Object {
    $ext = [IO.Path]::GetExtension($_).ToLower()
    $ext -in $dotnetExts
}

if (-not $hasDotnetChange) {
    Write-Info "No .NET changes detected. Skipping build check."
    exit 0
}

Write-Info "Detected .NET changes in push. Running build check..."
$hasDotnet = Get-Command dotnet -ErrorAction SilentlyContinue
if (-not $hasDotnet) {
    Write-Info ".NET changes detected but dotnet CLI not found. Skipping."
    exit 0
}

# ── Find build target ─────────────────────────────────────────────────────────
$solution = Get-ChildItem -Recurse -File -Filter *.sln -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch "[\\/](bin|obj)[\\/]" } |
    Select-Object -First 1

$target = if ($solution) {
    $solution.FullName
} else {
    $proj = Get-ChildItem -Recurse -File -Filter *.csproj -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch "[\\/](bin|obj)[\\/]" } |
        Select-Object -First 1
    if ($proj) { $proj.FullName } else { $null }
}

if (-not $target) {
    Write-Info "No solution or project file found. Skipping build check."
    exit 0
}

Write-Info "Building: $target"
dotnet build $target --configuration Release --no-restore 2>&1 | Write-Host

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Block "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    Write-Block "!! PUSH BLOCKED: dotnet build failed              !!"
    Write-Block "!! Fix build errors before pushing.               !!"
    Write-Block "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    Write-Host ""
    exit 1
}

Write-Info "dotnet build passed."
exit 0
