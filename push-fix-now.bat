@echo off
setlocal enabledelayedexpansion

echo 📦 Adding all changes...
"C:\Program Files\Git\cmd\git.exe" add -A

echo.
echo 💾 Committing changes...
"C:\Program Files\Git\cmd\git.exe" commit -m "Fix: Student ID display in admin portal - ensure student_id is returned from API"

echo.
echo 🚀 Pushing to GitHub...
"C:\Program Files\Git\cmd\git.exe" push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Push successful! Vercel and Render will redeploy automatically.
    echo.
    echo ⏳ Deployment status:
    echo    - Vercel: https://vercel.com/dashboard
    echo    - Render: https://dashboard.render.com
    echo.
    echo 🔄 Expected deployment time: 5-10 minutes
    echo.
    echo 📝 After deployment, hard refresh your browser (Ctrl+Shift+R) to clear cache
) else (
    echo.
    echo ❌ Push failed. Check the error above.
)

pause
