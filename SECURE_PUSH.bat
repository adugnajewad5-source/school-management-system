@echo off
echo ========================================
echo SECURE GITHUB PUSH
echo ========================================
echo.
echo IMPORTANT: Use your NEW token (after revoking the old one)
echo.
echo Steps:
echo 1. Go to: https://github.com/settings/tokens
echo 2. Delete the old token you shared
echo 3. Generate a NEW token
echo 4. Copy the new token
echo 5. Paste it when prompted below
echo.
pause

REM Add files
echo.
echo Adding files to git...
git add .

REM Commit
echo Committing changes...
git commit -m "Ready for deployment - removed Cloudinary dependency"

REM Push with token
echo.
echo Pushing to GitHub...
echo When prompted, enter:
echo   Username: adugnajewad5-source
echo   Password: (paste your NEW token)
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
    echo NEXT: Go to Render.com and deploy!
    echo.
) else (
    echo.
    echo Push failed. Try GitHub Desktop:
    echo https://desktop.github.com
    echo.
)

pause
