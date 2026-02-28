const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

/**
 * Get all children associated with a parent account
 * Validates: Requirements 3.5, 4.3, 10.1, 16.2
 * 
 * @route GET /api/parent/children
 * @access Private (Parent role only)
 */
exports.getChildren = async (req, res) => {
  const parentId = req.user.id;

  try {
    // Query parent_students table for all student_ids associated with parent_id
    // Join with students table to fetch student details
    const [children] = await pool.execute(`
      SELECT 
        s.id,
        s.studentId as student_id,
        s.name,
        s.class,
        s.section,
        s.enrollment_date,
        ps.relationship
      FROM parent_students ps
      INNER JOIN students s ON ps.student_id = s.id
      WHERE ps.parent_id = ?
      ORDER BY s.name ASC
    `, [parentId]);

    // If no children found, return empty array
    if (children.length === 0) {
      return res.json({
        success: true,
        children: [],
        message: 'No children are associated with your account. Please contact the school administration.'
      });
    }

    // Calculate summary statistics for each child
    const childrenWithSummary = await Promise.all(
      children.map(async (child) => {
        // Calculate attendance percentage
        const [attendanceStats] = await pool.execute(`
          SELECT 
            COUNT(*) as total_days,
            SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present_days
          FROM attendance
          WHERE student_id = ?
        `, [child.id]);

        const totalDays = attendanceStats[0]?.total_days || 0;
        const presentDays = attendanceStats[0]?.present_days || 0;
        const attendancePercentage = totalDays > 0 
          ? Math.round((presentDays / totalDays) * 100 * 100) / 100 
          : 0;

        // Calculate average grade
        const [gradeStats] = await pool.execute(`
          SELECT 
            AVG(marks) as average_marks,
            COUNT(*) as total_subjects
          FROM results
          WHERE student_id = ?
        `, [child.id]);

        const averageMarks = gradeStats[0]?.average_marks || 0;
        const totalSubjects = gradeStats[0]?.total_subjects || 0;
        
        // Convert average marks to letter grade
        let averageGrade = 'N/A';
        if (totalSubjects > 0) {
          if (averageMarks >= 90) averageGrade = 'A';
          else if (averageMarks >= 80) averageGrade = 'A-';
          else if (averageMarks >= 70) averageGrade = 'B';
          else if (averageMarks >= 60) averageGrade = 'C';
          else if (averageMarks >= 50) averageGrade = 'D';
          else averageGrade = 'F';
        }

        // Calculate payment status
        const [paymentStats] = await pool.execute(`
          SELECT 
            SUM(amount) as total_paid
          FROM payments
          WHERE studentId = ? AND status = 'Paid'
        `, [child.id]);

        const totalPaid = paymentStats[0]?.total_paid || 0;
        
        // Determine payment status (simplified - assumes a standard fee structure)
        // In a real system, this would compare against expected fees
        const paymentStatus = totalPaid > 0 ? 'Paid' : 'Pending';

        return {
          id: child.id,
          student_id: child.student_id,
          name: child.name,
          class: child.class,
          section: child.section || 'N/A',
          enrollment_date: child.enrollment_date,
          relationship: child.relationship,
          summary: {
            attendance_percentage: attendancePercentage,
            average_grade: averageGrade,
            payment_status: paymentStatus
          }
        };
      })
    );

    // Cache parent-student associations in session (stored in req.user for this request)
    // Note: In production, consider using Redis or similar for session caching
    req.user.children = childrenWithSummary.map(c => c.id);

    res.json({
      success: true,
      children: childrenWithSummary
    });

  } catch (err) {
    console.error('getChildren error:', err);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
};


/**
 * Get child's profile information
 * Validates: Requirements 13.1, 13.4
 * 
 * @route GET /api/parent/child/:studentId/profile
 * @access Private (Parent role only, with parent-student association)
 */
exports.getChildProfile = async (req, res) => {
  const { studentId } = req.params;

  try {
    // Fetch student details
    const [student] = await pool.execute(`
      SELECT 
        s.id,
        s.studentId as student_id,
        s.name,
        s.class,
        s.section,
        s.enrollment_date,
        s.age,
        s.parent_phone
      FROM students s
      WHERE s.id = ?
    `, [studentId]);

    if (student.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const studentData = student[0];

    // Fetch assigned teachers with contact information
    const [teachers] = await pool.execute(`
      SELECT DISTINCT
        u.id,
        u.username as name,
        u.email,
        'Teacher' as role
      FROM users u
      INNER JOIN teacher_classes tc ON u.id = tc.teacher_id
      WHERE tc.class = ?
      LIMIT 5
    `, [studentData.class]);

    res.json({
      success: true,
      profile: {
        student_id: studentData.student_id,
        name: studentData.name,
        class: studentData.class,
        section: studentData.section || 'N/A',
        enrollment_date: studentData.enrollment_date,
        age: studentData.age,
        parent_phone: studentData.parent_phone,
        teachers: teachers.map(t => ({
          id: t.id,
          name: t.name,
          email: t.email,
          role: t.role
        }))
      }
    });

  } catch (err) {
    console.error('getChildProfile error:', err);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
};

/**
 * Get child's academic results
 * Validates: Requirements 5.2, 16.3
 * 
 * @route GET /api/parent/child/:studentId/results
 * @access Private (Parent role only, with parent-student association)
 */
exports.getChildResults = async (req, res) => {
  const { studentId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = 50;
  const offset = (page - 1) * limit;

  try {
    // Fetch student info - studentId is the database ID passed from frontend
    const [studentInfo] = await pool.execute(`
      SELECT id, studentId, name, class FROM students WHERE id = ?
    `, [studentId]);

    if (studentInfo.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const student = studentInfo[0];

    // Fetch results with pagination
    const [results] = await pool.execute(`
      SELECT 
        id,
        subject,
        marks,
        created_at,
        updated_at
      FROM results
      WHERE student_id = ?
      ORDER BY created_at DESC, subject ASC
      LIMIT ? OFFSET ?
    `, [studentId, limit, offset]);

    // Get total count for pagination
    const [countResult] = await pool.execute(`
      SELECT COUNT(*) as total FROM results WHERE student_id = ?
    `, [studentId]);

    const totalResults = countResult[0].total;

    // Calculate statistics
    let totalMarks = 0;
    let passCount = 0;
    let failCount = 0;

    results.forEach(r => {
      totalMarks += r.marks || 0;
      if (r.marks >= 50) {
        passCount++;
      } else {
        failCount++;
      }
    });

    const averageMarks = results.length > 0 
      ? Math.round((totalMarks / results.length) * 100) / 100 
      : 0;

    // Convert marks to letter grade
    const getGrade = (marks) => {
      if (marks >= 90) return 'A+';
      if (marks >= 80) return 'A';
      if (marks >= 70) return 'B+';
      if (marks >= 60) return 'B';
      if (marks >= 50) return 'C';
      return 'F';
    };

    res.json({
      success: true,
      student: {
        id: student.id,
        student_id: student.studentId,
        name: student.name,
        class: student.class
      },
      results: results.map(r => ({
        id: r.id,
        subject: r.subject,
        marks: r.marks,
        grade: getGrade(r.marks),
        status: r.marks >= 50 ? 'Pass' : 'Fail',
        added_date: r.created_at,
        last_updated: r.updated_at
      })),
      statistics: {
        total_subjects: results.length,
        average_marks: averageMarks,
        passed: passCount,
        failed: failCount,
        overall_status: failCount === 0 ? 'Pass' : 'Fail'
      },
      pagination: {
        current_page: page,
        total_pages: Math.ceil(totalResults / limit),
        total_results: totalResults,
        per_page: limit
      }
    });

  } catch (err) {
    console.error('getChildResults error:', err);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
};

/**
 * Get child's attendance records
 * Validates: Requirements 6.2, 6.5, 16.4
 * 
 * @route GET /api/parent/child/:studentId/attendance
 * @access Private (Parent role only, with parent-student association)
 */
exports.getChildAttendance = async (req, res) => {
  const { studentId } = req.params;
  const days = parseInt(req.query.days) || 30;

  try {
    // Fetch student info
    const [studentInfo] = await pool.execute(`
      SELECT id, studentId, name FROM students WHERE id = ?
    `, [studentId]);

    if (studentInfo.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const student = studentInfo[0];

    // Calculate date range (default: last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch attendance records
    const [attendance] = await pool.execute(`
      SELECT 
        id,
        date,
        status
      FROM attendance
      WHERE student_id = ? AND date >= ? AND date <= ?
      ORDER BY date DESC
    `, [studentId, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]);

    // Calculate statistics
    let totalDays = 0;
    let presentDays = 0;
    let absentDays = 0;

    attendance.forEach(record => {
      totalDays++;
      if (record.status === 'Present') {
        presentDays++;
      } else if (record.status === 'Absent') {
        absentDays++;
      }
    });

    const attendancePercentage = totalDays > 0 
      ? Math.round((presentDays / totalDays) * 100 * 100) / 100 
      : 0;

    res.json({
      success: true,
      student: {
        id: student.id,
        student_id: student.studentId,
        name: student.name
      },
      attendance: attendance.map(a => ({
        id: a.id,
        date: a.date,
        status: a.status
      })),
      statistics: {
        total_days: totalDays,
        present_days: presentDays,
        absent_days: absentDays,
        percentage: attendancePercentage
      },
      date_range: {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        days: days
      }
    });

  } catch (err) {
    console.error('getChildAttendance error:', err);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
};

/**
 * Get child's payment history
 * Validates: Requirements 7.2, 7.5
 * 
 * @route GET /api/parent/child/:studentId/payments
 * @access Private (Parent role only, with parent-student association)
 */
exports.getChildPayments = async (req, res) => {
  const { studentId } = req.params;

  try {
    // Fetch student info
    const [studentInfo] = await pool.execute(`
      SELECT id, studentId, name FROM students WHERE id = ?
    `, [studentId]);

    if (studentInfo.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const student = studentInfo[0];

    // Fetch payment records
    const [payments] = await pool.execute(`
      SELECT 
        id,
        amount,
        date,
        status,
        description,
        receipt_number
      FROM payments
      WHERE studentId = ?
      ORDER BY date DESC
    `, [studentId]);

    // Calculate payment statistics
    let totalPaid = 0;
    let totalPending = 0;

    payments.forEach(payment => {
      if (payment.status === 'Paid') {
        totalPaid += payment.amount || 0;
      } else if (payment.status === 'Pending') {
        totalPending += payment.amount || 0;
      }
    });

    // Assume total fees is a standard amount (this should ideally come from a fees table)
    // For now, we'll calculate it as total paid + pending
    const totalFees = totalPaid + totalPending;
    const remainingFees = totalFees - totalPaid;

    res.json({
      success: true,
      student: {
        id: student.id,
        student_id: student.studentId,
        name: student.name
      },
      payments: payments.map(p => ({
        id: p.id,
        date: p.date,
        amount: p.amount,
        status: p.status,
        description: p.description,
        receipt_number: p.receipt_number
      })),
      summary: {
        total_fees: totalFees,
        paid_fees: totalPaid,
        pending_fees: totalPending,
        remaining_fees: remainingFees,
        currency: 'ETB'
      }
    });

  } catch (err) {
    console.error('getChildPayments error:', err);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
};
