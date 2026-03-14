# Push UI Centering Fixes
$gitPath = "C:\Program Files\Git\bin\git.exe"

Write-Host "Pushing UI centering fixes..." -ForegroundColor Cyan

# Add all changes
& $gitPath add .

# Commit with descriptive message
& $gitPath commit -m "Fix UI centering - equal left/right margins for login/register pages"

# Push to GitHub
& $gitPath push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS! UI centering fixes pushed to GitHub!" -ForegroundColor Green
    Write-Host "Frontend will auto-deploy on Vercel" -ForegroundColor Yellow
} else {
    Write-Host "Push failed - please check authentication" -ForegroundColor Red
}