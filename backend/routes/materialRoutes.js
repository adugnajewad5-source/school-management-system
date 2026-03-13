const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

// Parse database host - handle both full URL and domain-only formats
let dbHost = process.env.DB_HOST || 'localhost';
let dbPort = process.env.DB_PORT || 3306;

// If DB_HOST contains a full connection string, extract just the domain
if (dbHost.includes('://')) {
  const urlMatch = dbHost.match(/@([^:]+):(\d+)/);
  if (urlMatch) {
    dbHost = urlMatch[1];
    dbPort = urlMatch[2];
  }
}

const pool = mysql.createPool({
  host: dbHost,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(dbPort),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create materials directory if it doesn't exist
const materialsDir = path.join(__dirname, '..', 'uploads', 'materials');
if (!fs.existsSync(materialsDir)) {
  fs.mkdirSync(materialsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, materialsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp_originalname
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common document and media types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'video/avi',
      'video/quicktime'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only documents, images, and videos are allowed.'));
    }
  }
});

// GET /api/materials - Get all materials (for teachers/admins) or filtered by class (for students)
router.get('/', async (req, res) => {
  try {
    const { class: studentClass, subject } = req.query;
    
    let query = `
      SELECT m.*, u.username as uploaded_by_name 
      FROM materials m 
      JOIN users u ON m.uploaded_by = u.id 
      WHERE m.is_active = TRUE
    `;
    const params = [];
    
    // Filter by class if provided (for students)
    if (studentClass) {
      query += ' AND (m.class = ? OR m.class IS NULL OR m.class = "All")';
      params.push(studentClass);
    }
    
    // Filter by subject if provided
    if (subject) {
      query += ' AND m.subject = ?';
      params.push(subject);
    }
    
    query += ' ORDER BY m.upload_date DESC';
    
    const [materials] = await pool.execute(query, params);
    
    res.json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// GET /api/materials/:id - Get specific material details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [materials] = await pool.execute(`
      SELECT m.*, u.username as uploaded_by_name 
      FROM materials m 
      JOIN users u ON m.uploaded_by = u.id 
      WHERE m.id = ? AND m.is_active = TRUE
    `, [id]);
    
    if (materials.length === 0) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    res.json(materials[0]);
  } catch (error) {
    console.error('Error fetching material:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// POST /api/materials - Upload new material (teachers/admins only)
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { title, description, subject, class: materialClass, uploadedBy } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    if (!title || !subject || !uploadedBy) {
      return res.status(400).json({ message: 'Title, subject, and uploadedBy are required' });
    }
    
    // Insert material record into database
    const [result] = await pool.execute(`
      INSERT INTO materials (title, description, subject, class, file_name, original_name, file_path, file_size, file_type, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title,
      description || null,
      subject,
      materialClass || 'All',
      req.file.filename,
      req.file.originalname,
      req.file.path,
      req.file.size,
      req.file.mimetype,
      uploadedBy
    ]);
    
    res.status(201).json({
      message: 'Material uploaded successfully',
      materialId: result.insertId,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
    
  } catch (error) {
    console.error('Error uploading material:', error);
    
    // Clean up uploaded file if database insert failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// GET /api/materials/download/:id - Download material file
router.get('/download/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [materials] = await pool.execute(`
      SELECT * FROM materials WHERE id = ? AND is_active = TRUE
    `, [id]);
    
    if (materials.length === 0) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    const material = materials[0];
    const filePath = path.join(materialsDir, material.file_name);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }
    
    // Increment download count
    await pool.execute(`
      UPDATE materials SET download_count = download_count + 1 WHERE id = ?
    `, [id]);
    
    // Set appropriate headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${material.original_name}"`);
    res.setHeader('Content-Type', material.file_type);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error downloading material:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// DELETE /api/materials/:id - Delete material (teachers/admins only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get material info before deletion
    const [materials] = await pool.execute(`
      SELECT * FROM materials WHERE id = ?
    `, [id]);
    
    if (materials.length === 0) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    const material = materials[0];
    
    // Soft delete - mark as inactive
    await pool.execute(`
      UPDATE materials SET is_active = FALSE WHERE id = ?
    `, [id]);
    
    res.json({ message: 'Material deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;