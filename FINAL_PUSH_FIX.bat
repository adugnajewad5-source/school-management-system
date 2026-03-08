@echo off
setlocal enabledelayedexpansion

set GIT_PATH="C:\Program Files\Git\bin\git.exe"

echo.
echo ========================================
echo PUSHING FIXES TO GITHUB
echo ========================================
echo.

echo Step 1: Adding files...
%GIT_PATH% add .

echo Step 2: Committing...
%GIT_PATH% commit -m "Fix database configuration for localhost MySQL and add Render setup instructions"

echo Step 3: Pushing...
%GIT_PATH% push origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! PUSHED TO GITHUB!
    echo ========================================
    echo.
    echo Next: Set environment variables on Render
    echo 1. Go to: https://dashboard.render.com
    echo 2. Click: school-management-backend-gnav
    echo 3. Click: "Environment" tab
    echo 4. Remove old Railway variables
    echo 5. Add new variables:
    echo    DB_HOST=localhost
    echo    DB_USER=root
    echo    DB_PASSWORD=(empty)
    echo    DB_NAME=school_management
    echo    NODE_ENV=production
    echo 6. Click: "Redeploy"
    echo 7. Wait 2-3 minutes
    echo 8. Check logs for: "Connected to MySQL database"
) else (
    echo.
    echo ERROR: Push failed
)

pause
