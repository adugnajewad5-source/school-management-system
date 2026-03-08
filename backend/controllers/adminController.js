const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
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
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'railway',
  port: parseInt(dbPort),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ==================== STUDENTS ====================

// Create pre-registered student with temporary password
exports.createPreRegisteredStudent = async (req, res) => {
  const { name, class: studentClass, age, parent_phone } = req.body;
  
  try {
    // Generate student ID with 3 digits (100-999)
    const studentId = `STU-${Math.floor(100 + Math.random() * 900)}`;
    
    // Generate temporary password: First 4 letters of name (capitalized) + @ + student ID number
    // Example: "Lami" with ID "STU-456" -> "Lami@456"
    const namePrefix = name.substring(0, 4).charAt(0).toUpperCase() + name.substring(1, 4).toLowerCase();
    const idNumber = studentId.split('-')[1]; // Get the number part (e.g., "456")
    const tempPassword = `${namePrefix}@${idNumber}`;
    
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);
    
    // Email will be provided by student during registration
    await pool.execute(
      'INSERT INTO students (student_id, name, class, age, parent_phone, temp_password, is_registered) VALUES (?, ?, ?, ?, ?, ?, FALSE)',
      [studentId, name, studentClass || 'Not Assigned', age || null, parent_phone || null, hashedTempPassword]
    );
    
    res.status(201).json({
      message: 'Student pre-registered successfully',
      studentId,
      tempPassword,
      name
    });
  } catch (err) {
    console.error('Pre-registration error:', err);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const [students] = await pool.execute(`
      SELECT s.*, u.username, u.email 
      FROM students s 
      LEFT JOIN users u ON s.user_id = u.id
    `);
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, class: studentClass, age, parent_phone } = req.body;
  try {
    await pool.execute(
      'UPDATE students SET name = ?, class = ?, age = ?, parent_phone = ?, updatedAt = NOW() WHERE id = ?',
      [name, studentClass, age, parent_phone, id]
    );
    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    // ON DELETE CASCADE clears student/teacher tables
    await pool.execute('DELETE FROM users WHERE id = ?', [user_id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== TEACHERS ====================

exports.getTeachers = async (req, res) => {
  try {
    const [teachers] = await pool.execute(`
      SELECT t.*, u.username, u.email 
      FROM teachers t 
      JOIN users u ON t.user_id = u.id
    `);
    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTeacher = async (req, res) => {
  const { id } = req.params;
  const { name, subject } = req.body;
  try {
    await pool.execute(
      'UPDATE teachers SET name = ?, subject = ?, updatedAt = NOW() WHERE id = ?',
      [name, subject, id]
    );
    res.json({ message: 'Teacher updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== PAYMENTS ====================

exports.getPayments = async (req, res) => {
  try {
    const [payments] = await pool.execute(`
      SELECT p.*, s.name as student_name, s.student_id as student_ref 
      FROM payments p 
      JOIN students s ON p.student_id = s.id
      ORDER BY p.id DESC
    `);
    res.json(payments);
  } catch (err) {
    console.error('getPayments error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addPayment = async (req, res) => {
  const { student_id, amount, date } = req.body;
  try {
    let dbStudentId = student_id;
    if (typeof student_id === 'string' && student_id.startsWith('STU-')) {
      const [stu] = await pool.execute('SELECT id FROM students WHERE student_id = ?', [student_id]);
      if (stu.length === 0) return res.status(404).json({ message: 'Student not found' });
      dbStudentId = stu[0].id;
    }

    // Insert payment
    await pool.execute(
      'INSERT INTO payments (student_id, amount, date) VALUES (?, ?, ?)',
      [dbStudentId, amount, date]
    );
    
    res.json({ message: 'Payment recorded successfully' });
  } catch (err) {
    console.error('addPayment error:', err);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

exports.updatePayment = async (req, res) => {
  const { id } = req.params;
  const { amount, date } = req.body;
  try {
    await pool.execute(
      'UPDATE payments SET amount = ?, date = ? WHERE id = ?',
      [amount, date, id]
    );
    res.json({ message: 'Payment updated successfully' });
  } catch (err) {
    console.error('updatePayment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deletePayment = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM payments WHERE id = ?', [id]);
    res.json({ message: 'Payment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== REPORTS ====================

exports.getReports = async (req, res) => {
  try {
    const [studentCount] = await pool.execute('SELECT COUNT(*) as count FROM students');
    const [teacherCount] = await pool.execute('SELECT COUNT(*) as count FROM teachers');
    const [totalRevenue] = await pool.execute('SELECT SUM(amount) as total FROM payments');

    res.json({
      totalStudents: studentCount[0].count,
      totalTeachers: teacherCount[0].count,
      totalRevenue: totalRevenue[0].total || 0,
      attendanceRate: '94%'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== RESULTS ====================

// Get all results
exports.getResults = async (req, res) => {
  try {
    const [results] = await pool.execute(`
      SELECT r.*, s.student_id, s.name as student_name
      FROM results r
      JOIN students s ON r.student_id = s.id
      ORDER BY r.created_at DESC
    `);
    res.json(results);
  } catch (err) {
    console.error('getResults error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get results for a specific student
exports.getStudentResults = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Find student by studentId
    const [students] = await pool.execute(
      'SELECT id FROM students WHERE student_id = ?',
      [studentId]
    );
    
    if (students.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const dbStudentId = students[0].id;
    
    // Get results for this student
    const [results] = await pool.execute(`
      SELECT r.*, s.student_id, s.name as student_name
      FROM results r
      JOIN students s ON r.student_id = s.id
      WHERE r.student_id = ?
      ORDER BY r.created_at DESC
    `, [dbStudentId]);
    
    res.json(results);
  } catch (err) {
    console.error('getStudentResults error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add new result (marks) or update if already exists
exports.addResult = async (req, res) => {
  const { studentId, subject, marks } = req.body;
  
  try {
    // Validate input
    if (!studentId || !subject || marks === undefined) {
      return res.status(400).json({ 
        message: 'Missing required fields: studentId, subject, marks' 
      });
    }

    if (marks < 0 || marks > 100) {
      return res.status(400).json({ 
        message: 'Marks must be between 0 and 100' 
      });
    }

    // Find student by their unique studentId (e.g., "STU-001")
    const [students] = await pool.execute(
      'SELECT id, name FROM students WHERE student_id = ?',
      [studentId]
    );
    
    if (students.length === 0) {
      return res.status(404).json({ 
        message: `Student with ID "${studentId}" not found in database` 
      });
    }
    
    const student = students[0];
    const dbStudentId = student.id; // This is the database primary key
    
    // Check if result already exists for this student and subject
    const [existing] = await pool.execute(
      'SELECT id, marks FROM results WHERE student_id = ? AND subject = ?',
      [dbStudentId, subject]
    );
    
    const grade = getGrade(marks);
    const notificationTitle = `Marks Updated: ${subject}`;
    const notificationMessage = `Your marks for ${subject} have been updated: ${marks}/100 (Grade: ${grade})`;
    
    if (existing.length > 0) {
      // Update existing result
      const oldMarks = existing[0].marks;
      await pool.execute(
        'UPDATE results SET marks = ?, updated_at = NOW() WHERE id = ?',
        [marks, existing[0].id]
      );
      
      // Send notification about the update
      await pool.execute(
        'INSERT INTO notifications (student_id, type, title, message, data) VALUES (?, ?, ?, ?, ?)',
        [
          dbStudentId,
          'marks',
          notificationTitle,
          notificationMessage,
          JSON.stringify({ subject, marks, grade, oldMarks })
        ]
      );
      
      res.status(200).json({ 
        message: 'Result updated successfully and notification sent to student',
        studentName: student.name,
        studentId: studentId,
        subject: subject,
        marks: marks,
        previousMarks: oldMarks,
        action: 'updated'
      });
    } else {
      // Insert new result using the database student ID
      await pool.execute(
        'INSERT INTO results (student_id, subject, marks) VALUES (?, ?, ?)',
        [dbStudentId, subject, marks]
      );
      
      // Send notification about new marks
      const newNotificationTitle = `New Marks: ${subject}`;
      const newNotificationMessage = `Your marks for ${subject} have been published: ${marks}/100 (Grade: ${grade})`;
      
      await pool.execute(
        'INSERT INTO notifications (student_id, type, title, message, data) VALUES (?, ?, ?, ?, ?)',
        [
          dbStudentId,
          'marks',
          newNotificationTitle,
          newNotificationMessage,
          JSON.stringify({ subject, marks, grade })
        ]
      );
      
      res.status(201).json({ 
        message: 'Result added successfully and notification sent to student',
        studentName: student.name,
        studentId: studentId,
        subject: subject,
        marks: marks,
        action: 'created'
      });
    }
  } catch (err) {
    console.error('addResult error:', err);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

// Helper function to calculate grade
function getGrade(marks) {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B+';
  if (marks >= 60) return 'B';
  if (marks >= 50) return 'C';
  return 'F';
}

// Update existing result
exports.updateResult = async (req, res) => {
  const { id } = req.params;
  const { marks } = req.body;
  
  try {
    await pool.execute(
      'UPDATE results SET marks = ? WHERE id = ?',
      [marks, id]
    );
    res.json({ message: 'Result updated successfully' });
  } catch (err) {
    console.error('updateResult error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete result
exports.deleteResult = async (req, res) => {
  const { id } = req.params;
  
  try {
    await pool.execute('DELETE FROM results WHERE id = ?', [id]);
    res.json({ message: 'Result deleted successfully' });
  } catch (err) {
    console.error('deleteResult error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
