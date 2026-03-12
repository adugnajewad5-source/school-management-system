@echo off
REM Silent Git Push - Register Page Fix
REM This script pushes changes to GitHub without interactive prompts

setlocal enabledelayedexpansion

REM Set environment variables to suppress prompts
set GIT_TERMINAL_PROMPT=0
set GIT_AUTHOR_NAME=Auto Deploy
set GIT_AUTHOR_EMAIL=auto@deploy.local
set GIT_COMMITTER_NAME=Auto Deploy
set GIT_COMMITTER_EMAIL=auto@deploy.local

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║         REGISTER PAGE FIX - SILENT GIT PUSH                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Step 1: Add changes
echo 📝 Step 1: Adding changes...
git add -A
if %errorlevel% equ 0 (
    echo ✅ Changes added
) else (
    echo ❌ Failed to add changes
    goto error
)
echo.

REM Step 2: Commit changes
echo 📝 Step 2: Committing changes...
git commit -m "Fix: Trigger Vercel redeploy for register page - use npm ci for cleaner install"
if %errorlevel% equ 0 (
    echo ✅ Changes committed
) else (
    echo ⚠️  Commit failed (might be no changes)
)
echo.

REM Step 3: Push to GitHub
echo 📤 Step 3: Pushing to GitHub...
git push origin main
if %errorlevel% equ 0 (
    echo ✅ Successfully pushed to GitHub!
    goto success
) else (
    echo ❌ Failed to push to GitHub
    goto error
)

:success
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    PUSH SUCCESSFUL! ✅                        ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo ⏳ Vercel is now redeploying the frontend...
echo 📍 Check deployment status: https://vercel.com/dashboard
echo 🌐 Frontend URL: https://school-management-system-nu-pink.vercel.app
echo ⏱️  Deployment usually takes 2-5 minutes
echo.
echo 📋 Next steps:
echo    1. Wait 2-5 minutes for Vercel to redeploy
echo    2. Visit the frontend URL
echo    3. Click "Sign In"
echo    4. Click "Register here"
echo    5. Register page should load without 404 error
echo.
timeout /t 5
exit /b 0

:error
echo.
echo ❌ Error occurred during push
echo Please check your GitHub credentials
echo.
timeout /t 5
exit /b 1
