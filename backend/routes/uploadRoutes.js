const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const cloudinary = require('../config/cloudinary');

// Upload file
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.status(201).json({
      message: 'File uploaded successfully',
      url: req.file.path,
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

// Delete file
router.delete('/delete/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return res.status(400).json({ message: 'Public ID required' });
    }

    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: `Delete error: ${err.message}` });
  }
});

// Get file info
router.get('/info/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return res.status(400).json({ message: 'Public ID required' });
    }

    const result = await cloudinary.api.resource(publicId);
    res.json(result);
  } catch (err) {
    console.error('Info error:', err);
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

// List all files
router.get('/list', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'school-management',
      max_results: 100
    });
    res.json(result);
  } catch (err) {
    console.error('List error:', err);
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

module.exports = router;
