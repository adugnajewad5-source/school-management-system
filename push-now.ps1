Write-Host "========================================" -ForegroundColor Green
Write-Host "PUSHING CHANGES TO GITHUB" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Adding all files..." -ForegroundColor Yellow
git add .

Write-Host "Step 2: Committing changes..." -ForegroundColor Yellow
git commit -m "Fix SSL/TLS for PlanetScale and API URLs for frontend"

Write-Host "Step 3: Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "PUSH COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to Render Dashboard" -ForegroundColor White
Write-Host "2. Click your backend service" -ForegroundColor White
Write-Host "3. Click 'Redeploy'" -ForegroundColor White
Write-Host "4. Wait 2-3 minutes for deployment" -ForegroundColor White
Write-Host "5. Go to Vercel Dashboard" -ForegroundColor White
Write-Host "6. Click your frontend project" -ForegroundColor White
Write-Host "7. Click 'Redeploy'" -ForegroundColor White
Write-Host "8. Test login at: https://school-management-system.vercel.app" -ForegroundColor White
Write-Host ""
