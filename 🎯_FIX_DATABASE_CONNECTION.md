# 🎯 Fix Database Connection - Complete Guide

Your backend is not connecting to the database because **Render doesn't have the PlanetScale credentials**. Follow this guide to fix it.

---

## 📋 What's the Problem?

1. ✅ Backend code is on GitHub
2. ✅ Backend is deployed on Render
3. ❌ But Render doesn't know the database credentials
4. ❌ So it can't connect to PlanetScale
5. ❌ That's why you see: "Error connecting to MySQL"

---

## 🔧 Solution: Set Environment Variables on Render

### Step 1: Get Your PlanetScale Credentials

**Go to:** https://app.planetscale.com

1. Login to your PlanetScale account
2. Click your database: `school-management`
3. Click: **"Connect"** button
4. Select: **"Node.js"** from dropdown
5. You'll see a connection string with:
   - `host`: `aws.connect.psdb.cloud`
   - `user`: Your username (looks like: `xxxxxxxxxxxxx`)
   - `password`: Your password (looks like: `pscale_pw_xxxxxxxxxxxxx`)

**Copy these values!**

---

### Step 2: Set Variables on Render

**Go to:** https://dashboard.render.com

1. Click: `school-management-backend-gnav` service
2. Click: **"Environment"** tab (left sidebar)
3. You'll see existing variables
4. Add/Update these variables:

| Variable | Value |
|----------|-------|
| `DB_HOST` | `aws.connect.psdb.cloud` |
| `DB_USER` | (your PlanetScale username) |
| `DB_PASSWORD` | (your PlanetScale password) |
| `DB_NAME` | `school-management` |
| `DB_PORT` | `3306` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `your_super_secret_jwt_key_123_change_in_production` |
| `FRONTEND_URL` | `https://school-management-system.vercel.app` |

**How to add a variable:**
1. Click: **"Add Environment Variable"** button
2. Enter: Variable name (e.g., `DB_HOST`)
3. Enter: Variable value (e.g., `aws.connect.psdb.cloud`)
4. Click: **"Save"** button
5. Repeat for each variable

---

### Step 3: Redeploy Backend

1. Still on Render dashboard
2. Click: **"Redeploy"** button (top right)
3. Wait: 2-3 minutes for deployment

---

### Step 4: Check Logs

1. Click: **"Logs"** tab
2. Look for this message:
   ```
   Connected to MySQL database
   ```

**If you see this, it's working!** ✅

**If you see error:**
```
Error connecting to MySQL: Access denied for user
```
This means the credentials are wrong. Check:
- DB_USER is correct
- DB_PASSWORD is correct
- Both match your PlanetScale credentials

---

## 📝 Example Environment Variables

```
DB_HOST=aws.connect.psdb.cloud
DB_USER=xxxxxxxxxxxxxxxx
DB_PASSWORD=pscale_pw_xxxxxxxxxxxxxxxx
DB_NAME=school-management
DB_PORT=3306
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_123_change_in_production
FRONTEND_URL=https://school-management-system.vercel.app
```

---

## ✅ After Setting Variables

1. Backend connects to PlanetScale ✅
2. Render logs show: "Connected to MySQL database" ✅
3. Frontend can reach backend ✅
4. Login works ✅
5. System is live ✅

---

## 🆘 Troubleshooting

### "Access denied for user"
- Check DB_USER is correct
- Check DB_PASSWORD is correct
- Verify they match PlanetScale

### "Unknown host"
- Check DB_HOST is `aws.connect.psdb.cloud`
- Don't use localhost

### "Connection timeout"
- Check PlanetScale network access
- Go to PlanetScale → Database → Settings → Connections
- Verify your IP is allowed (or allow all)

### "Still not working after 5 minutes"
- Render might be using cached code
- Try clicking "Redeploy" again
- Wait another 2-3 minutes

---

## 🚀 Quick Checklist

- [ ] Got PlanetScale credentials from https://app.planetscale.com
- [ ] Set DB_HOST on Render
- [ ] Set DB_USER on Render
- [ ] Set DB_PASSWORD on Render
- [ ] Set DB_NAME on Render
- [ ] Set NODE_ENV=production on Render
- [ ] Clicked "Redeploy" on Render
- [ ] Waited 2-3 minutes
- [ ] Checked logs for "Connected to MySQL database"
- [ ] Tested login at https://school-management-system.vercel.app

---

## 📞 Need Help?

1. Check Render logs for exact error message
2. Verify PlanetScale credentials are correct
3. Check PlanetScale network access settings
4. Try redeploying again

---

**Set these environment variables on Render and your database will connect!** 🎯
