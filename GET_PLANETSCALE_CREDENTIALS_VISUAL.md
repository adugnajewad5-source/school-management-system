# 🔑 Get PlanetScale Credentials - Visual Guide

I can see you're on PlanetScale. Let me help you get the database credentials.

## Option 1: If You Already Have a Database

### Step 1: Go to Your Databases
1. On the PlanetScale dashboard, look for **"Databases"** in the left sidebar
2. Click it
3. You should see a list of your databases
4. Look for: `school-management` database
5. Click on it

### Step 2: Get Connection String
1. You're now in the database details page
2. Click: **"Connect"** button (top right area)
3. A dialog appears with connection options
4. Select: **"Node.js"** from the dropdown
5. You'll see a connection string like:

```javascript
const connection = mysql.createConnection({
  host: 'aws.connect.psdb.cloud',
  user: 'xxxxxxxxxxxxx',
  password: 'pscale_pw_xxxxxxxxxxxxx',
  database: 'school-management'
});
```

### Step 3: Copy Your Credentials
From the connection string, copy:
- **DB_HOST** = `aws.connect.psdb.cloud`
- **DB_USER** = The `user` value
- **DB_PASSWORD** = The `password` value
- **DB_NAME** = `school-management`

---

## Option 2: If You Don't Have a Database Yet

### Step 1: Create a New Database
1. On PlanetScale dashboard, click: **"Create database"** button
2. Enter name: `school-management`
3. Select region: `us-east-1` (or your preferred region)
4. Click: **"Create database"** button
5. Wait for database to be created (1-2 minutes)

### Step 2: Import Schema
1. Once created, click on your database
2. Click: **"Branches"** tab
3. Click: **"main"** branch
4. Click: **"Import"** button
5. Copy and paste the SQL from: `database/schema.sql`
6. Click: **"Execute"** button

### Step 3: Get Connection String
1. Click: **"Connect"** button
2. Select: **"Node.js"**
3. Copy the credentials (see Option 1, Step 3)

---

## If PlanetScale Website is Not Loading

If https://app.planetscale.com is not working:

### Try These Alternatives:

1. **Clear Browser Cache**
   - Press: Ctrl + Shift + Delete
   - Select: "All time"
   - Click: "Clear data"
   - Refresh the page

2. **Try Different Browser**
   - Open: Chrome, Firefox, or Edge
   - Go to: https://app.planetscale.com
   - Try again

3. **Check Internet Connection**
   - Make sure you're connected to internet
   - Try opening: https://google.com
   - If that works, try PlanetScale again

4. **Try Incognito Mode**
   - Press: Ctrl + Shift + N (Chrome) or Ctrl + Shift + P (Firefox)
   - Go to: https://app.planetscale.com
   - Try again

5. **Wait and Retry**
   - PlanetScale might be having issues
   - Wait 5 minutes
   - Try again

---

## If You Still Can't Access PlanetScale

If the website is completely down, you have two options:

### Option A: Use Local MySQL (Temporary)
1. Set up local MySQL on your computer
2. Create database: `school-management`
3. Import schema from: `database/schema.sql`
4. Use these credentials on Render:
   ```
   DB_HOST=your-computer-ip
   DB_USER=root
   DB_PASSWORD=your-mysql-password
   DB_NAME=school-management
   ```

### Option B: Use Different Database Service
1. Try: https://railway.app (similar to PlanetScale)
2. Or: https://www.elephantsql.com (PostgreSQL)
3. Or: AWS RDS (Amazon database service)

---

## Quick Checklist

- [ ] Can access https://app.planetscale.com
- [ ] Found your `school-management` database
- [ ] Clicked "Connect" button
- [ ] Selected "Node.js"
- [ ] Copied DB_HOST, DB_USER, DB_PASSWORD
- [ ] Ready to set on Render

---

**Once you have the credentials, go to Render and set the environment variables!**
