<#
.SYNOPSIS
    Format staged (pre-commit) or pushed (pre-push) files and warn if reformatted.

.DESCRIPTION
    PreCommit mode: formats staged files using available tools, re-stages changed files, warns.
    PrePush mode  : checks format of pushed files on a temp copy, warns if issues found (no auto-fix).

.PARAMETER Mode
    PreCommit (default) | PrePush

.EXAMPLE
    pwsh -File .github\scripts\format-staged-files.ps1 -Mode PreCommit
    pwsh -File .github\scripts\format-staged-files.ps1 -Mode PrePush
#>

[CmdletBinding()]
param(
    [ValidateSet("PreCommit", "PrePush")]
    [string]$Mode = "PreCommit"
)

$ErrorActionPreference = "Stop"
$reformattedFiles = [System.Collections.Generic.List[string]]::new()
$warningFiles     = [System.Collections.Generic.List[string]]::new()

function Write-Info  { param([string]$m) Write-Host "[format] $m" }
function Write-Warn  { param([string]$m) Write-Warning "[format] $m" }

# ── Detect available formatters ──────────────────────────────────────────────
$prettierCmd = $null
if (Get-Command prettier -ErrorAction SilentlyContinue) {
    $prettierCmd = "prettier"
} elseif (Get-Command npx -ErrorAction SilentlyContinue) {
    $prettierCmd = "npx_prettier"   # flag: use npx
}

$hasPSAnalyzer = $false
if (Get-Module -ListAvailable PSScriptAnalyzer -ErrorAction SilentlyContinue) {
    Import-Module PSScriptAnalyzer -ErrorAction SilentlyContinue
    $hasPSAnalyzer = $true
}

$dotnetCmd = Get-Command dotnet -ErrorAction SilentlyContinue

Write-Info "Mode: $Mode"
Write-Info "Prettier  : $(if ($prettierCmd) { 'available' } else { 'not found - skipping .md/.yml/.json' })"
Write-Info "PSAnalyzer: $(if ($hasPSAnalyzer) { 'available' } else { 'not found - skipping .ps1' })"
Write-Info "dotnet    : $(if ($dotnetCmd) { 'available' } else { 'not found - skipping .cs' })"

# ── Helpers ──────────────────────────────────────────────────────────────────
function Invoke-PrettierOn {
    param([string]$FilePath)
    if ($prettierCmd -eq "prettier") {
        prettier --write $FilePath 2>$null
    } elseif ($prettierCmd -eq "npx_prettier") {
        npx --yes prettier --write $FilePath 2>$null
    }
}

function Invoke-PrettierCheckOn {
    param([string]$FilePath)
    if ($prettierCmd -eq "prettier") {
        prettier --check $FilePath 2>$null
        return $LASTEXITCODE
    } elseif ($prettierCmd -eq "npx_prettier") {
        npx --yes prettier --check $FilePath 2>$null
        return $LASTEXITCODE
    }
    return 0
}

$prettierExts = @(".md", ".json", ".yml", ".yaml", ".html", ".css", ".js", ".ts")

function Get-FormatterType {
    param([string]$Ext)
    if ($Ext -in $prettierExts -and $prettierCmd)  { return "prettier" }
    if ($Ext -eq ".ps1" -and $hasPSAnalyzer)        { return "psanalyzer" }
    if ($Ext -eq ".cs"  -and $dotnetCmd)             { return "dotnet" }
    return $null
}

