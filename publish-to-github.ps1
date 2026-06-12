param(
  [string]$RepoName = "premium-frontend-portfolio",
  [switch]$Private
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

function Require-Command($Name, $InstallHint) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    Write-Host ""
    Write-Host "$Name is not installed or not available in PATH." -ForegroundColor Yellow
    Write-Host $InstallHint
    exit 1
  }
}

Require-Command "git" "Install Git: winget install --id Git.Git -e"
Require-Command "gh" "Install GitHub CLI: winget install --id GitHub.cli -e"

try {
  gh auth status | Out-Null
} catch {
  Write-Host ""
  Write-Host "GitHub CLI is not authenticated." -ForegroundColor Yellow
  Write-Host "Run: gh auth login"
  exit 1
}

if (-not (Test-Path ".git")) {
  git init
  git branch -M main
}

git add .

$hasCommit = $true
try {
  git rev-parse --verify HEAD | Out-Null
} catch {
  $hasCommit = $false
}

$hasChanges = -not [string]::IsNullOrWhiteSpace((git status --porcelain))
if ($hasChanges) {
  git commit -m "Add premium portfolio"
} elseif (-not $hasCommit) {
  git commit --allow-empty -m "Initialize premium portfolio"
} else {
  Write-Host "No local changes to commit."
}

$visibility = if ($Private) { "--private" } else { "--public" }
if (-not (git remote get-url origin 2>$null)) {
  gh repo create $RepoName $visibility --source=. --remote=origin --push
} else {
  git push -u origin main
}

Write-Host ""
Write-Host "Published to GitHub." -ForegroundColor Green
