@echo off
REM Final Push - All Fixes to GitHub (with full git path)

setlocal enabledelayedexpansion

REM Set environment variables
set GIT_TERMINAL_PROMPT=0
set GIT_AUTHOR_NAME=Auto Deploy
set GIT_AUTHOR_EMAIL=auto@deploy.local
set GIT_COMMITTER_NAME=Auto Deploy
set GIT_COMMITTER_EMAIL=auto@deploy.local

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║         FINAL PUSH - ALL FIXES TO GITHUB                      ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Use full path to git
set GIT_PATH="C:\Program Files\Git\cmd\git.exe"

REM Check if git exists
if not exist %GIT_PATH% (
    echo ❌ Git not found at: %GIT_PATH%
    echo Trying alternative path...
    set GIT_PATH="C:\Program Files (x86)\Git\cmd\git.exe"
)

if not exist %GIT_PATH% (
    echo ❌ Git is not installed
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git found at: %GIT_PATH%
echo.

REM Step 1: Check git status
echo 📊 Checking git status...
%GIT_PATH% status --porcelain
echo.

REM Step 2: Add all changes
echo 📝 Adding all changes...
%GIT_PATH% add -A
if %errorlevel% neq 0 (
    echo ❌ Failed to add changes
    pause
    exit /b 1
)
echo ✅ Changes added
echo.

REM Step 3: Commit changes
echo 📝 Committing changes...
%GIT_PATH% commit -m "Fix: Student ID display, Send to Teacher functionality, and API URL configuration"
if %errorlevel% neq 0 (
    echo ⚠️  Commit failed (might be no changes)
) else (
    echo ✅ Changes committed
)
echo.

REM Step 4: Push to GitHub
echo 📤 Pushing to GitHub...
%GIT_PATH% push origin main
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

echo 📋 FIXES DEPLOYED:
echo.
echo ✅ 1. Student ID Display Fix
echo    - Backend: Explicit column selection in getStudents query
echo    - Frontend: Updated delete button to handle field variations
echo.
echo ✅ 2. Send to Teacher Functionality
echo    - Frontend: Changed to use environment variable for API URL
echo    - Backend: Fixed database connection pooling and error handling
echo.
echo ✅ 3. API URL Configuration
echo    - All frontend components now use VITE_API_URL environment variable
echo    - Fallback to production backend URL if env var not set
echo.

echo ⏳ DEPLOYMENT STATUS:
echo.
echo 📍 GitHub: Changes pushed successfully
echo 📍 Vercel: Frontend redeploy in progress (2-5 minutes)
echo 📍 Render: Backend redeploy in progress (2-5 minutes)
echo.

echo 🌐 LIVE URLS:
echo.
echo Frontend:  https://school-management-system-nu-pink.vercel.app
echo Backend:   https://school-management-backend-gnav.onrender.com
echo GitHub:    https://github.com/adugnajewad5-source/school-management-system
echo.

echo 👤 ADMIN CREDENTIALS:
echo.
echo Username: admin
echo Password: Admin@123
echo.

echo 📋 NEXT STEPS:
echo.
echo 1. Wait 2-5 minutes for Vercel and Render to redeploy
echo 2. Visit frontend URL to verify deployment
echo 3. Login as admin to test all features
echo 4. Verify student ID displays in admin portal
echo 5. Test "Send to Teacher" functionality
echo 6. Test all other features
echo.

echo ═══════════════════════════════════════════════════════════════════
echo.

REM Open Vercel dashboard
start https://vercel.com/dashboard

timeout /t 3

endlocal
