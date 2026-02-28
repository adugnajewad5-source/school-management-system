# 🗄️ Database Setup Guide

## Local Development Configuration

Your `backend/.env` file is already configured with these settings:

```env
# Database Configuration (Local Development)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=school_management
DB_PORT=3306
```

### What These Mean:

- **DB_HOST**: `localhost` - Your local MySQL server
- **DB_USER**: `root` - Default MySQL username
- **DB_PASSWORD**: `` (empty) - Default has no password
- **DB_NAME**: `school_management` - Your database name
- **DB_PORT**: `3306` - Default MySQL port

---

## 📋 Setup Steps

### Step 1: Make Sure MySQL is Running

**Check if MySQL is running:**
```bash
# Windows
services.msc
# Look for "MySQL" service and make sure it's running
```

Or open MySQL Workbench and try to connect.

### Step 2: Create the Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE school_management;
```

### Step 3: Import the Schema

**Option A: Using Command Line**
```bash
mysql -u root -p school_management < database/schema.sql
```
(Press Enter when asked for password if you don't have one)

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your local server
3. Click "File" → "Run SQL Script"
4. Select `database/schema.sql`
5. Click "Run"

### Step 4: Verify Database Setup

Run this query to check tables:
```sql
USE school_management;
SHOW TABLES;
```

You should see 12 tables:
- users
- students
- teachers
- parents
- results
- attendance
- payments
- submissions
- timetable
- notifications
- student_preregistration
- parent_students

---

## 🔐 If You Have a MySQL Password

If your MySQL root user has a password, update `backend/.env`:

```env
DB_PASSWORD=your_mysql_password_here
```

---

## 🌐 Production Database (For Deployment)

When deploying to production, you'll need a cloud database. Here are your options:

### Option 1: PlanetScale (Recommended - Free Tier)

1. **Sign up**: https://planetscale.com
2. **Create database**: `school-management`
3. **Get connection details**:
   - Click "Connect"
   - Select "Node.js"
   - Copy the connection details

4. **Update Render environment variables**:
   ```
   DB_HOST=aws.connect.psdb.cloud
   DB_USER=your_planetscale_user
   DB_PASSWORD=your_planetscale_password
   DB_NAME=school-management
   DB_PORT=3306
   ```

### Option 2: Railway (Easy Setup)

1. **Sign up**: https://railway.app
2. **Create MySQL database**
3. **Copy connection details** from dashboard
4. **Update environment variables** in Render

### Option 3: AWS RDS (Production Grade)

1. **Go to**: https://aws.amazon.com/rds/
2. **Create MySQL instance**
3. **Configure security groups**
4. **Get endpoint and credentials**
5. **Update environment variables**

### Option 4: Aiven (Free Tier Available)

1. **Sign up**: https://aiven.io
2. **Create MySQL service**
3. **Get connection details**
4. **Update environment variables**

---

## 🔧 Common Issues & Solutions

### Issue 1: "Access denied for user 'root'@'localhost'"

**Solution**: Your root user has a password. Update `.env`:
```env
DB_PASSWORD=your_actual_password
```

### Issue 2: "Can't connect to MySQL server"

**Solutions**:
1. Make sure MySQL service is running
2. Check if MySQL is installed
3. Verify port 3306 is not blocked

### Issue 3: "Database 'school_management' doesn't exist"

**Solution**: Create the database:
```sql
CREATE DATABASE school_management;
```

### Issue 4: "Table doesn't exist"

**Solution**: Import the schema:
```bash
mysql -u root -p school_management < database/schema.sql
```

---

## 📊 Database Schema Overview

Your database includes these tables:

### Core Tables
- **users** - All system users (admin, teachers, students, parents)
- **students** - Student information
- **teachers** - Teacher information
- **parents** - Parent information

### Academic Tables
- **results** - Student marks and grades
- **attendance** - Attendance records
- **submissions** - Assignment submissions
- **timetable** - Class schedules

### Management Tables
- **payments** - Payment tracking
- **notifications** - System notifications
- **student_preregistration** - Pre-registration data
- **parent_students** - Parent-child relationships

---

## 🧪 Test Database Connection

Create a test file to verify connection:

**test-db-connection.js**
```javascript
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Database connected successfully!');
  
  connection.query('SHOW TABLES', (err, results) => {
    if (err) {
      console.error('❌ Query failed:', err.message);
    } else {
      console.log('📊 Tables in database:', results.length);
      results.forEach(row => {
        console.log('  -', Object.values(row)[0]);
      });
    }
    connection.end();
  });
});
```

Run it:
```bash
cd backend
node test-db-connection.js
```

---

## 🔒 Security Best Practices

### For Development
- ✅ Use `localhost` as DB_HOST
- ✅ Use `root` user is okay for local development
- ✅ Empty password is okay for local development

### For Production
- ✅ Use strong passwords (20+ characters)
- ✅ Create dedicated database user (not root)
- ✅ Use SSL/TLS for connections
- ✅ Whitelist only necessary IP addresses
- ✅ Regular backups (daily recommended)
- ✅ Use environment variables (never hardcode)

---

## 📝 Environment Variables Summary

### Local Development (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=school_management
DB_PORT=3306
```

### Production (Render Environment Variables)
```env
DB_HOST=your-production-db-host.com
DB_USER=your-production-db-user
DB_PASSWORD=your-strong-production-password
DB_NAME=school_management
DB_PORT=3306
```

---

## 🚀 Quick Start Commands

```bash
# 1. Create database
mysql -u root -p -e "CREATE DATABASE school_management;"

# 2. Import schema
mysql -u root -p school_management < database/schema.sql

# 3. Verify tables
mysql -u root -p school_management -e "SHOW TABLES;"

# 4. Start backend
cd backend
npm start
```

---

## 📞 Need Help?

### MySQL Not Installed?
- **Windows**: Download from https://dev.mysql.com/downloads/installer/
- **Mac**: `brew install mysql`
- **Linux**: `sudo apt-get install mysql-server`

### MySQL Workbench (GUI Tool)
- Download: https://dev.mysql.com/downloads/workbench/
- Easier than command line
- Visual database management

### Alternative: Use Docker
```bash
docker run --name mysql-school -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=school_management -p 3306:3306 -d mysql:8.0
```

Then update `.env`:
```env
DB_PASSWORD=password
```

---

## ✅ Checklist

Before starting the backend:

- [ ] MySQL is installed and running
- [ ] Database `school_management` created
- [ ] Schema imported (12 tables)
- [ ] `.env` file configured
- [ ] Connection tested successfully

---

## 🎯 Next Steps

1. ✅ Configure database (you're here!)
2. ⏳ Start backend: `cd backend && npm start`
3. ⏳ Start frontend: `cd frontend && npm run dev`
4. ⏳ Test login with admin credentials
5. ⏳ Push to GitHub
6. ⏳ Deploy to production

---

**Your current configuration is ready for local development!**

Just make sure MySQL is running and the database is created.
