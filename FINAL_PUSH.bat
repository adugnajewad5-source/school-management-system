@echo off
setlocal enabledelayedexpansion

REM Set git path
set GIT_PATH="C:\Program Files\Git\bin\git.exe"

echo.
echo ========================================
echo PUSHING TO GITHUB
echo ========================================
echo.

echo Step 1: Adding files...
%GIT_PATH% add .
if %errorlevel% neq 0 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

echo Step 2: Committing...
%GIT_PATH% commit -m "Fix SSL/TLS for PlanetScale database connection"
if %errorlevel% neq 0 (
    echo ERROR: Failed to commit
    pause
    exit /b 1
)

echo Step 3: Pushing to GitHub...
%GIT_PATH% push origin main
if %errorlevel% neq 0 (
    echo ERROR: Failed to push
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! PUSHED TO GITHUB!
echo ========================================
echo.
echo Next steps:
echo 1. Go to: https://dashboard.render.com
echo 2. Click: school-management-backend-gnav
echo 3. Click: "Redeploy"
echo 4. Wait 2-3 minutes
echo 5. Check logs for: "Connected to MySQL database"
echo.
pause
