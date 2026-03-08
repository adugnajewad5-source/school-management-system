@echo off
echo Pushing to GitHub...
git add .
git commit -m "Fix SSL/TLS for PlanetScale"
git push origin main
echo Done!
pause
