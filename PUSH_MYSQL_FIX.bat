@echo off
set GIT_PATH="C:\Program Files\Git\bin\git.exe"

echo.
echo ========================================
echo PUSHING MYSQL FIX TO GITHUB
echo ========================================
echo.

%GIT_PATH% add .
%GIT_PATH% commit -m "Add critical MySQL not running fix guide"
%GIT_PATH% push origin main

echo.
echo ========================================
echo PUSHED!
echo ========================================
echo.
echo CRITICAL: Start MySQL in XAMPP now!
echo 1. Open XAMPP Control Panel
echo 2. Click "Start" next to MySQL
echo 3. Wait for it to show "Running"
echo 4. Go to Render and click "Redeploy"
echo 5. Wait 2-3 minutes
echo 6. Check logs for "Connected to MySQL database"
echo.
pause
