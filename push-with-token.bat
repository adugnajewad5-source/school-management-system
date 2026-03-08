@echo off
setlocal enabledelayedexpansion

echo ========================================
echo PUSHING TO GITHUB WITH TOKEN
echo ========================================
echo.

REM Configure git to use token
echo Configuring git credentials...
git config --global credential.helper store

REM Add all files
echo Adding files...
git add .

REM Commit changes
echo Committing changes...
git commit -m "Ready for deployment - removed Cloudinary dependency"

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! CODE PUSHED TO GITHUB!
    echo ========================================
    echo.
    echo Your repository: https://github.com/adugnajewad5-source/school-management-system
    echo.
    echo NEXT STEPS:
    echo 1. Go to Render.com
    echo 2. Refresh the page
    echo 3. Your repository should now appear
    echo 4. Select it and continue with deployment
    echo.
    echo Backend Environment Variables:
    echo DB_HOST=aws.connect.psdb.cloud
    echo DB_USER=your_planetscale_user
    echo DB_PASSWORD=pscale_pw_your_password
    echo DB_NAME=school-management
    echo DB_PORT=3306
    echo JWT_SECRET=SchoolMgmt2026SecureJWTKeyProductionXYZ123
    echo PORT=10000
    echo NODE_ENV=production
    echo.
) else (
    echo.
    echo ERROR: Push failed
    echo.
    echo Try GitHub Desktop instead:
    echo https://desktop.github.com
    echo.
)

pause
