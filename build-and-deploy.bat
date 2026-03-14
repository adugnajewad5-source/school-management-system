@echo off
echo Building React app...
cd ..
"C:\Program Files\nodejs\npm.cmd" run build
echo Build complete!
echo Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Trigger Vercel rebuild with fresh build"
"C:\Program Files\Git\bin\git.exe" push origin main
echo Done! Vercel will redeploy automatically.
pause