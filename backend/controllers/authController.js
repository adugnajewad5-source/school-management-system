const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Parse database host - handle both full URL and domain-only formats
let dbHost = process.env.DB_HOST || 'localhost';
let dbPort = process.env.DB_PORT || 3306;

// If DB_HOST contains a full connection string, extract just the domain
if (dbHost.includes('://')) {
  // Extract domain from URL like: mysql://user:pass@domain:port/db
  const urlMatch = dbHost.match(/@([^:]+):(\d+)/);
  if (urlMatch) {
    dbHost = urlMatch[1];
    dbPort = urlMatch[2];
  }
}

const pool = mysql.createPool({
  host: dbHost,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(dbPort),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Password Validation Helper
const validatePassword = (password, username) => {
  const rule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!]).{8,}$/;
  if (!rule.test(password)) return { valid: false, message: "Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@#$!)." };
  if (password === username) return { valid: false, message: "Password cannot be the same as the username." };
  return { valid: true };
};

exports.register = async (req, res) => {
  const { username, email, password, role, name, class: studentClass, age, parent_phone, subject, tempPassword, studentIds } = req.body;

  try {
    // STUDENT REGISTRATION: Must be pre-created by admin
    if (role === 'student') {
      // 1. Check if student exists in pre-registered records
      const [preRegisteredStudent] = await pool.execute(
        'SELECT * FROM students WHERE name = ? AND is_registered = FALSE',
        [name]
      );

      if (preRegisteredStudent.length === 0) {
        return res.status(403).json({ 
          message: 'Registration not allowed. Admin must create your student record first.' 
        });
      }

      const studentRecord = preRegisteredStudent[0];

      // 2. Verify temporary password
      const isTempPasswordValid = await bcrypt.compare(tempPassword, studentRecord.temp_password);
      if (!isTempPasswordValid) {
        return res.status(400).json({ message: 'Invalid temporary password' });
      }

      // 3. Validate new password
      const passValidation = validatePassword(password, username);
      if (!passValidation.valid) {
        return res.status(400).json({ message: passValidation.message });
      }

      // 4. Check for existing user
      const [existingUser] = await pool.execute('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'Username or Email already exists' });
      }

      // 5. Create user account
      const hashedPassword = await bcrypt.hash(password, 10);
      const [userResult] = await pool.execute(
        'INSERT INTO users (username, email, password_hash, role, must_change_password) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, role, 0]
      );

      const userId = userResult.insertId;

      // 6. Link user to student record and mark as registered
      await pool.execute(
        'UPDATE students SET userId = ?, is_registered = TRUE, temp_password = NULL WHERE id = ?',
        [userId, studentRecord.id]
      );

      return res.status(201).json({
        message: 'Student registered successfully',
        studentId: studentRecord.studentId
      });
    }

    // PARENT REGISTRATION: Admin-created or self-registration
    if (role === 'parent') {
      // 1. Validate email uniqueness across all users
      const [existingUser] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // 2. Check username uniqueness
      const [existingUsername] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
      if (existingUsername.length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // 3. Determine password (admin-created gets temp password, self-registration uses provided password)
      let finalPassword = password;
      let isAdminCreated = false;
      
      if (!password) {
        // Admin is creating the account - generate temporary password
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        finalPassword = `Par@${randomDigits}`;
        isAdminCreated = true;
        console.log(`[ADMIN ACTION] Generated temporary password for parent ${username}: ${finalPassword}`);
      }

      // 4. Validate password complexity (min 8 chars, uppercase, lowercase, number)
      const passValidation = validatePassword(finalPassword, username);
      if (!passValidation.valid) {
        return res.status(400).json({ message: passValidation.message });
      }

      // 5. Create parent user account
      const hashedPassword = await bcrypt.hash(finalPassword, 10);
      const mustChange = isAdminCreated ? 1 : 0; // Set must_change_password flag for admin-created accounts
      
      const [userResult] = await pool.execute(
        'INSERT INTO users (username, email, password_hash, role, must_change_password) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, role, mustChange]
      );

      const parentId = userResult.insertId;

      // 6. Link parent to students if studentIds provided (admin-created accounts)
      if (studentIds && Array.isArray(studentIds) && studentIds.length > 0) {
        // Verify all student IDs exist
        const placeholders = studentIds.map(() => '?').join(',');
        const [students] = await pool.execute(
          `SELECT id FROM students WHERE id IN (${placeholders})`,
          studentIds
        );

        if (students.length !== studentIds.length) {
          // Rollback user creation if invalid student IDs
          await pool.execute('DELETE FROM users WHERE id = ?', [parentId]);
          return res.status(400).json({ message: 'One or more student IDs are invalid' });
        }

        // Create parent-student associations
        for (const studentId of studentIds) {
          await pool.execute(
            'INSERT INTO parent_students (parent_id, student_id, relationship) VALUES (?, ?, ?)',
            [parentId, studentId, 'parent']
          );
        }
      } else if (isAdminCreated) {
        // Admin-created accounts must have at least one associated student
        await pool.execute('DELETE FROM users WHERE id = ?', [parentId]);
        return res.status(400).json({ message: 'At least one student must be associated with the parent account' });
      }

      return res.status(201).json({
        message: 'Parent registered successfully',
        tempPassword: isAdminCreated ? finalPassword : null,
        parentId: parentId
      });
    }

    // TEACHER/ADMIN REGISTRATION (Original flow)
    let finalPassword = password;
    if (role !== 'admin' && !password) {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const prefix = role.charAt(0).toUpperCase() + role.slice(1, 3);
      finalPassword = `${prefix}@${randomDigits}`;
      console.log(`[ADMIN ACTION] Generated temporary password for ${username}: ${finalPassword}`);
    }

    const passValidation = validatePassword(finalPassword, username);
    if (!passValidation.valid) {
      return res.status(400).json({ message: passValidation.message });
    }

    const [existingUser] = await pool.execute('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(finalPassword, 10);
    const mustChange = role !== 'admin' ? 1 : 0;

    const [userResult] = await pool.execute(
      'INSERT INTO users (username, email, password_hash, role, must_change_password) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, role, mustChange]
    );

    const userId = userResult.insertId;

    if (role === 'teacher') {
      const teacherId = `TEA-${Math.floor(100000 + Math.random() * 900000)}`;
      await pool.execute(
        'INSERT INTO teachers (teacherId, userId, name, subject, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [teacherId, userId, name, subject || null]
      );
    }

    res.status(201).json({
      message: 'User registered successfully',
      tempPassword: role !== 'admin' && !password ? finalPassword : null
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Allow logging in with either username or email inside the "Username" field
    const [users] = await pool.execute('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Security: Check if account is locked (15 minute lockout)
    if (user.locked_at && new Date() - new Date(user.locked_at) < 15 * 60 * 1000) {
      return res.status(403).json({ message: 'Account locked due to multiple failed login attempts. Please try again in 15 minutes.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      // Security: Limit Login Attempts (5 failed attempts within 15 minutes)
      const newFailedAttempts = user.failed_attempts + 1;
      if (newFailedAttempts >= 5) {
        await pool.execute('UPDATE users SET failed_attempts = 0, locked_at = NOW() WHERE id = ?', [user.id]);
        return res.status(403).json({ message: 'Account locked due to 5 failed login attempts. Please try again in 15 minutes.' });
      } else {
        await pool.execute('UPDATE users SET failed_attempts = ? WHERE id = ?', [newFailedAttempts, user.id]);
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    }

    // Success: Reset failed attempts
    await pool.execute('UPDATE users SET failed_attempts = 0, locked_at = NULL WHERE id = ?', [user.id]);

    // Set token expiration based on role (24 hours for parents, 10 minutes for others)
    const tokenExpiration = user.role === 'parent' ? '24h' : '10m';

    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role, 
        username: user.username, 
        parent_id: user.role === 'parent' ? user.id : undefined,
        password_changed_at: user.password_changed_at ? new Date(user.password_changed_at).getTime() : null
      },
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiration }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        mustChange: user.must_change_password
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    // Fetch user to verify current password
    const [users] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // Verify current password (skip if must_change_password is true - first login)
    if (!user.must_change_password) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required' });
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
    }

    // Validate new password complexity
    const passValidation = validatePassword(newPassword, req.user.username);
    if (!passValidation.valid) {
      return res.status(400).json({ message: passValidation.message });
    }

    // Update password, clear must_change_password flag, and update password_changed_at
    // This invalidates all existing JWT tokens issued before this timestamp
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      'UPDATE users SET password_hash = ?, must_change_password = FALSE, password_changed_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedPassword, userId]
    );

    res.json({ 
      message: 'Password updated successfully. Please log in again with your new password.',
      requiresRelogin: true 
    });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
