@echo off
setlocal enabledelayedexpansion

set GIT_PATH="C:\Program Files\Git\bin\git.exe"

echo Pushing database migration changes...
%GIT_PATH% add backend/index.js backend/run-railway-migration.js backend/create_railway_tables.js
%GIT_PATH% commit -m "Add automatic database migration on startup - creates Railway tables and admin user"
%GIT_PATH% push origin main

echo.
echo Done! Changes pushed to GitHub.
echo.
echo Next steps:
echo 1. Go to Render dashboard
echo 2. Click "Redeploy" on your backend service
echo 3. Wait 2-3 minutes for deployment
echo 4. Check logs for "Database migrations completed successfully"
echo 5. Try logging in at: https://school-management-system-4hx2jvfn2.vercel.app
echo    Username: admin
echo    Password: Admin@123
echo.
pause
