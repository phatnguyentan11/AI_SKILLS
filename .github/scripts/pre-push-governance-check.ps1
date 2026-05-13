[CmdletBinding()]
param(
  [ValidateSet("Warn", "Strict")]
  [string]$Mode = "Warn"
)

$ErrorActionPreference = "Stop"
$failures = New-Object System.Collections.Generic.List[string]

function Write-Info {
  param([string]$Message)
  Write-Host "[governance] $Message"
}

function Add-Failure {
  param([string]$Message)
  $failures.Add($Message) | Out-Null
  Write-Warning "[governance] $Message"
}

function Invoke-Step {
  param(
    [string]$Name,
    [scriptblock]$Action
  )

  Write-Info "Running: $Name"
  try {
    & $Action
    Write-Info "OK: $Name"
  } catch {
    Add-Failure "$Name failed: $($_.Exception.Message)"
  }
}

function Invoke-External {
  param(
    [string]$Name,
    [string]$Command,
    [string[]]$Arguments
  )

  Write-Info "Running: $Name"
  & $Command @Arguments
  if ($LASTEXITCODE -ne 0) {
    Add-Failure "$Name exited with code $LASTEXITCODE"
  } else {
    Write-Info "OK: $Name"
  }
}

if ($env:AI_GOVERNANCE_STRICT -match "^(1|true|yes)$") {
  $Mode = "Strict"
}

$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) {
  Add-Failure "Cannot resolve git repository root."
} else {
  Set-Location $repoRoot
}

Write-Info "Local pre-push governance check started in $Mode mode."

$hasDotnet = [bool](
  Get-ChildItem -Recurse -File -Include *.sln,*.csproj -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch "[\\/](bin|obj)[\\/]" } |
    Select-Object -First 1
)
$hasCopilotPackage = Test-Path ".github/copilot-instructions.md"

if ($hasCopilotPackage) {
  Invoke-Step "Validate Copilot package required files" {
    $requiredFiles = @(
      ".github/copilot-instructions.md",
      ".github/copilot/workflow-playbook.md",
      ".github/copilot/banking-grade-engineering.md",
      ".github/copilot/codebase-analysis-playbook.md",
      ".github/copilot/azure-devops-mcp-playbook.md",
      ".github/copilot/internal-knowledge-playbook.md",
      ".github/copilot/deep-research-playbook.md",
      ".github/docs/project-docs-base.md",
      ".github/docs/project-changelog.md",
      ".github/docs/feature-delivery-log.md"
    )

    foreach ($file in $requiredFiles) {
      if (-not (Test-Path $file)) {
        throw "Missing required Copilot package file: $file"
      }
    }
  }

  Invoke-Step "Validate skill folders" {
    if (-not (Test-Path ".github/skills")) {
      throw "Missing .github/skills directory."
    }

    foreach ($skill in Get-ChildItem ".github/skills" -Directory) {
      $skillFile = Join-Path $skill.FullName "SKILL.md"
      if (-not (Test-Path $skillFile)) {
        throw "Missing SKILL.md in $($skill.FullName)"
      }
    }
  }

  Invoke-Step "Validate YAML frontmatter" {
    $frontmatterFiles = Get-ChildItem ".github" -Recurse -File -Include *.instructions.md,*.prompt.md,*.agent.md,SKILL.md
    foreach ($file in $frontmatterFiles) {
      $firstLine = Get-Content $file.FullName -TotalCount 1
      if ($firstLine -ne "---") {
        throw "Missing YAML frontmatter in $($file.FullName)"
      }
    }
  }
} else {
  Write-Info "No Copilot package detected. Skipping package validation."
}

Invoke-Step "Scan for likely secrets" {
  $patterns = @(
    "-----BEGIN (RSA|DSA|EC|OPENSSH|PRIVATE) KEY-----",
    "gh[pousr]_[A-Za-z0-9_]{30,}",
    "AKIA[0-9A-Z]{16}",
    "(?i)(password|passwd|pwd|secret|token|api[_-]?key|client[_-]?secret)\s*[:=]\s*[""'][^""'\s]{12,}[""']"
  )

  $files = Get-ChildItem -Recurse -File -Force |
    Where-Object {
      $_.FullName -notmatch "[\\/]\.git[\\/]" -and
      $_.FullName -notmatch "[\\/](bin|obj|node_modules|dist|coverage)[\\/]"
    }

  foreach ($pattern in $patterns) {
    $matches = $files | Select-String -Pattern $pattern -ErrorAction SilentlyContinue
    foreach ($match in $matches) {
      Add-Failure "$($match.Path):$($match.LineNumber): potential secret pattern"
    }
  }
}

if ($hasDotnet) {
  $dotnet = Get-Command dotnet -ErrorAction SilentlyContinue
  if (-not $dotnet) {
    Add-Failure ".NET project detected, but dotnet CLI is not available. Skipping restore/build/test/audit."
  } else {
    $solution = Get-ChildItem -Recurse -File -Filter *.sln | Sort-Object FullName | Select-Object -First 1
    $projects = @(Get-ChildItem -Recurse -File -Filter *.csproj | Where-Object { $_.FullName -notmatch "[\\/](bin|obj)[\\/]" } | Sort-Object FullName)

    if ($solution) {
      $target = $solution.FullName
    } elseif ($projects.Count -gt 0) {
      $target = $projects[0].FullName
    } else {
      $target = $null
    }

    if ($target) {
      Invoke-External "dotnet restore" "dotnet" @("restore", $target)
      Invoke-External "dotnet build" "dotnet" @("build", $target, "--configuration", "Release", "--no-restore")
      Invoke-External "dotnet format verify" "dotnet" @("format", $target, "--verify-no-changes", "--no-restore")

      $testProjects = @($projects | Where-Object { $_.FullName -match "(?i)(test|tests)" })
      if ($testProjects.Count -eq 0) {
        Write-Info "No .NET test projects detected."
      } else {
        foreach ($testProject in $testProjects) {
          Invoke-External "dotnet test $($testProject.Name)" "dotnet" @("test", $testProject.FullName, "--configuration", "Release", "--no-build")
        }
      }

      Invoke-External "dotnet dependency vulnerability audit" "dotnet" @("list", $target, "package", "--vulnerable", "--include-transitive")
    } else {
      Add-Failure ".NET files were detected, but no solution/project target was found."
    }
  }
} else {
  Write-Info "No .NET application code detected. .NET build/test/lint/audit checks are not applicable."
}

Write-Host ""
if ($failures.Count -eq 0) {
  Write-Host "[governance] Pre-push governance check passed."
  exit 0
}

Write-Warning "[governance] Pre-push governance check found $($failures.Count) warning(s):"
foreach ($failure in $failures) {
  Write-Warning " - $failure"
}

if ($Mode -eq "Strict") {
  Write-Error "[governance] Strict mode is enabled. Blocking push."
  exit 1
}

Write-Warning "[governance] Warning mode is enabled. Push is allowed, but review the warnings before pushing regulated code."
exit 0
