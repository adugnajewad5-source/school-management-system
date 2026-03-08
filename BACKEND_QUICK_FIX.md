# ⚡ Backend Quick Fix - 5 Minutes

## What's Wrong?

Tell me which error you see:

### Error 1: "Cannot connect to database"
→ Go to **Step 1** below

### Error 2: "Cannot find module"
→ Go to **Step 2** below

### Error 3: "Port already in use"
→ Go to **Step 3** below

### Error 4: "Build failed"
→ Go to **Step 4** below

### Error 5: Backend not responding
→ Go to **Step 5** below

---

## STEP 1: Fix Database Connection

1. Go to Render Dashboard
2. Click your backend service
3. Click "Environment" tab
4. Check these variables match your PlanetScale credentials:
   ```
   DB_HOST=aws.connect.psdb.cloud
   DB_USER=your_planetscale_username
   DB_PASSWORD=pscale_pw_your_password
   DB_NAME=school-management
   DB_PORT=3306
   ```
5. If any are wrong, update them
6. Click "Save"
7. Render will auto-redeploy

---

## STEP 2: Fix Missing Modules

1. Go to Render Dashboard
2. Click your backend service
3. Click "Deployments" tab
4. Click "Redeploy" on latest deployment
5. Wait 5-10 minutes

---

## STEP 3: Fix Port Error

1. Go to Render Dashboard
2. Click your backend service
3. Click "Environment" tab
4. Find `PORT` variable
5. Change to: `10000`
6. Click "Save"

---

## STEP 4: Fix Build Failed

1. Go to Render Dashboard
2. Click your backend service
3. Click "Logs" tab
4. Look for error message
5. Common fixes:
   - Check `backend/package.json` exists on GitHub
   - Check `backend/index.js` exists on GitHub
   - Try pushing code again

---

## STEP 5: Fix Backend Not Responding

1. Go to Render Dashboard
2. Click your backend service
3. Check status (should be green)
4. Click "Logs" tab
5. Look for:
   - "Server is running on port 10000"
   - "Connected to MySQL database"
6. If not there, check environment variables

---

## ✅ Verify Backend is Working

1. Visit: `https://school-management-backend.onrender.com`
2. You should see a response (not error page)
3. If you see error, check logs

---

## 🎯 Complete Environment Variables

Make sure ALL these are set in Render:

```
DB_HOST=aws.connect.psdb.cloud
DB_USER=your_planetscale_username
DB_PASSWORD=pscale_pw_your_password
DB_NAME=school-management
DB_PORT=3306
JWT_SECRET=SchoolMgmt2026SecureJWTKeyProductionXYZ123
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://school-management-system.vercel.app
```

---

## 📋 Checklist

- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `node index.js`
- [ ] All environment variables set
- [ ] Database credentials correct
- [ ] Redeployed
- [ ] Logs show "Server running"
- [ ] Backend URL responds

---

**Time**: 5 minutes to fix
**Result**: Backend will work!
