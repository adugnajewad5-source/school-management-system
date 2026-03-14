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

// Get all results - Simplified approach
exports.getResults = async (req, res) => {
  try {
    const query = `
      SELECT r.*, s.student_id, s.name as student_name
      FROM results r
      JOIN students s ON r.student_id = s.id
      ORDER BY r.created_at DESC
    `;
    
    const [results] = await pool.execute(query);
    res.json(results);
  } catch (err) {
    console.error('getResults error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// Get results for a specific student - Simplified approach
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
    const query = `
      SELECT r.*, s.student_id, s.name as student_name
      FROM results r
      JOIN students s ON r.student_id = s.id
      WHERE r.student_id = ?
      ORDER BY r.created_at DESC
    `;
    
    const [results] = await pool.execute(query, [dbStudentId]);
    
    res.json(results);
  } catch (err) {
    console.error('getStudentResults error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add new result (marks) or update if already exists - Simplified approach
exports.addResult = async (req, res) => {
  const { studentId, subject, marks, midExamMarks, assignmentMarks, finalExamMarks } = req.body;
  
  try {
    // Validate input
    if (!studentId || !subject) {
      return res.status(400).json({ 
        message: 'Missing required fields: studentId, subject' 
      });
    }

    // Calculate total marks - use provided marks or calculate from components
    let totalMarks = marks;
    if (midExamMarks !== undefined || assignmentMarks !== undefined || finalExamMarks !== undefined) {
      totalMarks = (parseInt(midExamMarks) || 0) + (parseInt(assignmentMarks) || 0) + (parseInt(finalExamMarks) || 0);
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
    const dbStudentId = student.id;
    
    // Check if result already exists for this student and subject
    const [existing] = await pool.execute(
      'SELECT id, marks FROM results WHERE student_id = ? AND subject = ?', 
      [dbStudentId, subject]
    );
    
    const grade = getGrade(totalMarks);
    
    if (existing.length > 0) {
      // Update existing result - just use the basic marks field for now
      await pool.execute(
        'UPDATE results SET marks = ?, updated_at = NOW() WHERE id = ?',
        [totalMarks, existing[0].id]
      );
      
      res.status(200).json({ 
        message: 'Result updated successfully',
        studentName: student.name,
        studentId: studentId,
        subject: subject,
        totalMarks: totalMarks,
        breakdown: {
          midExam: midExamMarks || null,
          assignment: assignmentMarks || null,
          finalExam: finalExamMarks || null,
          total: totalMarks
        },
        previousTotal: existing[0].marks,
        action: 'updated'
      });
    } else {
      // Insert new result
      await pool.execute(
        'INSERT INTO results (student_id, subject, marks) VALUES (?, ?, ?)',
        [dbStudentId, subject, totalMarks]
      );
      
      res.status(201).json({ 
        message: 'Result added successfully',
        studentName: student.name,
        studentId: studentId,
        subject: subject,
        totalMarks: totalMarks,
        breakdown: {
          midExam: midExamMarks || null,
          assignment: assignmentMarks || null,
          finalExam: finalExamMarks || null,
          total: totalMarks
        },
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

// ==================== PARENTS ====================

// Create parent account and link to students
exports.createParent = async (req, res) => {
  const { name, email, phone, address, occupation, emergency_contact, student_ids } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {
      return res.status(400).json({
        message: 'Name, email, and at least one student ID are required'
      });
    }

    // Check if email already exists
    const [existingUser] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Generate username from name (remove spaces, lowercase)
    const baseUsername = name.toLowerCase().replace(/\s+/g, '');
    let username = baseUsername;
    let counter = 1;

    // Ensure username is unique
    while (true) {
      const [existingUsername] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
      if (existingUsername.length === 0) break;
      username = `${baseUsername}${counter}`;
      counter++;
    }

    // Generate temporary password: Par@ + 4 random digits
    const tempPassword = `Par@${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Verify all student IDs exist
    const placeholders = student_ids.map(() => '?').join(',');
    const [students] = await pool.execute(
      `SELECT id, student_id, name FROM students WHERE id IN (${placeholders})`,
      student_ids
    );

    if (students.length !== student_ids.length) {
      return res.status(400).json({ message: 'One or more student IDs are invalid' });
    }

    // Create user account
    const [userResult] = await pool.execute(
      'INSERT INTO users (username, email, password_hash, role, must_change_password) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, 'parent', 1]
    );

    const parentUserId = userResult.insertId;

    // Create parent record
    await pool.execute(
      'INSERT INTO parents (user_id, name, phone, address, occupation, emergency_contact) VALUES (?, ?, ?, ?, ?, ?)',
      [parentUserId, name, phone || null, address || null, occupation || null, emergency_contact || null]
    );

    // Link parent to students
    for (const studentId of student_ids) {
      await pool.execute(
        'INSERT INTO parent_students (parent_id, student_id, relationship) VALUES (?, ?, ?)',
        [parentUserId, studentId, 'parent']
      );
    }

    res.status(201).json({
      message: 'Parent account created successfully',
      parent: {
        id: parentUserId,
        username,
        name,
        email,
        tempPassword,
        linkedStudents: students.map(s => ({
          id: s.id,
          student_id: s.student_id,
          name: s.name
        }))
      }
    });

  } catch (err) {
    console.error('Create parent error:', err);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

// Get all parents with their linked students
exports.getParents = async (req, res) => {
  try {
    const [parents] = await pool.execute(`
      SELECT
        u.id as user_id,
        u.username,
        u.email,
        u.created_at,
        p.name,
        p.phone,
        p.address,
        p.occupation,
        p.emergency_contact
      FROM users u
      JOIN parents p ON u.id = p.user_id
      WHERE u.role = 'parent'
      ORDER BY p.name ASC
    `);

    // Get linked students for each parent
    const parentsWithStudents = await Promise.all(
      parents.map(async (parent) => {
        const [students] = await pool.execute(`
          SELECT
            s.id,
            s.student_id,
            s.name,
            s.class,
            ps.relationship
          FROM parent_students ps
          JOIN students s ON ps.student_id = s.id
          WHERE ps.parent_id = ?
          ORDER BY s.name ASC
        `, [parent.user_id]);

        return {
          ...parent,
          students: students
        };
      })
    );

    res.json(parentsWithStudents);
  } catch (err) {
    console.error('Get parents error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Link additional student to parent
exports.linkStudentToParent = async (req, res) => {
  const { parent_id, student_id, relationship = 'parent' } = req.body;

  try {
    // Check if parent exists
    const [parent] = await pool.execute('SELECT * FROM users WHERE id = ? AND role = ?', [parent_id, 'parent']);
    if (parent.length === 0) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    // Check if student exists
    const [student] = await pool.execute('SELECT * FROM students WHERE id = ?', [student_id]);
    if (student.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if link already exists
    const [existingLink] = await pool.execute(
      'SELECT * FROM parent_students WHERE parent_id = ? AND student_id = ?',
      [parent_id, student_id]
    );

    if (existingLink.length > 0) {
      return res.status(400).json({ message: 'Parent is already linked to this student' });
    }

    // Create the link
    await pool.execute(
      'INSERT INTO parent_students (parent_id, student_id, relationship) VALUES (?, ?, ?)',
      [parent_id, student_id, relationship]
    );

    res.json({
      message: 'Student linked to parent successfully',
      link: {
        parent_id,
        student_id,
        relationship
      }
    });

  } catch (err) {
    console.error('Link student to parent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove student link from parent
exports.unlinkStudentFromParent = async (req, res) => {
  const { parent_id, student_id } = req.params;

  try {
    const [result] = await pool.execute(
      'DELETE FROM parent_students WHERE parent_id = ? AND student_id = ?',
      [parent_id, student_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Parent-student link not found' });
    }

    res.json({ message: 'Student unlinked from parent successfully' });

  } catch (err) {
    console.error('Unlink student from parent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update parent information
exports.updateParent = async (req, res) => {
  const { id } = req.params;
  const { name, phone, address, occupation, emergency_contact } = req.body;

  try {
    await pool.execute(
      'UPDATE parents SET name = ?, phone = ?, address = ?, occupation = ?, emergency_contact = ? WHERE user_id = ?',
      [name, phone || null, address || null, occupation || null, emergency_contact || null, id]
    );

    res.json({ message: 'Parent information updated successfully' });

  } catch (err) {
    console.error('Update parent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete parent account
exports.deleteParent = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete user (CASCADE will handle parent_students and parents table)
    const [result] = await pool.execute('DELETE FROM users WHERE id = ? AND role = ?', [id, 'parent']);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    res.json({ message: 'Parent account deleted successfully' });

  } catch (err) {
    console.error('Delete parent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
