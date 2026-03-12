@echo off
echo Pushing database migration fix...

"C:\Program Files\Git\bin\git.exe" add backend/run-railway-migration.js
"C:\Program Files\Git\bin\git.exe" commit -m "Fix migration script - embed SQL instead of reading file"
"C:\Program Files\Git\bin\git.exe" push origin main

echo.
echo ✓ Fix pushed to GitHub!
echo.
echo NEXT STEPS:
echo 1. Go to Render dashboard
echo 2. Click "Redeploy" on your backend service
echo 3. Wait 2-3 minutes
echo 4. Check logs for "Database migrations completed successfully"
echo 5. Try login at: school-management-system-nu-pink.vercel.app
echo.
pause