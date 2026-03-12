$projectRoot = "C:\Users\HP\Downloads\school managementwebsite"
Set-Location $projectRoot

$gitPath = "C:\Program Files\Git\cmd\git.exe"

Write-Host "Adding all changes..." -ForegroundColor Cyan
& $gitPath add -A

Write-Host "Committing changes..." -ForegroundColor Cyan
& $gitPath commit -m "Fix: Student ID display in admin portal - ensure student_id is returned from API"

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
& $gitPath push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Push successful! Vercel and Render will redeploy automatically." -ForegroundColor Green
    Write-Host "Deployment status:" -ForegroundColor Yellow
    Write-Host "   - Vercel: https://vercel.com/dashboard"
    Write-Host "   - Render: https://dashboard.render.com"
    Write-Host "Expected deployment time: 5-10 minutes" -ForegroundColor Yellow
    Write-Host "After deployment, hard refresh your browser (Ctrl+Shift+R) to clear cache" -ForegroundColor Yellow
} else {
    Write-Host "Push failed. Check the error above." -ForegroundColor Red
}
