@echo off
echo Deploying routing fix...

REM Use full path to git to avoid alias conflicts
"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Fix: Resolve 404 NOT_FOUND errors on page refresh - SPA routing configuration"
"C:\Program Files\Git\bin\git.exe" push origin main

echo.
echo Deployment complete! Wait 2-3 minutes for Vercel to redeploy.
pause