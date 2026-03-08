@echo off
set GIT_PATH="C:\Program Files\Git\bin\git.exe"

echo.
echo ========================================
echo PUSHING VERCEL FIX TO GITHUB
echo ========================================
echo.

%GIT_PATH% add .
%GIT_PATH% commit -m "Add Vercel environment variable setup guides"
%GIT_PATH% push origin main

echo.
echo ========================================
echo PUSHED TO GITHUB!
echo ========================================
echo.
echo Next: Set environment variables on BOTH platforms
echo 1. Render: Set 7 backend variables
echo 2. Vercel: Set 1 frontend variable
echo 3. Redeploy both
echo 4. Test login
echo.
pause
