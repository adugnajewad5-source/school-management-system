@echo off
echo ========================================
echo PUSHING YOUR CODE TO GITHUB
echo ========================================
echo.

REM Add all files
echo Adding files...
git add .

REM Commit changes
echo Committing changes...
git commit -m "Ready for deployment - removed Cloudinary dependency"

REM Push to GitHub
echo Pushing to GitHub...
echo You may need to enter your GitHub credentials...
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! CODE IS ON GITHUB!
    echo ========================================
    echo.
    echo Your repository: https://github.com/adugnajewad5-source/school-management-system
    echo.
    echo Next steps:
    echo 1. Go to Render.com
    echo 2. Refresh the page
    echo 3. Your repository should now appear
    echo 4. Continue with deployment
    echo.
) else (
    echo.
    echo ========================================
    echo AUTHENTICATION REQUIRED
    echo ========================================
    echo.
    echo Please use GitHub Desktop instead:
    echo.
    echo 1. Download: https://desktop.github.com
    echo 2. Install and sign in
    echo 3. File -^> Add Local Repository
    echo 4. Select this folder
    echo 5. Click "Publish repository"
    echo.
    echo OR create a Personal Access Token:
    echo 1. Go to: https://github.com/settings/tokens
    echo 2. Generate new token (classic)
    echo 3. Select "repo" scope
    echo 4. Copy token
    echo 5. Run this script again
    echo 6. Use token as password
    echo.
)

pause
