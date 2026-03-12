$projectRoot = "C:\Users\HP\Downloads\school managementwebsite"
Set-Location $projectRoot

$gitPath = "C:\Program Files\Git\cmd\git.exe"

Write-Host "Pushing Student ID Display Fix..." -ForegroundColor Cyan

& $gitPath add frontend/src/components/StudentTable.jsx

& $gitPath commit -m "Fix: Make Student ID column display more prominent with better styling and debugging"

& $gitPath push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Push successful! Vercel will redeploy automatically." -ForegroundColor Green
    Write-Host "Waiting for deployment..." -ForegroundColor Yellow
    Start-Sleep -Seconds 60
    Write-Host "Deployment should be complete. Hard refresh your browser (Ctrl+Shift+R)" -ForegroundColor Green
} else {
    Write-Host "Push failed." -ForegroundColor Red
}
