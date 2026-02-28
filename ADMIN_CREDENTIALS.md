# Admin Login Credentials

## ✅ VERIFIED WORKING CREDENTIALS

**Username:** `admin`  
**Email:** `admin@school.com`  
**Password:** `Adugna@12345`

**Status:** ✅ Tested and working!

## 🌐 Access Your System

1. **Open your browser** and go to: **http://localhost:5173/**
2. Click on **"Login here"** or navigate to the login page
3. Enter:
   - **Username:** `admin`
   - **Password:** `Adugna@12345`
4. Click **"Login"**
5. You will be redirected to the **Director Dashboard**

## 🎯 What You Can Do Now

Once logged in as admin, you can:

1. **Pre-Register Students** (NEW FEATURE!)
   - Click "Pre-Register Student" from the dashboard
   - Enter student name, class, age, and parent phone
   - System generates a temporary password
   - Share the credentials with the student

2. **Manage Students**
   - View all students
   - Edit student information
   - Delete student records

3. **Manage Teachers**
   - Add, edit, or remove teachers
   - Assign subjects

4. **Financial Payments**
   - Record student payments
   - Track payment history

5. **System Reports**
   - View analytics and reports

6. **System Settings**
   - Configure system preferences

## Updating Admin Password

If you need to change the admin password in the future:

### Method 1: Using Node.js Script (Recommended)
```bash
cd backend
node create_admin.js
```

Edit the `backend/create_admin.js` file and change the `adminPassword` variable to your desired password, then run the script.

### Method 2: Through the Application
1. Login as admin
2. Go to Settings or Change Password page
3. Update your password through the UI

## Security Notes

- The password meets all security requirements:
  - ✅ At least 8 characters
  - ✅ Contains uppercase letter (A)
  - ✅ Contains lowercase letters (dugna)
  - ✅ Contains number (12345)
  - ✅ Contains special character (@)
  
- Change this password after first login if this is a production system
- Never share admin credentials
- The password is securely hashed using bcrypt in the database

## Admin Capabilities

As an admin, you can:
- Pre-register students with temporary passwords
- Manage all students and teachers
- View and manage payments
- Access system reports
- Configure system settings
- Create user accounts for teachers and parents
