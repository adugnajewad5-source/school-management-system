# 🔒 Fix SSL/TLS Error for PlanetScale

## The Error

```
Error connecting to MySQL: Error: unknown error: Code: UNAVAILABLE
server does not allow insecure connections, client must use SSL/TLS
```

**Cause**: PlanetScale requires SSL/TLS, but your code doesn't have it configured.

---

## ✅ The Fix

### Step 1: Update backend/index.js

Find this code (around line 25):

```javascript
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management'
});
```

Replace with:

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

### Step 2: Commit and Push

```bash
git add backend/index.js
git commit -m "Add SSL/TLS support for PlanetScale"
git push origin main
```

### Step 3: Redeploy on Render

1. Go to Render Dashboard
2. Click your backend service
3. Go to "Deployments" tab
4. Click "Redeploy"
5. Wait 5-10 minutes

---

## 🎯 What Changed

Added SSL configuration:
```javascript
ssl: 'Amazon RDS',              // Enable SSL
waitForConnections: true,       // Wait for available connection
connectionLimit: 10,            // Max 10 connections
queueLimit: 0                   // No queue limit
```

This tells MySQL to use SSL/TLS encryption, which PlanetScale requires.

---

## ✅ After Fix

You should see in logs:
```
✓ Server is running on port 10000
✓ Connected to MySQL database
```

No more SSL errors!

---

## 🚀 Complete Deployment Status

| Component | Status | URL |
|-----------|--------|-----|
| Backend | ⏳ Fixing SSL | https://school-management-backend-gnav.onrender.com |
| Frontend | ⏳ Deploying | https://school-management-system.vercel.app |
| Database | ✅ Ready | PlanetScale |
| GitHub | ✅ Ready | https://github.com/adugnajewad5-source/school-management-system |

---

## 📋 Checklist

- [ ] Update backend/index.js with SSL config
- [ ] Commit changes
- [ ] Push to GitHub
- [ ] Redeploy on Render
- [ ] Wait 5-10 minutes
- [ ] Check logs for "Connected to MySQL database"
- [ ] Backend is LIVE! 🎉

---

**Time to fix**: 5 minutes
**Expected result**: Backend connects to database successfully
**Your app will be LIVE!** 🚀
