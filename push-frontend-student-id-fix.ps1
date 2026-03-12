$projectRoot = "C:\Users\HP\Downloads\school managementwebsite"
Set-Location $projectRoot

$gitPath = "C:\Program Files\Git\cmd\git.exe"

Write-Host "Adding frontend changes..." -ForegroundColor Cyan
& $gitPath add frontend/src/components/StudentTable.jsx

Write-Host "Committing changes..." -ForegroundColor Cyan
& $gitPath commit -m "Fix: Add debugging and fallback for student_id display in StudentTable"

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
& $gitPath push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Push successful! Vercel will redeploy automatically." -ForegroundColor Green
    Write-Host "Waiting for Vercel deployment..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    Write-Host "Deployment should be complete. Hard refresh your browser (Ctrl+Shift+R)" -ForegroundColor Green
} else {
    Write-Host "Push failed." -ForegroundColor Red
}
