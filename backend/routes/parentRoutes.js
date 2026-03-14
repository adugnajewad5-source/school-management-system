const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { parentAuthMiddleware } = require('../middleware/parentAuthMiddleware');
const { parentStudentMiddleware } = require('../middleware/parentStudentMiddleware');

// Apply authentication middleware to all parent routes
router.use(authenticateToken);
router.use(parentAuthMiddleware);

// --- Parent Dashboard ---
// Get all children associated with the parent
router.get('/children', parentController.getChildren);

// --- Child-Specific Routes (Protected by parent-student relationship) ---
// Get child's profile information
router.get('/child/:studentId/profile', parentStudentMiddleware, parentController.getChildProfile);

// Get child's academic results
router.get('/child/:studentId/results', parentStudentMiddleware, parentController.getChildResults);

// Get child's attendance records
router.get('/child/:studentId/attendance', parentStudentMiddleware, parentController.getChildAttendance);

// Get child's payment history
router.get('/child/:studentId/payments', parentStudentMiddleware, parentController.getChildPayments);

module.exports = router;