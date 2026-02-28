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
 * Parent-Student Association Middleware
 * 
 * Verifies that a parent has permission to access a specific student's data.
 * This middleware enforces data isolation between parents by checking the
 * parent_students association table.
 * 
 * Requirements: 5.4, 6.4, 7.4, 8.5, 12.1, 12.2, 12.3, 12.4
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const parentStudentMiddleware = async (req, res, next) => {
  try {
    // Extract parent_id from req.user (set by parentAuthMiddleware)
    const parent_id = req.user?.id;
    
    if (!parent_id) {
      return res.status(401).json({
        success: false,
        message: 'Parent authentication required'
      });
    }
    
    // Extract student_id from req.params
    const student_id = req.params.studentId;
    
    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }
    
    // Query parent_students table to verify association exists
    const [associations] = await pool.execute(
      'SELECT * FROM parent_students WHERE parent_id = ? AND student_id = ?',
      [parent_id, student_id]
    );
    
    // Determine access result
    const accessGranted = associations.length > 0;
    const result = accessGranted ? 'granted' : 'denied';
    
    // Log all access attempts (parent_id, student_id, timestamp, result)
    // Get IP address from request
    const ip_address = req.ip || req.connection.remoteAddress;
    const endpoint = req.originalUrl || req.url;
    const action = `${req.method} ${endpoint}`;
    
    // Log to parent_access_logs table
    await pool.execute(
      `INSERT INTO parent_access_logs 
       (parent_id, student_id, action, endpoint, status, ip_address) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [parent_id, student_id, action, endpoint, result, ip_address]
    );
    
    // Return 403 if no association found
    if (!accessGranted) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this student\'s information'
      });
    }
    
    // Association verified, proceed to next middleware/controller
    next();
  } catch (err) {
    console.error('Parent-Student middleware error:', err);
    
    // Log error attempt
    try {
      const parent_id = req.user?.id;
      const student_id = req.params.studentId;
      const ip_address = req.ip || req.connection.remoteAddress;
      const endpoint = req.originalUrl || req.url;
      const action = `${req.method} ${endpoint}`;
      
      await pool.execute(
        `INSERT INTO parent_access_logs 
         (parent_id, student_id, action, endpoint, status, ip_address) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [parent_id, student_id, action, endpoint, 'error', ip_address]
      );
    } catch (logErr) {
      console.error('Failed to log error attempt:', logErr);
    }
    
    return res.status(500).json({
      success: false,
      message: 'An error occurred while verifying access permissions'
    });
  }
};

module.exports = parentStudentMiddleware;
