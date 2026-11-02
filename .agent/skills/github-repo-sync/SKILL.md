---
name: github-repo-sync
description: Automates creating, documenting, committing, and pushing the MDIAS monorepo to GitHub using git and the GitHub CLI (gh). Performs pre-commit secret scanning to ensure .env.local and API keys are never pushed. Use whenever the user asks to push to GitHub, update the GitHub repo, sync changes, or create a release.
---

# GitHub Repository Sync & Release Skill (`github-repo-sync`)

## Overview
This skill manages version control and GitHub synchronization for the **Maharashtra Drought Intelligence & Early Warning System (MDIAS)** repository (`D:\gemini_scratch\mdias`).

## Pre-Flight Security Checklist (MANDATORY)
Before staging or pushing any commit to GitHub:
1. **Verify `.gitignore`**: Ensure `.env`, `.env.local`, `apps/web/.env.local`, `node_modules/`, and `.next/` are listed in the root `.gitignore`.
2. **Verify Staged Files**: Run `git status --short` and confirm no secret files (`*env.local*`, `*secret*`, `*.pem`) are staged.

## Workflow 1: Initialize Local Git Repo & Create Remote GitHub Repository
If the remote GitHub repository does not exist yet:
1. Initialize and commit locally (inside sandbox):
   ```powershell
   Set-Location D:\gemini_scratch\mdias
   git init -b main
   git add .
   git commit -m "feat: initial release of Maharashtra Drought Intelligence & EO Command (MDIAS)"
   ```
2. Check GitHub CLI auth and create the remote repository (requires `BypassSandbox: true` for network access to `api.github.com`):
   ```powershell
   Set-Location D:\gemini_scratch\mdias
   gh repo create mdias-maharashtra-drought-eo --public --source=. --remote=origin --push --description "Government of Maharashtra State Drought Monitoring, Riverbed Hydrology & Earth Observation Command System (MDIAS)"
   ```
   *(If `gh auth status` reports an expired token, run `gh auth login -h github.com -p https -w` with `BypassSandbox: true` so the user can approve via browser).*

## Workflow 2: Push Incremental Updates to GitHub
Whenever code or documentation changes are made:
1. Run the helper script `.agent\skills\github-repo-sync\scripts\sync-github.ps1 -Message "feat: <summary of changes>"` or execute:
   - **Step A (Sandboxed)**:
     ```powershell
     Set-Location D:\gemini_scratch\mdias
     git add .
     git commit -m "<conventional commit message>"
     ```
   - **Step B (Network Push — `BypassSandbox: true`)**:
     ```powershell
     Set-Location D:\gemini_scratch\mdias
     git push -u origin main
     ```
