const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

// Student uploads a PDF
router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    const { student_id, student_name, subject, message } = req.body;

    await pool.execute(
      'INSERT INTO submissions (student_id, student_name, filename, original_name, subject, message) VALUES (?, ?, ?, ?, ?, ?)',
      [student_id, student_name, req.file.filename, req.file.originalname, subject || 'General', message || '']
    );

    res.json({ message: 'Document submitted successfully to teacher!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Teacher fetches all submissions
router.get('/list', async (req, res) => {
  try {
    const [submissions] = await pool.execute(
      'SELECT * FROM submissions ORDER BY created_at DESC'
    );
    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Download a specific file
router.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);
  res.download(filePath);
});

// Delete a submission
router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM submissions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Submission removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
