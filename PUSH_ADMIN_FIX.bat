@echo off
echo Pushing admin controller fixes...

"C:\Program Files\Git\bin\git.exe" add backend/controllers/adminController.js
"C:\Program Files\Git\bin\git.exe" commit -m "Fix admin controller - correct column names and database connection"
"C:\Program Files\Git\bin\git.exe" push origin main

echo.
echo ✓ Admin fixes pushed to GitHub!
echo.
echo NEXT STEPS:
echo 1. Go to Render dashboard
echo 2. Click "Redeploy" on your backend service
echo 3. Wait 2-3 minutes
echo 4. Try pre-registering a student again
echo.
pause