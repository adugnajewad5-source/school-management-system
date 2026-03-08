# 🔧 SET RAILWAY DATABASE ON RENDER - VISUAL STEP-BY-STEP GUIDE

## ⚠️ CRITICAL: This is why backend is failing
Your backend on Render is trying to connect to `localhost` (your computer), but Render is a cloud server that cannot access your local computer. You MUST use Railway database credentials instead.

---

## 📋 YOUR RAILWAY CREDENTIALS (Copy these exactly)

```
DB_HOST = ${{RAILWAY_PRIVATE_DOMAIN}}
DB_USER = root
DB_PASSWORD = oGGYFZAYYVfJyMReLooWEFXCiWETNGep
DB_NAME = railway
DB_PORT = 3306
NODE_ENV = production
JWT_SECRET = your_super_secret_jwt_key_123_change_in_production
FRONTEND_URL = https://school-management-system.vercel.app
```

---

## 🎯 STEP-BY-STEP INSTRUCTIONS

### STEP 1: Go to Render Dashboard
1. Open: https://dashboard.render.com
2. Click on your backend service: **school-management-backend-gnav**

### STEP 2: Open Environment Variables
1. In the left sidebar, click **Environment**
2. You'll see a section called "Environment Variables"

### STEP 3: Add Each Variable (8 total)

**Click "Add Environment Variable" and fill in EXACTLY as shown:**

#### Variable 1:
- **Key:** `DB_HOST`
- **Value:** `${{RAILWAY_PRIVATE_DOMAIN}}`
- Click **Save**

#### Variable 2:
- **Key:** `DB_USER`
- **Value:** `root`
- Click **Save**

#### Variable 3:
- **Key:** `DB_PASSWORD`
- **Value:** `oGGYFZAYYVfJyMReLooWEFXCiWETNGep`
- Click **Save**

#### Variable 4:
- **Key:** `DB_NAME`
- **Value:** `railway`
- Click **Save**

#### Variable 5:
- **Key:** `DB_PORT`
- **Value:** `3306`
- Click **Save**

#### Variable 6:
- **Key:** `NODE_ENV`
- **Value:** `production`
- Click **Save**

#### Variable 7:
- **Key:** `JWT_SECRET`
- **Value:** `your_super_secret_jwt_key_123_change_in_production`
- Click **Save**

#### Variable 8:
- **Key:** `FRONTEND_URL`
- **Value:** `https://school-management-system.vercel.app`
- Click **Save**

### STEP 4: Redeploy Backend
1. After adding all 8 variables, scroll to the top
2. Click the **"Redeploy"** button (or look for "Manual Deploy")
3. Wait 2-3 minutes for deployment to complete

### STEP 5: Check Logs
1. Click **Logs** in the left sidebar
2. Wait for the message: **"Connected to MySQL database"**
3. If you see this, ✅ SUCCESS! Backend is now connected to Railway

---

## ✅ VERIFICATION CHECKLIST

After redeploy, check these in the logs:
- ✅ `Server is running securely on all network interfaces on port 10000`
- ✅ `Connected to MySQL database`
- ❌ NO error messages about `ECONNREFUSED` or `ENOTFOUND`

---

## 🚀 NEXT STEP (After Backend is Fixed)

Once backend is connected to Railway, set Vercel environment variable:
- Go to: https://vercel.com/dashboard
- Select your project: **school-management-system**
- Click **Settings** → **Environment Variables**
- Add:
  - **Name:** `VITE_API_URL`
  - **Value:** `https://school-management-backend-gnav.onrender.com`
  - **Select:** Production
- Click **Save**
- Redeploy frontend

---

## 🆘 TROUBLESHOOTING

### If you see "ECONNREFUSED" error:
- ❌ Environment variables were NOT saved properly
- ✅ Go back to Step 3 and verify all 8 variables are there
- ✅ Make sure you clicked "Save" after each variable

### If you see "ENOTFOUND mysql.railway.internal":
- ❌ The `DB_HOST` variable is wrong
- ✅ Make sure it's exactly: `${{RAILWAY_PRIVATE_DOMAIN}}`
- ✅ Note the double curly braces: `${{` not `${`

### If backend still won't connect:
- ✅ Wait 5 minutes after redeploy (sometimes takes time)
- ✅ Check that Railway database is actually running
- ✅ Verify password is exactly: `oGGYFZAYYVfJyMReLooWEFXCiWETNGep`

---

## 📞 NEED HELP?

If something doesn't work:
1. Take a screenshot of your Render environment variables
2. Check the Logs tab for error messages
3. Make sure all 8 variables are present
4. Redeploy again if needed

