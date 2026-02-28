const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Get notifications for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Find student by studentId
    const [students] = await pool.execute(
      'SELECT id FROM students WHERE studentId = ?',
      [studentId]
    );
    
    if (students.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const dbStudentId = students[0].id;
    
    // Get notifications for this student
    const [notifications] = await pool.execute(
      'SELECT * FROM notifications WHERE student_id = ? ORDER BY created_at DESC',
      [dbStudentId]
    );
    
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.execute(
      'UPDATE notifications SET is_read = TRUE WHERE id = ?',
      [id]
    );
    
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Error updating notification:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread notification count for a student
router.get('/student/:studentId/unread-count', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Find student by studentId
    const [students] = await pool.execute(
      'SELECT id FROM students WHERE studentId = ?',
      [studentId]
    );
    
    if (students.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const dbStudentId = students[0].id;
    
    // Get unread notification count
    const [result] = await pool.execute(
      'SELECT COUNT(*) as count FROM notifications WHERE student_id = ? AND is_read = FALSE',
      [dbStudentId]
    );
    
    res.json({ unreadCount: result[0].count });
  } catch (err) {
    console.error('Error fetching unread count:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
