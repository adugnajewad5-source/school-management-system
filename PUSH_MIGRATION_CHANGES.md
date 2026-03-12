# Push Database Migration Changes to GitHub

## What Changed
- `backend/index.js` - Now runs database migration on startup
- `backend/run-railway-migration.js` - New migration script that creates tables
- `backend/create_railway_tables.js` - Standalone table creation script

## How to Push

### Option 1: Using Git Bash (Recommended)
```bash
cd "C:\Users\HP\Downloads\school managementwebsite"
git add backend/index.js backend/run-railway-migration.js backend/create_railway_tables.js
git commit -m "Add automatic database migration on startup - creates Railway tables and admin user"
git push origin main
```

### Option 2: Using Command Prompt
```cmd
cd "C:\Users\HP\Downloads\school managementwebsite"
"C:\Program Files\Git\bin\git.exe" add backend/index.js backend/run-railway-migration.js backend/create_railway_tables.js
"C:\Program Files\Git\bin\git.exe" commit -m "Add automatic database migration on startup - creates Railway tables and admin user"
"C:\Program Files\Git\bin\git.exe" push origin main
```

### Option 3: Double-click the batch file
```
push-migration.bat
```

## After Pushing

1. Go to Render dashboard: https://dashboard.render.com
2. Click on your backend service
3. Click "Redeploy" button
4. Wait 2-3 minutes
5. Check logs for "Database migrations completed successfully"
6. Try logging in at: https://school-management-system-4hx2jvfn2.vercel.app
   - Username: admin
   - Password: Admin@123
