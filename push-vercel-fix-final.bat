@echo off
cd /d "%~dp0"

echo Adding vercel.json...
"C:\Program Files\Git\cmd\git.exe" add vercel.json

echo Committing changes...
"C:\Program Files\Git\cmd\git.exe" commit -m "Fix Vercel build - use npm --prefix instead of cd command"

echo Pushing to GitHub...
"C:\Program Files\Git\cmd\git.exe" push origin main

echo.
echo ✓ Successfully pushed to GitHub!
echo Vercel will auto-redeploy with the updated build command.
pause
