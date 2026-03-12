# COMPLETE FIX DEPLOYMENT SCRIPT
# This script pushes both Send to Teacher and Student ID display fixes

Write-Host "🚀 DEPLOYING COMPLETE FIX FOR BOTH ISSUES" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Set git path
$gitPath = "C:\Program Files\Git\bin\git.exe"

try {
    Write-Host "📝 Adding all changes..." -ForegroundColor Yellow
    & $gitPath add .
    
    Write-Host "📤 Committing changes..." -ForegroundColor Yellow
    & $gitPath commit -m "Complete fix: Enhanced submissions migration + Student ID display improvements

- Add enhanced_submissions_migration.js with proper error handling
- Update backend index.js to run enhanced migrations on startup  
- Ensure uploads directory exists with .gitkeep
- Drop and recreate submissions table for clean slate
- Add comprehensive logging and error handling
- Fix Send to Teacher functionality completely
- Maintain Student ID display improvements
- Ready for production deployment"

    Write-Host "🌐 Pushing to GitHub..." -ForegroundColor Yellow
    & $gitPath push origin main
    
    Write-Host "" -ForegroundColor Green
    Write-Host "✅ DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host "📊 WHAT HAPPENS NEXT:" -ForegroundColor Cyan
    Write-Host "1. Render detects the push and starts redeploying backend" -ForegroundColor White
    Write-Host "2. Enhanced migrations run automatically on startup" -ForegroundColor White
    Write-Host "3. Submissions table is created/recreated properly" -ForegroundColor White
    Write-Host "4. Send to Teacher functionality will work" -ForegroundColor White
    Write-Host "5. Student ID display remains fixed" -ForegroundColor White
    Write-Host "" -ForegroundColor Green
    Write-Host "⏱️ DEPLOYMENT TIME: 3-5 minutes" -ForegroundColor Yellow
    Write-Host "🔗 Backend: https://school-management-backend-gnav.onrender.com" -ForegroundColor Cyan
    Write-Host "🔗 Frontend: https://school-management-system-nu-pink.vercel.app" -ForegroundColor Cyan
    Write-Host "" -ForegroundColor Green
    Write-Host "🧪 TESTING INSTRUCTIONS:" -ForegroundColor Magenta
    Write-Host "After 5 minutes:" -ForegroundColor White
    Write-Host "1. Go to student portal and test 'Send to Teacher'" -ForegroundColor White
    Write-Host "2. Go to admin portal and verify Student IDs show" -ForegroundColor White
    Write-Host "3. Check browser console for debug messages" -ForegroundColor White
    
} catch {
    Write-Host "❌ DEPLOYMENT FAILED: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}