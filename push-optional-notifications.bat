@echo off
echo 🚀 Pushing optional notifications fix to GitHub...

"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Fix: Make notifications optional in detailed marks system"
"C:\Program Files\Git\bin\git.exe" push origin main

echo ✅ Changes pushed to GitHub!
echo 🔄 Render will automatically redeploy the backend...
pause