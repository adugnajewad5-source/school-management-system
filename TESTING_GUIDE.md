# Testing Guide - Student Pre-Registration System

## ✅ System Status
- Database migration completed
- Backend server restarted with new password format
- Frontend running

## 🔧 What Was Fixed

### 1. Database Issue
- ✅ Added `temp_password` column to students table
- ✅ Added `is_registered` column to students table
- ✅ Updated existing students to mark as registered

### 2. Password Format Changed
**Old Format:** `Stu@1234` (random 4 digits)

**New Format:** `[First4LettersOfName]@[Last3DigitsOfStudentID]`

**Examples:**
- Student: "Lami" with ID "STU-123456" → Password: `Lami@456`
- Student: "John" with ID "STU-789012" → Password: `John@012`
- Student: "Alexander" with ID "STU-555888" → Password: `Alex@888`

**Format Rules:**
- First letter is capitalized
- Next 3 letters are lowercase
- @ symbol separator
- Last 3 digits of the student ID

## 🧪 How to Test

### Step 1: Login as Admin
1. Go to http://localhost:5173/
2. Login with:
   - Username: `admin`
   - Password: `Adugna@12345`

### Step 2: Pre-Register a Student
1. Click "Pre-Register Student" from Director Dashboard
2. Fill in the form:
   - **Name:** Lami (or any name)
   - **Class:** Grade 10-A
   - **Age:** 15
   - **Parent Phone:** +1234567890
3. Click "Create Student Record"
4. You should see:
   - ✅ Success message
   - Student ID (e.g., STU-123456)
   - Temporary Password (e.g., Lami@456)
   - Copy button to copy the password

### Step 3: Test Student Registration
1. Logout from admin account
2. Go to registration page
3. Select role: "Student"
4. Fill in:
   - **Full Name:** Lami (must match exactly)
   - **Username:** lami123 (create your own)
   - **Email:** lami@example.com
   - **Temporary Password:** Lami@456 (from admin)
   - **New Secure Password:** Create a strong password (e.g., MyPass@123)
5. Click "Register Account"
6. Should see success message

### Step 4: Login as Student
1. Go to login page
2. Login with:
   - Username: lami123
   - Password: MyPass@123 (the new password you created)
3. Should be redirected to Student Dashboard

## 🐛 Troubleshooting

### Error: "Unknown column 'is_registered'"
**Solution:** Run the migration script
```bash
cd backend
node migrate_student_table.js
```

### Error: "Registration not allowed"
**Possible causes:**
1. Student name doesn't match exactly (case-sensitive)
2. Student hasn't been pre-registered by admin
3. Student already registered (is_registered = TRUE)

### Error: "Invalid temporary password"
**Possible causes:**
1. Wrong password entered
2. Password format doesn't match
3. Student ID changed after password was generated

## 📊 Database Verification

To check if a student is pre-registered:
```sql
SELECT id, studentId, name, is_registered, 
       CASE WHEN temp_password IS NOT NULL THEN 'Has temp password' ELSE 'No temp password' END as password_status
FROM students 
WHERE name = 'Lami';
```

To see all pre-registered students:
```sql
SELECT studentId, name, class, is_registered 
FROM students 
WHERE is_registered = FALSE;
```

## 🔐 Security Features

1. **Name Matching:** Exact match required (case-sensitive)
2. **Temporary Password:** Hashed in database using bcrypt
3. **One-Time Use:** Temp password cleared after successful registration
4. **Registration Flag:** Prevents duplicate registrations
5. **Strong Password:** New password must meet all security requirements

## ✅ Expected Behavior

### Admin Creates Student
- Student record created with `is_registered = FALSE`
- Temporary password generated and hashed
- Student ID assigned
- Admin receives temp password to share

### Student Registers
- System validates name exists in pre-registered records
- System validates temporary password
- System validates new password meets requirements
- User account created
- Student record linked to user account
- `is_registered` set to TRUE
- `temp_password` cleared (set to NULL)

### Student Cannot Register Twice
- If `is_registered = TRUE`, registration will fail
- Error: "Registration not allowed"
