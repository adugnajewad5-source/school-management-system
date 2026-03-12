@echo off
echo Pushing admin controller fixes to GitHub...
git add backend/index.js backend/run-railway-migration.js backend/create_railway_tables.js backend/controllers/adminController.js
git commit -m "Fix admin controller column names and database connection parsing for Railway"
git push origin main
echo Done!
pause
