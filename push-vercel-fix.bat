@echo off
echo Pushing Vercel configuration fix...
"C:\Program Files\Git\bin\git.exe" add vercel.json
"C:\Program Files\Git\bin\git.exe" commit -m "Fix Vercel configuration - correct frontend directory paths"
"C:\Program Files\Git\bin\git.exe" push origin main
echo Done! Vercel will redeploy automatically.
pause