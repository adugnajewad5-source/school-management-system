# 🔧 Fix Railway Database Error

Your backend is showing:
```
Error connecting to MySQL: Error: getaddrinfo ENOTFOUND mysql.railway.internal
```

This means the database host `mysql.railway.internal` is not found. You have 2 options:

## Option 1: Use Local MySQL (EASIEST - Recommended)

### Step 1: Install XAMPP
1. Download: https://www.apachefriends.org/download.html
2. Install and run XAMPP
3. Start MySQL from XAMPP Control Panel

### Step 2: Create Database
1. Open: http://localhost/phpmyadmin
2. Create database: `school_management`
3. Import schema from: `database/schema.sql`

### Step 3: Update Render Environment Variables
1. Go to: https://dashboard.render.com
2. Click: `school-management-backend-gnav`
3. Click: "Environment" tab
4. **REMOVE** these variables (if they exist):
   - `DB_HOST=mysql.railway.internal`
   - Any Railway-related variables

5. **ADD** these variables:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=(leave empty if no password)
   DB_NAME=school_management
   NODE_ENV=production
   ```

6. Click: "Redeploy"
7. Wait 2-3 minutes
8. Check logs for: "Connected to MySQL database"

---

## Option 2: Fix Railway Database

If you want to use Railway:

### Step 1: Create Railway Database
1. Go to: https://railway.app
2. Create new project
3. Add MySQL database
4. Copy the connection credentials

### Step 2: Update Render Environment Variables
1. Go to: https://dashboard.render.com
2. Click: `school-management-backend-gnav`
3. Click: "Environment" tab
4. Update these variables with Railway credentials:
   ```
   DB_HOST=(Railway host)
   DB_USER=(Railway user)
   DB_PASSWORD=(Railway password)
   DB_NAME=(Railway database name)
   NODE_ENV=production
   ```

5. Click: "Redeploy"
6. Wait 2-3 minutes

---

## Recommended: Use Option 1 (Local MySQL)

✅ Easiest
✅ Fastest
✅ Works immediately
✅ No waiting for Railway

Just follow Option 1 above!

---

## After Fixing

1. Check Render logs for: "Connected to MySQL database"
2. Refresh frontend: https://school-management-system.vercel.app
3. Login with: admin / Admin@123

Your system will work! 🚀
