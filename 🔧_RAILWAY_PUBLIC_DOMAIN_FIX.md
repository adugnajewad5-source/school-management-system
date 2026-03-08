# 🔧 RAILWAY PUBLIC DOMAIN FIX - Use This Instead!

## ⚠️ IMPORTANT: Private Domain Won't Work on Render

The `${{RAILWAY_PRIVATE_DOMAIN}}` only works for services **within Railway's network**. Since Render is a different platform, it cannot access Railway's private domain.

**Solution:** Use the **PUBLIC DOMAIN** instead.

---

## 🔍 How to Get Railway Public Domain

### Option 1: From Railway Dashboard (Recommended)

1. Go to: https://railway.app/dashboard
2. Click your MySQL database
3. Look for the **"Public Domain"** or **"TCP Proxy Domain"**
4. It will look like: `gateway.railway.app` or similar
5. Copy the full connection string

### Option 2: From Environment Variables

1. Go to: https://railway.app/dashboard
2. Click your MySQL database
3. Click **"Variables"** tab
4. Look for: `RAILWAY_TCP_PROXY_DOMAIN`
5. This is your public domain

---

## 📋 CORRECTED ENVIRONMENT VARIABLES FOR RENDER

Use **these variables instead** (with public domain):

```
DB_HOST = gateway.railway.app
DB_USER = root
DB_PASSWORD = oGGYFZAYYVfJyMReLooWEFXCiWETNGep
DB_NAME = railway
DB_PORT = 3306
NODE_ENV = production
JWT_SECRET = your_super_secret_jwt_key_123_change_in_production
FRONTEND_URL = https://school-management-system.vercel.app
```

**⚠️ IMPORTANT:** Replace `gateway.railway.app` with your actual Railway public domain!

---

## 🎯 Steps to Fix

### Step 1: Get Your Railway Public Domain

1. Go to: https://railway.app/dashboard
2. Click your MySQL database
3. Find the public domain (looks like `gateway.railway.app` or `mysql-prod-xxxx.railway.app`)
4. Copy it

### Step 2: Update Render Environment Variables

1. Go to: https://dashboard.render.com
2. Click: `school-management-backend-gnav`
3. Click: `Environment`
4. Find the `DB_HOST` variable
5. Change it from: `${{RAILWAY_PRIVATE_DOMAIN}}`
6. Change it to: Your Railway public domain (e.g., `gateway.railway.app`)
7. Click: **Save**
8. Click: **Redeploy**

### Step 3: Wait and Check Logs

1. Wait 2-3 minutes
2. Click: **Logs**
3. Look for: `Connected to MySQL database` ✅

---

## 🔗 Example Connection Strings

### Private Domain (Won't work on Render):
```
mysql://root:password@${{RAILWAY_PRIVATE_DOMAIN}}:3306/railway
```

### Public Domain (Will work on Render):
```
mysql://root:password@gateway.railway.app:3306/railway
```

---

## 📸 Where to Find Railway Public Domain

### In Railway Dashboard:

```
Railway Dashboard
├── Your Project
│   └── MySQL Database
│       ├── Connect
│       │   └── Public Domain ← COPY THIS
│       └── Variables
│           └── RAILWAY_TCP_PROXY_DOMAIN ← OR THIS
```

---

## ✅ Complete Corrected Variables

Once you have your Railway public domain, use these:

```
DB_HOST = [YOUR_RAILWAY_PUBLIC_DOMAIN]
DB_USER = root
DB_PASSWORD = oGGYFZAYYVfJyMReLooWEFXCiWETNGep
DB_NAME = railway
DB_PORT = 3306
NODE_ENV = production
JWT_SECRET = your_super_secret_jwt_key_123_change_in_production
FRONTEND_URL = https://school-management-system.vercel.app
```

---

## 🆘 Troubleshooting

### Still seeing ECONNREFUSED?
- ❌ Public domain is wrong
- ✅ Go back to Railway and copy the exact public domain
- ✅ Make sure there are no extra spaces

### Still seeing ENOTFOUND?
- ❌ Public domain is incorrect
- ✅ Verify you copied it correctly from Railway
- ✅ Check for typos

### Connection times out?
- ❌ Public domain might be wrong
- ✅ Verify it's the TCP proxy domain, not something else
- ✅ Check Railway database is running

---

## 🎯 Next Steps

1. Get your Railway public domain
2. Update DB_HOST on Render with the public domain
3. Click Redeploy
4. Check logs for "Connected to MySQL database"
5. Test login

