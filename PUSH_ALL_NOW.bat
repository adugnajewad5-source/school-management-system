@echo off
setlocal enabledelayedexpansion

set GIT="C:\Program Files\Git\bin\git.exe"

echo.
echo ========================================
echo PUSHING DATABASE MIGRATION FIX
echo ========================================
echo.

echo Step 1: Adding files...
%GIT% add backend/index.js backend/run-railway-migration.js backend/create_railway_tables.js
if errorlevel 1 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)
echo ✓ Files added

echo.
echo Step 2: Committing changes...
%GIT% commit -m "Add automatic database migration on startup - creates Railway tables and admin user"
if errorlevel 1 (
    echo ERROR: Failed to commit
    pause
    exit /b 1
)
echo ✓ Changes committed

echo.
echo Step 3: Pushing to GitHub...
%GIT% push origin main
if errorlevel 1 (
    echo ERROR: Failed to push
    pause
    exit /b 1
)
echo ✓ Pushed to GitHub

echo.
echo ========================================
echo ✓ SUCCESS! CODE PUSHED TO GITHUB
echo ========================================
echo.
echo NEXT STEPS:
echo 1. Go to: https://dashboard.render.com
echo 2. Click your backend service
echo 3. Click "Redeploy" button
echo 4. Wait 2-3 minutes
echo 5. Check logs for "Database migrations completed successfully"
echo 6. Try logging in at: https://school-management-system-4hx2jvfn2.vercel.app
echo    Username: admin
echo    Password: Admin@123
echo.
pause
