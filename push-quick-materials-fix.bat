@echo off
echo 🚀 Pushing quick materials fix to GitHub...

"C:\Program Files\Git\bin\git.exe" add frontend/src/pages/StudentDashboard.jsx
"C:\Program Files\Git\bin\git.exe" commit -m "Quick fix: Make View Material buttons functional with demo content"
"C:\Program Files\Git\bin\git.exe" push origin main

echo ✅ Changes pushed to GitHub!
echo 🔄 Vercel will automatically redeploy the frontend...
pause