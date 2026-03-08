# 🔧 Use Local MySQL Instead of PlanetScale

If PlanetScale is not working, you can use a local MySQL database on your computer instead. This is actually simpler!

## Step 1: Install MySQL (If Not Already Installed)

### Windows:
1. Download: https://dev.mysql.com/downloads/mysql/
2. Choose: "MySQL Community Server"
3. Download the installer
4. Run the installer
5. Follow the installation steps
6. Remember your password (or leave it empty)

### Or Use XAMPP (Easier):
1. Download: https://www.apachefriends.org/download.html
2. Choose: XAMPP for Windows
3. Run the installer
4. Click: "Next" through all steps
5. Start XAMPP Control Panel
6. Click: "Start" next to Apache and MySQL

---

## Step 2: Create Database

### Using Command Line:
1. Open Command Prompt
2. Type: `mysql -u root -p`
3. Press Enter
4. Enter password (or just press Enter if no password)
5. Type: `CREATE DATABASE school_management;`
6. Press Enter
7. Type: `USE school_management;`
8. Press Enter

### Or Using phpMyAdmin (Easier):
1. Open: http://localhost/phpmyadmin
2. Click: "New" (left sidebar)
3. Enter database name: `school_management`
4. Click: "Create"

---

## Step 3: Import Schema

### Using Command Line:
1. Open Command Prompt
2. Navigate to your project folder
3. Type: `mysql -u root -p school_management < database/schema.sql`
4. Press Enter
5. Enter password (or just press Enter)

### Or Using phpMyAdmin:
1. Open: http://localhost/phpmyadmin
2. Click: `school_management` database
3. Click: "Import" tab
4. Click: "Choose File"
5. Select: `database/schema.sql`
6. Click: "Import"

---

## Step 4: Get Your Local Credentials

Your local MySQL credentials are:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=(your password, or empty if no password)
DB_NAME=school_management
DB_PORT=3306
```

---

## Step 5: Set on Render

1. Go to: https://dashboard.render.com
2. Click: `school-management-backend-gnav`
3. Click: "Environment" tab
4. Add these variables:
   ```
   DB_HOST=your-computer-ip
   DB_USER=root
   DB_PASSWORD=(your MySQL password)
   DB_NAME=school_management
   DB_PORT=3306
   NODE_ENV=production
   ```

**Important:** Replace `your-computer-ip` with your actual computer IP address.

### How to Find Your Computer IP:
1. Open Command Prompt
2. Type: `ipconfig`
3. Press Enter
4. Look for: "IPv4 Address"
5. Copy that IP (looks like: 192.168.1.100)

---

## Step 6: Redeploy and Test

1. Click: "Redeploy" on Render
2. Wait 2-3 minutes
3. Check logs for: "Connected to MySQL database"
4. Test login at: https://school-management-system.vercel.app

---

## Advantages of Local MySQL

✅ No need for PlanetScale account
✅ Works offline
✅ Faster for development
✅ Free
✅ Easy to set up

## Disadvantages

❌ Only works if your computer is running
❌ Not suitable for production
❌ Slower than cloud database

---

## If You Want to Go Back to PlanetScale Later

Once PlanetScale is working again:
1. Get the credentials from PlanetScale
2. Update the environment variables on Render
3. Redeploy

---

**Try this approach if PlanetScale is not working!**
