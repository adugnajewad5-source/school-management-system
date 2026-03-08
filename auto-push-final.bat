@echo off
setlocal enabledelayedexpansion

echo ========================================
echo AUTO PUSH TO GITHUB
echo ========================================
echo.

REM Add all changes
echo Adding files...
git add .

REM Commit
echo Committing changes...
git commit -m "Fix API URLs - frontend now connects to Render backend"

REM Push
echo Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! PUSHED TO GITHUB!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Go to Vercel Dashboard
    echo 2. Click your project
    echo 3. Click "Redeploy"
    echo 4. Wait 2-3 minutes
    echo 5. Test login at: https://school-management-system.vercel.app
    echo.
) else (
    echo.
    echo ERROR: Push failed
    echo.
)

pause
