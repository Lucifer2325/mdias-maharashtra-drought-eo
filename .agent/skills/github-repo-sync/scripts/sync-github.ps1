param(
    [Parameter(Mandatory = $false)]
    [string]$Message = "chore: sync MDIAS portal updates to GitHub"
)

$ErrorActionPreference = "Stop"
Set-Location "D:\gemini_scratch\mdias"

# 1. Security check: ensure .env.local is never tracked
$trackedSecrets = git ls-files "*env.local*"
if ($trackedSecrets) {
    Write-Error "SECURITY BLOCK: .env.local is tracked by git! Run 'git rm --cached apps/web/.env.local' first."
    exit 1
}

# 2. Stage all changes
git add .

# 3. Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    git commit -m $Message
    Write-Host "Committed changes: $Message" -ForegroundColor Green
} else {
    Write-Host "Working tree clean — no new local commit needed." -ForegroundColor Yellow
}

# 4. Push to origin main
$remotes = git remote
if ($remotes -contains "origin") {
    git push -u origin main
    Write-Host "Successfully pushed to origin/main!" -ForegroundColor Cyan
} else {
    Write-Host "No 'origin' remote configured yet. Run: gh repo create mdias-maharashtra-drought-eo --public --source=. --remote=origin --push" -ForegroundColor Yellow
}
