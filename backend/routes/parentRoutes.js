const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const parentAuthMiddleware = require('../middleware/parentAuthMiddleware');
const parentStudentMiddleware = require('../middleware/parentStudentMiddleware');

/**
 * Parent API Routes
 * All routes require parentAuthMiddleware for JWT verification
 * Child-specific routes also require parentStudentMiddleware for authorization
 */

// Get all children for logged-in parent
// GET /api/parent/children
router.get('/children', parentAuthMiddleware, parentController.getChildren);

// Get child profile information
// GET /api/parent/child/:studentId/profile
router.get('/child/:studentId/profile', 
  parentAuthMiddleware, 
  parentStudentMiddleware, 
  parentController.getChildProfile
);

// Get child's academic results
// GET /api/parent/child/:studentId/results
router.get('/child/:studentId/results', 
  parentAuthMiddleware, 
  parentStudentMiddleware, 
  parentController.getChildResults
);

// Get child's attendance records
// GET /api/parent/child/:studentId/attendance
router.get('/child/:studentId/attendance', 
  parentAuthMiddleware, 
  parentStudentMiddleware, 
  parentController.getChildAttendance
);

// Get child's payment history
// GET /api/parent/child/:studentId/payments
router.get('/child/:studentId/payments', 
  parentAuthMiddleware, 
  parentStudentMiddleware, 
  parentController.getChildPayments
);

module.exports = router;
