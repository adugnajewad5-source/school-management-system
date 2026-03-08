# 🔧 Fix Backend Deployment on Render

## Common Backend Issues & Solutions

### Issue 1: Database Connection Error

**Error**: "Cannot connect to database"

**Fix**:
1. Go to Render Dashboard
2. Click your backend service: `school-management-backend`
3. Click "Environment" tab
4. Verify these variables:
   ```
   DB_HOST=aws.connect.psdb.cloud
   DB_USER=your_planetscale_username
   DB_PASSWORD=pscale_pw_your_password
   DB_NAME=school-management
   DB_PORT=3306
   ```
5. Make sure values match your PlanetScale credentials exactly
6. Click "Save"
7. Render will auto-redeploy

---

### Issue 2: Module Not Found Error

**Error**: "Cannot find module 'express'" or similar

**Fix**:
1. Go to Render Dashboard
2. Click your backend service
3. Click "Settings" tab
4. Verify:
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Root Directory**: `backend`
5. Click "Save"
6. Go to "Deployments"
7. Click "Redeploy"

---

### Issue 3: Port Error

**Error**: "Port already in use" or "Cannot listen on port"

**Fix**:
1. Go to Render Dashboard
2. Click your backend service
3. Click "Environment" tab
4. Find `PORT` variable
5. Change to: `10000`
6. Save and redeploy

---

### Issue 4: Build Fails

**Error**: "Build failed" or "npm install failed"

**Fix**:
1. Go to Render Dashboard
2. Click your backend service
3. Click "Logs" tab
4. Look for error messages
5. Common fixes:
   - Check `package.json` exists in backend folder
   - Check all dependencies are listed
   - Try deleting `node_modules` and `package-lock.json` locally, then push again

---

## ✅ Complete Backend Configuration

### Render Settings

**Settings → General:**
- Name: `school-management-backend`
- Region: Choose closest to you
- Branch: `main`
- Root Directory: `backend`
- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `node index.js`
- Instance Type: `Free` or `Starter`

### Environment Variables

**Settings → Environment:**

```
DB_HOST
aws.connect.psdb.cloud

DB_USER
your_planetscale_username

DB_PASSWORD
pscale_pw_your_planetscale_password

DB_NAME
school-management

DB_PORT
3306

JWT_SECRET
SchoolMgmt2026SecureJWTKeyProductionXYZ123

PORT
10000

NODE_ENV
production

FRONTEND_URL
https://school-management-system.vercel.app
```

---

## 🧪 Test Backend Connection

### Test 1: Check if Backend is Running

Visit: `https://school-management-backend.onrender.com`

You should see a response (not an error page).

### Test 2: Check Logs

1. Go to Render Dashboard
2. Click your backend service
3. Click "Logs" tab
4. Look for:
   - "Server is running on port 10000"
   - "Connected to MySQL database"

### Test 3: Test API Endpoint

Try logging in from frontend:
1. Open your frontend: `https://school-management-system.vercel.app`
2. Try login with admin credentials
3. Check browser console (F12) for errors

---

## 🔍 Debugging Steps

### Step 1: Check Render Logs

1. Go to Render Dashboard
2. Click your backend service
3. Click "Logs" tab
4. Look for error messages
5. Common errors:
   - "Cannot find module" → Missing dependency
   - "ECONNREFUSED" → Database connection failed
   - "Port already in use" → Change PORT variable

### Step 2: Verify Environment Variables

1. Go to Render Dashboard
2. Click your backend service
3. Click "Environment" tab
4. Check each variable:
   - DB_HOST: Should be `aws.connect.psdb.cloud`
   - DB_USER: Should match PlanetScale username
   - DB_PASSWORD: Should match PlanetScale password
   - DB_NAME: Should be `school-management`
   - PORT: Should be `10000`

### Step 3: Check GitHub Repository

1. Make sure all backend files are on GitHub
2. Check `backend/package.json` exists
3. Check `backend/index.js` exists
4. Check all routes are there

### Step 4: Redeploy

1. Go to Render Dashboard
2. Click your backend service
3. Click "Deployments" tab
4. Click "Redeploy" on latest deployment
5. Wait 5-10 minutes

---

## 📋 Backend Deployment Checklist

- [ ] Root Directory set to `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `node index.js`
- [ ] All environment variables added
- [ ] Database credentials correct
- [ ] PORT set to `10000`
- [ ] NODE_ENV set to `production`
- [ ] FRONTEND_URL set to your Vercel URL
- [ ] Logs show "Server running" and "Connected to database"
- [ ] Can access backend URL in browser

---

## 🚀 If Still Not Working

### Option 1: Redeploy from Scratch

1. Go to Render Dashboard
2. Click your backend service
3. Click "Settings" tab
4. Scroll down and click "Delete Service"
5. Confirm deletion
6. Create new Web Service
7. Follow configuration steps above

### Option 2: Check PlanetScale Database

1. Go to PlanetScale Dashboard
2. Click your database: `school-management`
3. Check status (should be "Ready")
4. Click "Connect" → "Node.js"
5. Verify connection details match Render environment variables

### Option 3: Check GitHub Repository

1. Go to GitHub: https://github.com/adugnajewad5-source/school-management-system
2. Check `backend` folder exists
3. Check `backend/package.json` exists
4. Check `backend/index.js` exists
5. If missing, push again from local

---

## 💡 Quick Fixes

**Backend not responding:**
- Check if Render service is running (green status)
- Check logs for errors
- Verify environment variables
- Redeploy

**Database connection failed:**
- Verify DB credentials in environment variables
- Check PlanetScale database is running
- Check database schema is imported
- Verify connection string format

**Frontend can't reach backend:**
- Check FRONTEND_URL in backend environment variables
- Check VITE_API_URL in frontend environment variables
- Verify both URLs are correct
- Check CORS is configured

---

## 📞 Need More Help?

**Check these files:**
- `FINAL_DEPLOYMENT_STEPS.md` - Complete deployment guide
- `COMPLETE_DEPLOYMENT_GUIDE.md` - Detailed steps
- `DATABASE_SETUP.md` - Database configuration

**Render Support:**
- Render Docs: https://render.com/docs
- Render Status: https://status.render.com

---

**Status**: Backend deployment troubleshooting guide
**Next**: Follow the steps above to fix your backend
**Expected**: Backend will be working in 5-10 minutes
