@echo off
echo 🚀 Pushing detailed marks migration fix to GitHub...

"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Fix: Add detailed marks migration to backend startup"
"C:\Program Files\Git\bin\git.exe" push origin main

echo ✅ Changes pushed to GitHub!
echo 🔄 Render will automatically redeploy the backend...
pause