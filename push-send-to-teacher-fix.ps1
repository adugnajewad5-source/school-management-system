$projectRoot = "C:\Users\HP\Downloads\school managementwebsite"
Set-Location $projectRoot

$gitPath = "C:\Program Files\Git\cmd\git.exe"

Write-Host "Pushing Send to Teacher Fix..." -ForegroundColor Cyan

& $gitPath add database/schema.sql
& $gitPath add backend/run_submissions_migration.js
& $gitPath add backend/routes/submissionRoutes.js
& $gitPath add database/migrations/create_submissions_table.sql

& $gitPath commit -m "Fix: Add submissions table and improve Send to Teacher functionality with debugging"

& $gitPath push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Push successful! Render will redeploy automatically." -ForegroundColor Green
    Write-Host "Waiting for deployment..." -ForegroundColor Yellow
    Start-Sleep -Seconds 60
    Write-Host "Deployment should be complete. Test the Send to Teacher button now!" -ForegroundColor Green
} else {
    Write-Host "Push failed." -ForegroundColor Red
}