# secret-scan.ps1
# Copilot preToolUse hook: deny edit/write tool calls that introduce hardcoded secrets.
# Reads JSON payload from stdin. Exit 2 = deny tool call. Exit 0 = allow.
# Bypass: include the comment marker `copilot-allow-secret` on the same line.

$ErrorActionPreference = 'SilentlyContinue'

try {
    $raw = [Console]::In.ReadToEnd()
    if ([string]::IsNullOrWhiteSpace($raw)) { exit 0 }
    $payload = $raw | ConvertFrom-Json
} catch {
    exit 0
}

$tool = "$($payload.tool_name)".ToLowerInvariant()
$writeTools = @('edit', 'write', 'multi_edit', 'multiedit', 'create_file', 'replace_string_in_file')
if ($writeTools -notcontains $tool) { exit 0 }

# Collect candidate content fields (cover varying tool schemas).
$inp = $payload.tool_input
$candidates = @($inp.content, $inp.new_string, $inp.newString, $inp.file_text, $inp.text) `
    | Where-Object { $_ -and $_ -is [string] }

if ($candidates.Count -eq 0) { exit 0 }

$pattern = '(?i)(api[_-]?key|secret|password|access[_-]?token|bearer)\s*[:=]\s*["''][^"'']{8,}'

foreach ($content in $candidates) {
    foreach ($line in ($content -split "`n")) {
        if ($line -match 'copilot-allow-secret') { continue }
        if ($line -match $pattern) {
            [Console]::Error.WriteLine("secret-scan: blocked potential secret in line: $($line.Trim())")
            exit 2
        }
    }
}

exit 0
