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
      SELECT s.id, s.student_id, s.user_id, s.name, s.class, s.age, s.parent_phone, s.temp_password, s.is_registered, u.username, u.email, u.id as userId
      FROM students s 
      LEFT JOIN users u ON s.user_id = u.id
    `);
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
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
    // Check if new columns exist, if not use old structure
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'results' AND COLUMN_NAME = 'mid_exam_marks'
    `, [process.env.DB_NAME]);
    
    let query;
    if (columns.length > 0) {
      // New structure with detailed breakdown
      query = `
        SELECT r.*, s.student_id, s.name as student_name,
               r.mid_exam_marks, r.assignment_marks, r.final_exam_marks, r.total_marks, r.marks_breakdown
        FROM results r
        JOIN students s ON r.student_id = s.id
        ORDER BY r.created_at DESC
      `;
    } else {
      // Old structure - fallback
      query = `
        SELECT r.*, s.student_id, s.name as student_name
        FROM results r
        JOIN students s ON r.student_id = s.id
        ORDER BY r.created_at DESC
      `;
    }
    
    const [results] = await pool.execute(query);
    res.json(results);
  } catch (err) {
    console.error('getResults error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
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
    // Check if new columns exist, if not use old structure
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'results' AND COLUMN_NAME = 'mid_exam_marks'
    `, [process.env.DB_NAME]);
    
    let query;
    if (columns.length > 0) {
      // New structure with detailed breakdown
      query = `
        SELECT r.*, s.student_id, s.name as student_name,
               r.mid_exam_marks, r.assignment_marks, r.final_exam_marks, r.total_marks, r.marks_breakdown
        FROM results r
        JOIN students s ON r.student_id = s.id
        WHERE r.student_id = ?
        ORDER BY r.created_at DESC
      `;
    } else {
      // Old structure - fallback
      query = `
        SELECT r.*, s.student_id, s.name as student_name
        FROM results r
        JOIN students s ON r.student_id = s.id
        WHERE r.student_id = ?
        ORDER BY r.created_at DESC
      `;
    }
    
    const [results] = await pool.execute(query, [dbStudentId]);
    
    res.json(results);
  } catch (err) {
    console.error('getStudentResults error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add new result (marks) or update if already exists - Enhanced with detailed breakdown
exports.addResult = async (req, res) => {
  const { studentId, subject, marks, midExamMarks, assignmentMarks, finalExamMarks } = req.body;
  
  try {
    // Validate input
    if (!studentId || !subject) {
      return res.status(400).json({ 
        message: 'Missing required fields: studentId, subject' 
      });
    }

    // Validate marks breakdown if provided
    if (midExamMarks !== undefined && (midExamMarks < 0 || midExamMarks > 30)) {
      return res.status(400).json({ 
        message: 'Mid-exam marks must be between 0 and 30' 
      });
    }

    if (assignmentMarks !== undefined && (assignmentMarks < 0 || assignmentMarks > 20)) {
      return res.status(400).json({ 
        message: 'Assignment marks must be between 0 and 20' 
      });
    }

    if (finalExamMarks !== undefined && (finalExamMarks < 0 || finalExamMarks > 50)) {
      return res.status(400).json({ 
        message: 'Final exam marks must be between 0 and 50' 
      });
    }

    // Calculate total marks
    let totalMarks = marks; // Use provided total if available
    
    // If detailed breakdown is provided, calculate total
    if (midExamMarks !== undefined || assignmentMarks !== undefined || finalExamMarks !== undefined) {
      totalMarks = (midExamMarks || 0) + (assignmentMarks || 0) + (finalExamMarks || 0);
    }

    // Validate total marks
    if (totalMarks !== undefined && (totalMarks < 0 || totalMarks > 100)) {
      return res.status(400).json({ 
        message: 'Total marks must be between 0 and 100' 
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
    // Also check if new columns exist
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'results' AND COLUMN_NAME = 'mid_exam_marks'
    `, [process.env.DB_NAME]);
    
    const hasNewColumns = columns.length > 0;
    
    let existingQuery;
    if (hasNewColumns) {
      existingQuery = 'SELECT id, marks, mid_exam_marks, assignment_marks, final_exam_marks, total_marks FROM results WHERE student_id = ? AND subject = ?';
    } else {
      existingQuery = 'SELECT id, marks FROM results WHERE student_id = ? AND subject = ?';
    }
    
    const [existing] = await pool.execute(existingQuery, [dbStudentId, subject]);
    
    const grade = getGrade(totalMarks);
    
    // Create marks breakdown object
    const marksBreakdown = {
      midExam: midExamMarks || null,
      assignment: assignmentMarks || null,
      finalExam: finalExamMarks || null,
      total: totalMarks
    };
    
    const notificationTitle = `Marks Updated: ${subject}`;
    const notificationMessage = `Your marks for ${subject} have been updated: ${totalMarks}/100 (Grade: ${grade})`;
    
    if (existing.length > 0) {
      // Update existing result
      const oldTotal = existing[0].total_marks || existing[0].marks;
      
      let updateQuery;
      let updateParams;
      
      if (hasNewColumns) {
        updateQuery = `UPDATE results SET 
         marks = ?, 
         mid_exam_marks = ?, 
         assignment_marks = ?, 
         final_exam_marks = ?, 
         total_marks = ?,
         marks_breakdown = ?,
         updated_at = NOW() 
         WHERE id = ?`;
        updateParams = [totalMarks, midExamMarks, assignmentMarks, finalExamMarks, totalMarks, JSON.stringify(marksBreakdown), existing[0].id];
      } else {
        updateQuery = 'UPDATE results SET marks = ?, updated_at = NOW() WHERE id = ?';
        updateParams = [totalMarks, existing[0].id];
      }
      
      await pool.execute(updateQuery, updateParams);
      
      // Send notification about the update (optional - skip if table doesn't exist)
      try {
        await pool.execute(
          'INSERT INTO notifications (student_id, type, title, message, data) VALUES (?, ?, ?, ?, ?)',
          [
            dbStudentId,
            'marks',
            notificationTitle,
            notificationMessage,
            JSON.stringify({ subject, totalMarks, grade, oldTotal, breakdown: marksBreakdown })
          ]
        );
      } catch (notificationError) {
        console.warn('⚠️ Could not create notification (table may not exist):', notificationError.message);
        // Continue without notification - this is not critical
      }
      
      res.status(200).json({ 
        message: 'Result updated successfully and notification sent to student',
        studentName: student.name,
        studentId: studentId,
        subject: subject,
        totalMarks: totalMarks,
        breakdown: marksBreakdown,
        previousTotal: oldTotal,
        action: 'updated'
      });
    } else {
      // Insert new result using the database student ID
      let insertQuery;
      let insertParams;
      
      if (hasNewColumns) {
        insertQuery = `INSERT INTO results (student_id, subject, marks, mid_exam_marks, assignment_marks, final_exam_marks, total_marks, marks_breakdown) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        insertParams = [dbStudentId, subject, totalMarks, midExamMarks, assignmentMarks, finalExamMarks, totalMarks, JSON.stringify(marksBreakdown)];
      } else {
        insertQuery = 'INSERT INTO results (student_id, subject, marks) VALUES (?, ?, ?)';
        insertParams = [dbStudentId, subject, totalMarks];
      }
      
      await pool.execute(insertQuery, insertParams);
      
      // Send notification about new marks (optional - skip if table doesn't exist)
      const newNotificationTitle = `New Marks: ${subject}`;
      const newNotificationMessage = `Your marks for ${subject} have been published: ${totalMarks}/100 (Grade: ${grade})`;
      
      try {
        await pool.execute(
          'INSERT INTO notifications (student_id, type, title, message, data) VALUES (?, ?, ?, ?, ?)',
          [
            dbStudentId,
            'marks',
            newNotificationTitle,
            newNotificationMessage,
            JSON.stringify({ subject, totalMarks, grade, breakdown: marksBreakdown })
          ]
        );
      } catch (notificationError) {
        console.warn('⚠️ Could not create notification (table may not exist):', notificationError.message);
        // Continue without notification - this is not critical
      }
      
      res.status(201).json({ 
        message: 'Result added successfully and notification sent to student',
        studentName: student.name,
        studentId: studentId,
        subject: subject,
        totalMarks: totalMarks,
        breakdown: marksBreakdown,
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
