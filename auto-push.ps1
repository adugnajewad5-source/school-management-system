# Auto Push to GitHub Script
# This script will attempt to push using Windows Credential Manager

$gitPath = "C:\Program Files\Git\bin\git.exe"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Auto Push to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configure credential helper
Write-Host "Step 1: Configuring credential manager..." -ForegroundColor Yellow
& $gitPath config --global credential.helper manager-core
Write-Host "✓ Credential manager configured" -ForegroundColor Green
Write-Host ""

# Check current status
Write-Host "Step 2: Checking repository status..." -ForegroundColor Yellow
& $gitPath status
Write-Host ""

# Try to push
Write-Host "Step 3: Attempting to push to GitHub..." -ForegroundColor Yellow
Write-Host "Note: A login window may appear - please sign in with your GitHub account" -ForegroundColor Cyan
Write-Host ""

$pushResult = & $gitPath push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! Project pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository: https://github.com/adugnajewad5-source/school-management-system" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Visit your repository on GitHub" -ForegroundColor White
    Write-Host "2. Deploy backend on Render: https://render.com" -ForegroundColor White
    Write-Host "3. Deploy frontend on Vercel: https://vercel.com" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Push requires authentication" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error details:" -ForegroundColor Yellow
    Write-Host $pushResult -ForegroundColor Red
    Write-Host ""
    Write-Host "Solutions:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: Use GitHub Desktop (Easiest)" -ForegroundColor Cyan
    Write-Host "  1. Download: https://desktop.github.com" -ForegroundColor White
    Write-Host "  2. Sign in with your GitHub account" -ForegroundColor White
    Write-Host "  3. Add this repository" -ForegroundColor White
    Write-Host "  4. Click 'Publish repository'" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2: Use Personal Access Token" -ForegroundColor Cyan
    Write-Host "  1. Go to: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "  2. Generate new token (classic)" -ForegroundColor White
    Write-Host "  3. Select 'repo' scope" -ForegroundColor White
    Write-Host "  4. Copy the token" -ForegroundColor White
    Write-Host "  5. Run: git push -u origin main" -ForegroundColor White
    Write-Host "  6. Use token as password" -ForegroundColor White
    Write-Host ""
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
