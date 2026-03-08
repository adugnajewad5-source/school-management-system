@echo off
set GIT_PATH="C:\Program Files\Git\bin\git.exe"

echo.
echo ========================================
echo PUSHING CLEAN CODE TO GITHUB
echo ========================================
echo.

echo Step 1: Adding files...
%GIT_PATH% add .

echo Step 2: Committing...
%GIT_PATH% commit -m "Add database connection guides and improve SSL/TLS configuration"

echo Step 3: Pushing to GitHub...
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
    echo 4. Add database credentials from PlanetScale
    echo 5. Click: "Redeploy"
) else (
    echo.
    echo ERROR: Push failed
)

pause
