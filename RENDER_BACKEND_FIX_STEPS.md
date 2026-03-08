# 🔧 Render Backend SSL/TLS Fix - Complete Steps

## Current Status
- ✅ Code fix is in `backend/index.js` locally
- ❌ Code fix is NOT on GitHub yet
- ❌ Render is using old code from GitHub (without SSL fix)
- ❌ That's why SSL error persists

## The Error You're Seeing
```
Error connecting to MySQL: Error: unknown error: Code: UNAVAILABLE
server does not allow insecure connections, client must use SSL/TLS
```

This error means Render's backend is trying to connect to PlanetScale WITHOUT SSL/TLS, which PlanetScale rejects.

## The Fix (Already in Your Code)

**File: `backend/index.js` (lines 24-33)**

```javascript
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management',
  ssl: 'Amazon RDS',              // ← THIS ENABLES SSL/TLS
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

## Step-by-Step Fix

### STEP 1: Push Code to GitHub

**Choose ONE method:**

#### Method A: Command Line (Fastest)
Open PowerShell or CMD and run:
```bash
git add .
git commit -m "Fix SSL/TLS for PlanetScale database"
git push origin main
```

#### Method B: Batch File
Double-click: `PUSH_SIMPLE.bat`

#### Method C: GitHub Desktop
1. Open GitHub Desktop
2. See `backend/index.js` in changes
3. Click "Commit to main"
4. Click "Push origin"

**Expected result:** No errors, changes pushed to GitHub

---

### STEP 2: Redeploy Backend on Render

1. Go to: https://dashboard.render.com
2. Login with your account
3. Click: `school-management-backend-gnav` service
4. Click: **"Redeploy"** button (top right corner)
5. Wait: 2-3 minutes for deployment

**What to expect:**
- Build starts
- Dependencies install
- Code deploys
- Service restarts

---

### STEP 3: Check Render Logs

1. Still on Render dashboard
2. Click: **"Logs"** tab
3. Look for one of these messages:

**✅ SUCCESS (you should see this):**
```
Server is running securely on all network interfaces on port 10000
Connected to MySQL database
```

**❌ FAILURE (if you see this, something's wrong):**
```
Error connecting to MySQL: Error: unknown error: Code: UNAVAILABLE
server does not allow insecure connections, client must use SSL/TLS
```

---

### STEP 4: Test Backend Connection

Once you see "Connected to MySQL database" in logs:

1. Open: https://school-management-backend-gnav.onrender.com
2. You should see: `School Management System API`
3. This means backend is running and connected to database

---

### STEP 5: Redeploy Frontend on Vercel

1. Go to: https://vercel.com/dashboard
2. Click: `school-management-system` project
3. Click: **"Redeploy"** button
4. Wait: 2-3 minutes

---

### STEP 6: Test Full System

1. Open: https://school-management-system.vercel.app
2. Login with:
   - Username: `admin`
   - Password: `Admin@123`
3. You should see admin dashboard
4. Try adding marks or other features

---

## Troubleshooting

### If you still see SSL error after redeploy:

**Check 1: Verify code was pushed**
```bash
git log --oneline -5
```
Should show your recent commit about SSL/TLS fix

**Check 2: Verify Render is using new code**
- Go to Render dashboard
- Click your service
- Click "Deployments" tab
- Check the latest deployment
- Click it to see the code it deployed
- Verify `backend/index.js` has `ssl: 'Amazon RDS'`

**Check 3: Check environment variables on Render**
- Go to Render dashboard
- Click your service
- Click "Environment" tab
- Verify these are set:
  - `DB_HOST`: aws.connect.psdb.cloud
  - `DB_USER`: root
  - `DB_PASSWORD`: (your PlanetScale password)
  - `DB_NAME`: school_management

### If frontend still shows "Failed to fetch":

**Check 1: Verify backend is running**
- Open: https://school-management-backend-gnav.onrender.com
- Should see: `School Management System API`

**Check 2: Check browser console**
- Open frontend
- Press F12 (Developer Tools)
- Click "Console" tab
- Look for error messages
- They'll tell you what's wrong

**Check 3: Verify frontend API URL**
- Check `frontend/src/pages/LoginPage.jsx` line 16
- Should have: `import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com'`

---

## Summary

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Push to GitHub | Changes on GitHub |
| 2 | Redeploy Render | Build successful |
| 3 | Check logs | "Connected to MySQL database" |
| 4 | Test backend | See "School Management System API" |
| 5 | Redeploy Vercel | Deployment ready |
| 6 | Test login | Admin dashboard loads |

---

## Files Involved

- `backend/index.js` - Contains SSL fix (line 30)
- `backend/.env` - Database credentials (should be set on Render)
- `frontend/src/pages/LoginPage.jsx` - API URL (line 16)
- `frontend/src/pages/RegisterPage.jsx` - API URL (line 52)
- `frontend/src/services/parentApi.js` - API URL (line 7)

---

**The fix is ready. Just push to GitHub and redeploy!** 🚀
