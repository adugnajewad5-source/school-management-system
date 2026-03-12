@echo off
REM Final push to GitHub - Register Page Fix
REM This script will push changes and trigger Vercel redeploy

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║         REGISTER PAGE FIX - FINAL PUSH TO GITHUB              ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check if git is available
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git found
echo.

REM Add all changes
echo 📝 Adding changes...
git add -A
if %errorlevel% neq 0 (
    echo ❌ Failed to add changes
    pause
    exit /b 1
)
echo ✅ Changes added
echo.

REM Commit changes
echo 📝 Committing changes...
git commit -m "Fix: Trigger Vercel redeploy for register page - use npm ci for cleaner install"
if %errorlevel% neq 0 (
    echo ⚠️  Commit failed (might be no changes to commit)
) else (
    echo ✅ Changes committed
)
echo.

REM Push to GitHub
echo 📤 Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Failed to push to GitHub
    echo Please check your GitHub credentials
    pause
    exit /b 1
)
echo ✅ Successfully pushed to GitHub!
echo.

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    PUSH SUCCESSFUL! ✅                        ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo ⏳ Vercel is now redeploy the frontend...
echo 📍 Check status at: https://vercel.com/dashboard
echo 🌐 Frontend URL: https://school-management-system-nu-pink.vercel.app
echo.
echo ⏱️  Deployment usually takes 2-5 minutes
echo.
echo Press any key to continue...
pause

REM Open Vercel dashboard in browser
start https://vercel.com/dashboard

endlocal
