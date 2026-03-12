@echo off
setlocal enabledelayedexpansion

echo Adding changes...
git add -A

echo Committing changes...
git commit -m "Fix: Trigger Vercel redeploy for register page - use npm ci for cleaner install"

echo Pushing to GitHub...
git push origin main

echo.
echo ✅ Successfully pushed to GitHub! Vercel will redeploy automatically.
pause
