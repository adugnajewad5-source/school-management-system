# Student Pre-Registration System

## Overview
This system ensures that only students who have been pre-created by an admin can register in the system. This adds an extra layer of security and control over student registrations.

## How It Works

### For Admins:

1. **Pre-Register a Student**
   - Navigate to the Director Dashboard
   - Click on "Pre-Register Student"
   - Fill in the student details:
     - Name (required)
     - Class (optional)
     - Age (optional)
     - Parent Phone (optional)
   - Click "Create Student Record"
   - The system will generate:
     - A unique Student ID (e.g., STU-123456)
     - A temporary password (e.g., Stu@1234)
   - Copy and share these credentials with the student

2. **View Pre-Registered Students**
   - Go to "Manage Students" to see all students
   - Pre-registered students (not yet registered) will show as not having a user account

### For Students:

1. **Register with Pre-Created Account**
   - Go to the registration page
   - Select role: "Student"
   - Enter your details:
     - Full Name (must match exactly what admin entered)
     - Username (create your own)
     - Email (your email address)
     - Temporary Password (provided by admin)
     - New Secure Password (create a strong password)
   - The system will:
     - Verify your name exists in pre-registered records
     - Validate the temporary password
     - Create your user account
     - Link it to your student record

2. **Registration Requirements**
   - Your name must be pre-created by an admin
   - You must have the correct temporary password
   - Your new password must meet security requirements:
     - At least 8 characters
     - 1 uppercase letter
     - 1 lowercase letter
     - 1 number
     - 1 special character (@#$!)
     - Cannot be the same as username

## Database Changes

The `students` table now includes:
- `temp_password`: Hashed temporary password for registration
- `is_registered`: Boolean flag indicating if student has completed registration
- `user_id`: Can be NULL for pre-registered students

## API Endpoints

### Pre-Register Student (Admin Only)
```
POST /api/admin/students/pre-register
Authorization: Bearer <admin_token>

Body:
{
  "name": "John Doe",
  "class": "Grade 10-A",
  "age": 15,
  "parent_phone": "+1234567890"
}

Response:
{
  "message": "Student pre-registered successfully",
  "studentId": "STU-123456",
  "tempPassword": "Stu@1234",
  "name": "John Doe"
}
```

### Student Registration
```
POST /api/auth/register

Body:
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "MySecure@123",
  "role": "student",
  "name": "John Doe",
  "tempPassword": "Stu@1234"
}

Response:
{
  "message": "Student registered successfully",
  "studentId": "STU-123456"
}
```

## Migration

To update an existing database, run:
```bash
mysql -u root -p < database/add_student_preregistration.sql
```

Or manually execute the SQL commands in `database/add_student_preregistration.sql`

## Security Features

1. **Name Matching**: Student name must exactly match the pre-registered record
2. **Temporary Password**: Must provide the correct temporary password from admin
3. **One-Time Use**: Once registered, the temporary password is cleared
4. **Strong Password**: New password must meet all security requirements
5. **Registration Flag**: Prevents duplicate registrations

## Error Messages

- "Registration not allowed. Admin must create your student record first." - Name not found in pre-registered records
- "Invalid temporary password" - Temporary password doesn't match
- "Username or Email already exists" - Credentials already in use
- Password validation errors - New password doesn't meet requirements
