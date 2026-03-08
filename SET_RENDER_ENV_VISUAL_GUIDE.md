# 🎯 Set Render Environment Variables - Visual Guide

I cannot directly access Render's dashboard, but I can guide you through it step-by-step. It takes about 3 minutes.

## Step-by-Step Visual Guide

### Step 1: Open Render Dashboard
```
1. Go to: https://dashboard.render.com
2. Login with your account
3. You see your services listed
```

### Step 2: Click Your Backend Service
```
Look for: "school-management-backend-gnav"
Click on it
```

### Step 3: You're Now on Service Page
```
You see tabs at the top:
- Overview
- Logs
- Events
- Environment  ← CLICK THIS
- Settings
```

### Step 4: Click "Environment" Tab
```
Click: "Environment"
You see existing environment variables
```

### Step 5: Remove Old Variables
```
Look for: DB_HOST=mysql.railway.internal
Click the trash/delete icon next to it
Confirm deletion

Delete any other Railway-related variables
```

### Step 6: Add New Variables
```
Click: "Add Environment Variable" button

For each variable below:
1. Enter the name (e.g., DB_HOST)
2. Enter the value (e.g., localhost)
3. Click "Save"
4. Repeat for next variable
```

### Variables to Add (Copy-Paste These):

**Variable 1:**
```
Name: DB_HOST
Value: localhost
```

**Variable 2:**
```
Name: DB_USER
Value: root
```

**Variable 3:**
```
Name: DB_PASSWORD
Value: (leave completely empty - just click Save)
```

**Variable 4:**
```
Name: DB_NAME
Value: school_management
```

**Variable 5:**
```
Name: NODE_ENV
Value: production
```

**Variable 6:**
```
Name: JWT_SECRET
Value: your_super_secret_jwt_key_123_change_in_production
```

**Variable 7:**
```
Name: FRONTEND_URL
Value: https://school-management-system.vercel.app
```

### Step 7: Redeploy Backend
```
After adding all variables:
1. Look for "Redeploy" button (top right)
2. Click it
3. Wait 2-3 minutes for deployment
```

### Step 8: Check Logs
```
1. Click "Logs" tab
2. Look for: "Connected to MySQL database"
3. If you see this, it's working! ✅
```

### Step 9: Test Frontend
```
1. Open: https://school-management-system.vercel.app
2. Login with:
   Username: admin
   Password: Admin@123
3. You should see admin dashboard
```

---

## Quick Checklist

- [ ] Opened Render dashboard
- [ ] Clicked school-management-backend-gnav
- [ ] Clicked "Environment" tab
- [ ] Removed old Railway variables
- [ ] Added DB_HOST=localhost
- [ ] Added DB_USER=root
- [ ] Added DB_PASSWORD=(empty)
- [ ] Added DB_NAME=school_management
- [ ] Added NODE_ENV=production
- [ ] Added JWT_SECRET=your_super_secret_jwt_key_123_change_in_production
- [ ] Added FRONTEND_URL=https://school-management-system.vercel.app
- [ ] Clicked "Redeploy"
- [ ] Waited 2-3 minutes
- [ ] Checked logs for "Connected to MySQL database"
- [ ] Tested login at frontend

---

## If You Get Stuck

1. Make sure you're on the "Environment" tab (not "Settings")
2. Make sure you click "Save" after entering each variable
3. Make sure you click "Redeploy" after adding all variables
4. Wait 2-3 minutes for deployment
5. Check logs for "Connected to MySQL database"

---

**This should take about 5 minutes total!**
