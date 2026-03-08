# 🔧 Simple Fix - Follow These Steps Exactly

## The Problem
```
Error: server does not allow insecure connections, client must use SSL/TLS
```

## The Solution - 3 Simple Steps

### STEP 1: Open Your Code Editor

Open your project folder in VS Code or any editor.

### STEP 2: Replace backend/index.js

1. Open: `backend/index.js`
2. Find this section (around line 25):
   ```javascript
   const db = mysql.createConnection({
     host: process.env.DB_HOST || 'localhost',
     user: process.env.DB_USER || 'root',
     password: process.env.DB_PASSWORD || '',
     database: process.env.DB_NAME || 'school_management'
   });
   ```

3. Replace it with:
   ```javascript
   const db = mysql.createConnection({
     host: process.env.DB_HOST || 'localhost',
     user: process.env.DB_USER || 'root',
     password: process.env.DB_PASSWORD || '',
     database: process.env.DB_NAME || 'school_management',
     ssl: 'Amazon RDS',
     waitForConnections: true,
     connectionLimit: 10,
     queueLimit: 0
   });
   ```

4. **Save the file** (Ctrl+S)

### STEP 3: Push to GitHub

Open Command Prompt and run:

```bash
cd "C:\Users\HP\Downloads\school managementwebsite"
git add backend/index.js
git commit -m "Fix SSL/TLS for PlanetScale"
git push origin main
```

---

## STEP 4: Redeploy on Render

1. Go to: https://render.com/dashboard
2. Click your backend service
3. G