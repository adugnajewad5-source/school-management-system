@echo off
echo ========================================
echo DEPLOYING STUDENT ID DISPLAY FIX
echo ========================================

echo Adding files to git...
git add .

echo Committing changes...
git commit -m "URGENT FIX: Student ID display with white text on blue background and enhanced debugging"

echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Wait 2-3 minutes for Vercel to redeploy
echo Then refresh your browser and check Student Records
echo.
echo Expected Result:
echo - Student IDs will show as WHITE TEXT on BLUE background
echo - Should see: STU-357, STU-285, STU-311, etc.
echo.
pause