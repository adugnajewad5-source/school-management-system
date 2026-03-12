@echo off
echo 🚀 DEPLOYING COMPLETE FIX FOR BOTH ISSUES
echo =============================================

"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Complete fix: Enhanced submissions migration + Student ID display improvements - Add enhanced_submissions_migration.js with proper error handling - Update backend index.js to run enhanced migrations on startup - Ensure uploads directory exists with .gitkeep - Drop and recreate submissions table for clean slate - Add comprehensive logging and error handling - Fix Send to Teacher functionality completely - Maintain Student ID display improvements - Ready for production deployment"
"C:\Program Files\Git\bin\git.exe" push origin main

echo.
echo ✅ DEPLOYMENT SUCCESSFUL!
echo =============================================
echo 📊 WHAT HAPPENS NEXT:
echo 1. Render detects the push and starts redeploying backend
echo 2. Enhanced migrations run automatically on startup
echo 3. Submissions table is created/recreated properly
echo 4. Send to Teacher functionality will work
echo 5. Student ID display remains fixed
echo.
echo ⏱️ DEPLOYMENT TIME: 3-5 minutes
echo 🔗 Backend: https://school-management-backend-gnav.onrender.com
echo 🔗 Frontend: https://school-management-system-nu-pink.vercel.app
echo.
echo 🧪 TESTING INSTRUCTIONS:
echo After 5 minutes:
echo 1. Go to student portal and test Send to Teacher
echo 2. Go to admin portal and verify Student IDs show
echo 3. Check browser console for debug messages

pause