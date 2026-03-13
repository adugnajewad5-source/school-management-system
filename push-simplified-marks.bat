@echo off
echo 🚀 Pushing simplified detailed marks system to GitHub...

"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Simplified detailed marks system - works with existing database"
"C:\Program Files\Git\bin\git.exe" push origin main

echo ✅ Changes pushed to GitHub!
echo 🔄 Render will automatically redeploy the backend...
pause