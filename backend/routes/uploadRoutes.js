const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const fs = require('fs');
const path = require('path');

// Upload file (simple local storage)
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.status(201).json({
      message: 'File uploaded successfully',
      url: `/uploads/${req.file.filename}`,
      publicId: req.file.filename,
      size: req.file.size,
      name: req.file.originalname,
      mimetype: req.file.mimetype
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: `Upload error: ${err.message}` });
  }
});

// Delete file (simple local storage)
router.delete('/delete/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return res.status(400).json({ message: 'Public ID required' });
    }

    const filePath = path.join(__dirname, '../uploads', publicId);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: `Delete error: ${err.message}` });
  }
});

// Get file info (simple local storage)
router.get('/info/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return res.status(400).json({ message: 'Public ID required' });
    }

    const filePath = path.join(__dirname, '../uploads', publicId);
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      res.json({
        public_id: publicId,
        bytes: stats.size,
        created_at: stats.birthtime,
        url: `/uploads/${publicId}`
      });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (err) {
    console.error('Info error:', err);
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

// List all files (simple local storage)
router.get('/list', async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '../uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      return res.json({ resources: [] });
    }

    const files = fs.readdirSync(uploadsDir);
    const resources = files.map(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      return {
        public_id: file,
        bytes: stats.size,
        created_at: stats.birthtime,
        url: `/uploads/${file}`
      };
    });

    res.json({ resources });
  } catch (err) {
    console.error('List error:', err);
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

module.exports = router;
