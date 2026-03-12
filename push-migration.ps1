$GIT = "C:\Program Files\Git\bin\git.exe"

Write-Host "Pushing database migration changes..." -ForegroundColor Green
& $GIT push origin main

Write-Host ""
Write-Host "✓ Changes pushed to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Go to Render dashboard: https://dashboard.render.com"
Write-Host "2. Click on your backend service"
Write-Host "3. Click 'Redeploy' button"
Write-Host "4. Wait 2-3 minutes for deployment"
Write-Host "5. Check logs for 'Database migrations completed successfully'"
Write-Host "6. Try logging in:"
Write-Host "   URL: https://school-management-system-4hx2jvfn2.vercel.app"
Write-Host "   Username: admin"
Write-Host "   Password: Admin@123"