# ── PRE-COMMIT mode ──────────────────────────────────────────────────────────
if ($Mode -eq "PreCommit") {
    $repoRoot = git rev-parse --show-toplevel 2>$null
    if ($repoRoot) { Set-Location $repoRoot }

    $stagedFiles = @(
        git diff --cached --name-only --diff-filter=ACMR 2>$null |
        Where-Object { $_ -and (Test-Path $_) }
    )

    if ($stagedFiles.Count -eq 0) {
        Write-Info "No staged files to format."
        exit 0
    }

    Write-Info "Formatting $($stagedFiles.Count) staged file(s)..."

    foreach ($file in $stagedFiles) {
        $ext = [IO.Path]::GetExtension($file).ToLower()
        $formatterType = Get-FormatterType $ext

        if (-not $formatterType) { continue }

        $hashBefore = (Get-FileHash $file -Algorithm SHA256).Hash

        try {
            switch ($formatterType) {
                "prettier"   { Invoke-PrettierOn $file }
                "psanalyzer" {
                    $raw = Get-Content $file -Raw -Encoding UTF8
                    $formatted = Invoke-Formatter -ScriptDefinition $raw -ErrorAction SilentlyContinue
                    if ($formatted -and $formatted -ne $raw) {
                        Set-Content $file -Value $formatted -Encoding UTF8 -NoNewline
                    }
                }
                "dotnet"     { <# handled per-project below #> }
            }
        } catch {
            Write-Warn "Formatter error on $file : $($_.Exception.Message)"
            continue
        }

        $hashAfter = (Get-FileHash $file -Algorithm SHA256).Hash
        if ($hashBefore -ne $hashAfter) {
            $reformattedFiles.Add($file)
            git add $file
            Write-Warn "Reformatted + re-staged: $file"
        }
    }

    # dotnet format — project-level, only when .cs files are staged
    $csFiles = $stagedFiles | Where-Object { $_.EndsWith(".cs") }
    if ($csFiles -and $dotnetCmd) {
        $solution = Get-ChildItem -Recurse -File -Filter *.sln -ErrorAction SilentlyContinue |
            Where-Object { $_.FullName -notmatch "[\\/](bin|obj)[\\/]" } |
            Select-Object -First 1
        $target = if ($solution) { $solution.FullName } else { $null }

        if ($target) {
            Write-Info "Running dotnet format on solution..."
            dotnet format $target --no-restore 2>$null
            if ($LASTEXITCODE -eq 0) {
                foreach ($cs in $csFiles) {
                    git add $cs 2>$null
                }
                Write-Warn "dotnet format ran on staged .cs files. Check for re-staged changes."
            }
        }
    }

    Write-Host ""
    if ($reformattedFiles.Count -gt 0) {
        Write-Warn "$($reformattedFiles.Count) file(s) were auto-formatted and re-staged:"
        $reformattedFiles | ForEach-Object { Write-Warn "  - $_" }
    } else {
        Write-Info "All staged files already properly formatted."
    }

    # ── Secret / sensitive data scan on staged files ─────────────────────────
    Write-Info "Scanning staged files for secrets and sensitive data..."

    $secretPatterns = @(
        @{ Name = "Private Key";        Pattern = "-----BEGIN [A-Z ]*(RSA|DSA|EC|OPENSSH|PRIVATE)[A-Z ]* KEY-----" },
        @{ Name = "GitHub Token";       Pattern = "gh[pousr]_[A-Za-z0-9_]{30,}" },
        @{ Name = "AWS Access Key";     Pattern = "AKIA[0-9A-Z]{16}" },
        @{ Name = "Credential in code"; Pattern = '(?i)(password|passwd|pwd|secret|token|api[_-]?key|client[_-]?secret)\s*[:=]\s*[\"''][^\"''\s]{12,}[\"'']' },
        @{ Name = "Connection string";  Pattern = '(?i)(Server|Data Source|Initial Catalog).{0,80}(Password|PWD)\s*=\s*[^;\"'']{6,}' },
        @{ Name = "JWT (raw)";          Pattern = "eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}" },
        @{ Name = "Private IP/internal URL"; Pattern = '(?i)(https?://(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|localhost|127\.0\.0\.1))' }
    )

    $secretFindings = [System.Collections.Generic.List[string]]::new()

    foreach ($file in $stagedFiles) {
        # Only scan text-like files; skip binaries by extension
        $ext = [IO.Path]::GetExtension($file).ToLower()
        $skipExts = @(".png",".jpg",".jpeg",".gif",".pdf",".zip",".exe",".dll",".bin",".ico",".woff",".woff2",".ttf",".eot")
        if ($ext -in $skipExts) { continue }

        try {
            $content = Get-Content $file -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
            if (-not $content) { continue }

            foreach ($p in $secretPatterns) {
                if ($content -match $p.Pattern) {
                    $lineMatches = Select-String -Path $file -Pattern $p.Pattern -AllMatches -ErrorAction SilentlyContinue
                    foreach ($lm in $lineMatches) {
                        $secretFindings.Add("[$($p.Name)] $file : line $($lm.LineNumber)")
                    }
                }
            }
        } catch {
            # non-text file or read error — skip silently
        }
    }

    Write-Host ""
    if ($secretFindings.Count -gt 0) {
        Write-Host ""
        Write-Host "  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" -ForegroundColor Red
        Write-Host "  !! [SECURITY WARNING] Potential secrets detected in staged files !!" -ForegroundColor Red
        Write-Host "  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" -ForegroundColor Red
        Write-Host ""
        $secretFindings | ForEach-Object { Write-Host "  [SECRET] $_" -ForegroundColor Yellow }
        Write-Host ""
        Write-Host "  >> Review the findings above. Remove secrets before committing." -ForegroundColor Red
        Write-Host "  >> If false positive, commit will proceed (warn-only mode)." -ForegroundColor Red
        Write-Host "  >> To BLOCK commits with secrets: set AI_GOVERNANCE_STRICT=1" -ForegroundColor Red
        Write-Host ""

        # Default: BLOCK commit when secrets found.
        # To allow commit despite findings, set AI_GOVERNANCE_ALLOW_SECRETS=1 (not recommended).
        $allow = $env:AI_GOVERNANCE_ALLOW_SECRETS
        if ($allow -notmatch "^(1|true|yes)$") {
            Write-Host "[format] Commit BLOCKED. Remove secrets before committing." -ForegroundColor Red
            Write-Host "[format] To override (not recommended): set AI_GOVERNANCE_ALLOW_SECRETS=1" -ForegroundColor Red
            exit 1
        }
        Write-Host "[format] WARNING: AI_GOVERNANCE_ALLOW_SECRETS is set. Proceeding despite findings." -ForegroundColor Yellow
    } else {
        Write-Info "No secrets or sensitive data detected in staged files."
    }

    exit 0
}

# ── PRE-PUSH mode ─────────────────────────────────────────────────────────────
if ($Mode -eq "PrePush") {
    $repoRoot = git rev-parse --show-toplevel 2>$null
    if ($repoRoot) { Set-Location $repoRoot }

    # Files ahead of upstream; fall back to last commit if no upstream set
    $pushedFiles = @()
    $upstreamCheck = git rev-parse "@{u}" 2>$null
    if ($LASTEXITCODE -eq 0) {
        $pushedFiles = @(git diff --name-only "@{u}" HEAD 2>$null)
    }
    if (-not $pushedFiles -or $pushedFiles.Count -eq 0) {
        $pushedFiles = @(git diff --name-only HEAD~1 HEAD 2>$null)
    }
    $pushedFiles = $pushedFiles | Where-Object { $_ -and (Test-Path $_) }

    if ($pushedFiles.Count -eq 0) {
        Write-Info "No changed files to check in push."
        exit 0
    }

    Write-Info "Checking format of $($pushedFiles.Count) file(s) in push..."

    foreach ($file in $pushedFiles) {
        $ext = [IO.Path]::GetExtension($file).ToLower()
        $formatterType = Get-FormatterType $ext
        if (-not $formatterType -or $formatterType -eq "dotnet") { continue }

        $tempFile = [IO.Path]::GetTempFileName() + $ext
        Copy-Item $file $tempFile -Force

        try {
            $originalHash = (Get-FileHash $tempFile -Algorithm SHA256).Hash

            switch ($formatterType) {
                "prettier"   { Invoke-PrettierOn $tempFile }
                "psanalyzer" {
                    $raw = Get-Content $tempFile -Raw -Encoding UTF8
                    $formatted = Invoke-Formatter -ScriptDefinition $raw -ErrorAction SilentlyContinue
                    if ($formatted -and $formatted -ne $raw) {
                        Set-Content $tempFile -Value $formatted -Encoding UTF8 -NoNewline
                    }
                }
            }

            $newHash = (Get-FileHash $tempFile -Algorithm SHA256).Hash
            if ($originalHash -ne $newHash) {
                $warningFiles.Add($file)
                Write-Warn "Format issue: $file"
            }
        } catch {
            Write-Warn "Formatter error on $file : $($_.Exception.Message)"
        } finally {
            Remove-Item $tempFile -ErrorAction SilentlyContinue
        }
    }

    Write-Host ""
    if ($warningFiles.Count -gt 0) {
        Write-Warn "$($warningFiles.Count) file(s) in this push have formatting issues:"
        $warningFiles | ForEach-Object { Write-Warn "  - $_" }
        Write-Warn "Tip: run formatter locally, commit, then push again."
    } else {
        Write-Info "All pushed files are properly formatted."
    }

    exit 0
}
