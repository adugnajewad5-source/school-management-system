const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
// const { authenticateToken, isAdmin } = require('../middleware/authMiddleware'); 
// Assuming auth middlewares exist, ideally we protect these:
// router.use(authenticateToken);
// router.use(isAdmin);

// --- Students Management ---
router.post('/students/pre-register', adminController.createPreRegisteredStudent);
router.get('/students', adminController.getStudents);
router.put('/students/:id', adminController.updateStudent);
router.delete('/students/:user_id', adminController.deleteUser); // Deleting user cascade-deletes student

// --- Teachers Management ---
router.get('/teachers', adminController.getTeachers);
router.put('/teachers/:id', adminController.updateTeacher);
router.delete('/teachers/:user_id', adminController.deleteUser);

// --- Parents Management ---
router.post('/parents', adminController.createParent);
router.get('/parents', adminController.getParents);
router.put('/parents/:id', adminController.updateParent);
router.delete('/parents/:id', adminController.deleteParent);
router.post('/parents/link-student', adminController.linkStudentToParent);
router.delete('/parents/:parent_id/students/:student_id', adminController.unlinkStudentFromParent);

// --- Payments Management ---
router.get('/payments', adminController.getPayments);
router.post('/payments', adminController.addPayment);
router.put('/payments/:id', adminController.updatePayment);
router.delete('/payments/:id', adminController.deletePayment);

// --- Reports ---
router.get('/reports', adminController.getReports);

// --- Results Management ---
router.get('/results', adminController.getResults);
router.get('/results/student/:studentId', adminController.getStudentResults);
router.post('/results', adminController.addResult);
router.put('/results/:id', adminController.updateResult);
router.delete('/results/:id', adminController.deleteResult);

module.exports = router;
