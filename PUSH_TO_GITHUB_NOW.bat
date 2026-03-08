@echo off
echo ========================================
echo PUSHING TO GITHUB
echo ========================================
echo.
echo This will push your code to GitHub.
echo You may need to sign in.
echo.
pause

cd /d "%~dp0"
"C:\Program Files\Git\bin\git.exe" push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! Code pushed to GitHub!
    echo ========================================
    echo.
    echo Now you can deploy on Render!
    echo Go back to Render and refresh the page.
    echo.
) else (
    echo.
    echo ========================================
    echo AUTHENTICATION NEEDED
    echo ========================================
    echo.
    echo Please use GitHub Desktop instead:
    echo 1. Download: https://desktop.github.com
    echo 2. Sign in with your account
    echo 3. Add this repository
    echo 4. Click "Publish repository"
    echo.
)

pause
