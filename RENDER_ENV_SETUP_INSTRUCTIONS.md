# 🔧 Set Render Environment Variables - Complete Instructions

Your XAMPP MySQL is running. Now I need to set the environment variables on Render so the backend can connect to your local MySQL.

## Step-by-Step Instructions

### Step 1: Go to Render Dashboard
1. Open: https://dashboard.render.com
2. Login with your account
3. Click: `school-management-backend-gnav` service

### Step 2: Click Environment Tab
1. You're now on the service page
2. Look at the left sidebar
3. Click: **"Environment"** tab

### Step 3: Remove Old Variables
Look for these variables and DELETE them (if they exist):
- `DB_HOST=mysql.railway.internal`
- Any other Railway-related variables

To delete:
1. Find the variable
2. Click the trash/delete icon
3. Confirm deletion

### Step 4: Add New Variables
Click: **"Add Environment Variable"** button for each variable below:

**Variable 1:**
- Name: `DB_HOST`
- Value: `localhost`
- Click: "Save"

**Variable 2:**
- Name: `DB_USER`
- Value: `root`
- Click: "Save"

**Variable 3:**
- Name: `DB_PASSWORD`
- Value: (leave empty - just click Save)
- Click: "Save"

**Variable 4:**
- Name: `DB_NAME`
- Value: `school_management`
- Click: "Save"

**Variable 5:**
- Name: `NODE_ENV`
- Value: `production`
- Click: "Save"

**Variable 6:**
- Name: `JWT_SECRET`
- Value: `your_super_secret_jwt_key_123_change_in_production`
- Click: "Save"

**Variable 7:**
- Name: `FRONTEND_URL`
- Value: `https://school-management-system.vercel.app`
- Click: "Save"

### Step 5: Redeploy Backend
1. After adding all variables
2. Click: **"Redeploy"** button (top right)
3. Wait: 2-3 minutes for deployment

### Step 6: Check Logs
1. Click: **"Logs"** tab
2. Look for: `Connected to MySQL database`
3. If you see this, it's working! ✅

### Step 7: Test Frontend
1. Open: https://school-management-system.vercel.app
2. Login with:
   - Username: `admin`
   - Password: `Admin@123`
3. You should see the admin dashboard

---

## Summary of Variables to Set

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=(empty)
DB_NAME=school_management
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_123_change_in_production
FRONTEND_URL=https://school-management-system.vercel.app
```

---

## If You Get Stuck

1. Make sure XAMPP MySQL is running
2. Make sure you removed the old Railway variables
3. Make sure you added all 7 new variables
4. Click "Redeploy" after adding variables
5. Wait 2-3 minutes
6. Check logs for "Connected to MySQL database"

---

**Follow these steps and your system will work!** 🚀
