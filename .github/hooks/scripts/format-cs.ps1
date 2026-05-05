# format-cs.ps1
# Copilot postToolUse hook: run `dotnet format` on edited C# files.
# Reads JSON payload from stdin, extracts edited file path, formats if applicable.
# Self-skips when dotnet CLI is missing or file is not C#.

$ErrorActionPreference = 'SilentlyContinue'

try {
    $raw = [Console]::In.ReadToEnd()
    if ([string]::IsNullOrWhiteSpace($raw)) { exit 0 }
    $payload = $raw | ConvertFrom-Json
} catch {
    exit 0
}

$file = $payload.tool_input.file_path
if (-not $file) { $file = $payload.tool_input.path }
if (-not $file) { exit 0 }

if ($file -notmatch '\.cs$') { exit 0 }
if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) { exit 0 }
if (-not (Test-Path $file)) { exit 0 }

& dotnet format --include $file --no-restore 2>&1 | Out-Null
exit 0
