@echo off
echo 🚀 Pushing register page fix to GitHub...

"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Fix: Register page 404 error - Enhanced Vercel SPA routing configuration"
"C:\Program Files\Git\bin\git.exe" push origin main

echo ✅ Changes pushed to GitHub!
echo 🔄 Vercel will automatically redeploy with fixed routing...
pause