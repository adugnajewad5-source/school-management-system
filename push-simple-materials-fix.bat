@echo off
echo 🚀 Pushing simple materials fix to GitHub...

"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Simple fix: Working materials page for students to view study materials"
"C:\Program Files\Git\bin\git.exe" push origin main

echo ✅ Changes pushed to GitHub!
echo 🔄 Vercel will automatically redeploy the frontend...
pause