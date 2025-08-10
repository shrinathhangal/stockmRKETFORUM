param (
    [string]$RepoURL = ""
)

if (-not $RepoURL) {
    Write-Host "Usage: .\push_to_github.ps1 -RepoURL <your_github_repo_url>"
    exit
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Git is not installed or not in PATH."
    exit
}

Write-Host "Initializing Git repository..."
git init
git branch -M main
git add .
git commit -m "Initial commit - stock forum scaffold"
git remote add origin $RepoURL
git push -u origin main

Write-Host "Upload complete! Check your GitHub repo."
