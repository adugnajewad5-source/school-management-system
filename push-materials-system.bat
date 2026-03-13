@echo off
echo 🚀 Pushing complete materials system to GitHub...

"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Complete materials system: teachers upload, students view materials"
"C:\Program Files\Git\bin\git.exe" push origin main

echo ✅ Changes pushed to GitHub!
echo 🔄 Render will automatically redeploy the backend...
pause