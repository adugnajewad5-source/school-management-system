@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo SETTING UP LOCAL MYSQL DATABASE
echo ========================================
echo.

REM Check if MySQL is installed
echo Checking for MySQL installation...
where mysql >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MySQL found!
    echo.
    echo Creating database...
    mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS school_management;"
    mysql -u root -p -e "USE school_management;"
    echo.
    echo ✓ Database created!
    echo.
    echo Next steps:
    echo 1. Go to Render dashboard
    echo 2. Set these environment variables:
    echo    DB_HOST=localhost
    echo    DB_USER=root
    echo    DB_PASSWORD=(your MySQL password)
    echo    DB_NAME=school_management
    echo    NODE_ENV=production
    echo 3. Click Redeploy
) else (
    echo ✗ MySQL not found!
    echo.
    echo Please install MySQL or XAMPP first:
    echo 1. Download XAMPP: https://www.apachefriends.org/download.html
    echo 2. Install it
    echo 3. Start MySQL from XAMPP Control Panel
    echo 4. Run this script again
)

pause
