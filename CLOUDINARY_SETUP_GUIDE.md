# Cloudinary Setup Guide

## Overview
Cloudinary is a cloud storage service for images and files. Perfect for:
- Student profile pictures
- Document uploads (PDFs, certificates)
- Assignment submissions
- Teacher resources
- System backups

---

## Step 1: Create Cloudinary Account

1. Go to https://cloudinary.com
2. Click "Sign Up Free"
3. Create account with email
4. Verify email
5. Go to Dashboard

---

## Step 2: Get Cloudinary Credentials

1. In Cloudinary Dashboard, go to "Settings"
2. Find "API Keys" section
3. Copy these credentials:
   - **Cloud Name**: (e.g., `dxxxxx`)
   - **API Key**: (e.g., `123456789`)
   - **API Secret**: (e.g., `abcdefg...`)

**Keep these safe!** Don't share them publicly.

---

## Step 3: Install Cloudinary Packages

### Backend
```bash
cd backend
npm install cloudinary multer dotenv
```

### Frontend
```bash
cd frontend
npm install next-cloudinary
```

---

## Step 4: Configure Backend

### File: `backend/.env`
Add these variables:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### File: `backend/config/cloudinary.js` (NEW)
```javascript
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
```

### File: `backend/middleware/uploadMiddleware.js` (NEW)
```javascript
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'school-management',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    resource_type: 'auto'
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
```

---

## Step 5: Create Upload Routes

### File: `backend/routes/uploadRoutes.js` (NEW)
```javascript
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

    res.json({
      message: 'File uploaded successfully',
      url: req.file.path,
      publicId: req.file.filename,
      size: req.file.size
    });
  } catch (err) {
    res.status(500).json({ message: `Upload error: ${err.message}` });
  }
});

// Delete file
router.delete('/delete/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    await cloudinary.uploader.destroy(publicId);
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: `Delete error: ${err.message}` });
  }
});

// Get file info
router.get('/info/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await cloudinary.api.resource(publicId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

module.exports = router;
```

### Update: `backend/index.js`
```javascript
// Add this with other routes
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);
```

---

## Step 6: Create Frontend Upload Component

### File: `frontend/src/components/CloudinaryUpload.jsx` (NEW)
```javascript
import React, { useState } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';

const CloudinaryUpload = ({ onUploadSuccess, fileType = 'image' }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/upload/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadedFile({
        url: data.url,
        name: file.name,
        publicId: data.publicId
      });

      if (onUploadSuccess) {
        onUploadSuccess(data);
      }
    } catch (err) {
      setError(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!uploadedFile) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${API_URL}/api/upload/delete/${uploadedFile.publicId}`, {
        method: 'DELETE'
      });

      setUploadedFile(null);
    } catch (err) {
      setError(`Delete error: ${err.message}`);
    }
  };

  return (
    <div style={{
      border: '2px dashed var(--primary)',
      borderRadius: '12px',
      padding: '24px',
      textAlign: 'center',
      background: 'var(--glass-bg)'
    }}>
      {!uploadedFile ? (
        <>
          <Upload size={32} style={{ margin: '0 auto 12px', color: 'var(--primary)' }} />
          <h3>Upload File</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Drag and drop or click to select
          </p>
          <input
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input" style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: 'var(--primary)',
            color: 'white',
            borderRadius: '8px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            opacity: uploading ? 0.6 : 1
          }}>
            {uploading ? 'Uploading...' : 'Choose File'}
          </label>
        </>
      ) : (
        <>
          <CheckCircle size={32} style={{ margin: '0 auto 12px', color: '#22c55e' }} />
          <h3>File Uploaded</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
            {uploadedFile.name}
          </p>
          <img
            src={uploadedFile.url}
            alt="Uploaded"
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              borderRadius: '8px',
              marginBottom: '16px'
            }}
          />
          <button
            onClick={handleDelete}
            style={{
              padding: '8px 16px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 auto'
            }}
          >
            <X size={16} /> Delete
          </button>
        </>
      )}

      {error && (
        <p style={{ color: '#ef4444', marginTop: '12px' }}>{error}</p>
      )}
    </div>
  );
};

export default CloudinaryUpload;
```

---

## Step 7: Use Upload Component

### Example: `frontend/src/pages/SubmitPDFPage.jsx`
```javascript
import CloudinaryUpload from '../components/CloudinaryUpload';

export default function SubmitPDFPage() {
  const handleUploadSuccess = (data) => {
    console.log('File uploaded:', data.url);
    // Save URL to database
  };

  return (
    <div>
      <h1>Submit Assignment</h1>
      <CloudinaryUpload onUploadSuccess={handleUploadSuccess} />
    </div>
  );
}
```

---

## Step 8: Add to Deployment

### Render Environment Variables
Add to your Render backend service:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Vercel Environment Variables
No changes needed for frontend (uses backend API)

---

## Step 9: Install Required Packages

### Backend
```bash
npm install multer-storage-cloudinary
```

---

## Usage Examples

### Upload Student Profile Picture
```javascript
<CloudinaryUpload 
  onUploadSuccess={(data) => {
    // Save data.url to student profile
  }}
/>
```

### Upload Assignment
```javascript
<CloudinaryUpload 
  onUploadSuccess={(data) => {
    // Save data.url to assignment record
  }}
/>
```

### Upload Certificate
```javascript
<CloudinaryUpload 
  onUploadSuccess={(data) => {
    // Save data.url to certificate record
  }}
/>
```

---

## API Endpoints

### Upload File
```
POST /api/upload/upload
Body: FormData with 'file' field
Response: { url, publicId, size }
```

### Delete File
```
DELETE /api/upload/delete/:publicId
Response: { message }
```

### Get File Info
```
GET /api/upload/info/:publicId
Response: File metadata
```

---

## Cloudinary Features

### Image Transformations
```javascript
// Resize image
https://res.cloudinary.com/cloud/image/upload/w_300,h_300/file.jpg

// Crop image
https://res.cloudinary.com/cloud/image/upload/c_crop,w_300,h_300/file.jpg

// Quality optimization
https://res.cloudinary.com/cloud/image/upload/q_auto/file.jpg
```

### File Management
- View all uploads in Cloudinary Dashboard
- Delete files from dashboard
- Organize in folders
- Set expiration dates
- Track usage

---

## Pricing

### Free Tier
- 25 GB storage
- 25 GB bandwidth
- Unlimited uploads
- Basic transformations

### Paid Plans
- More storage
- More bandwidth
- Advanced features
- Priority support

---

## Security

### Best Practices
1. Never expose API Secret in frontend
2. Use backend for uploads
3. Validate file types
4. Set file size limits
5. Use signed URLs for sensitive files

### File Size Limits
```javascript
// In uploadMiddleware.js
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});
```

---

## Troubleshooting

### Issue: "Invalid credentials"
**Solution**: Check Cloudinary credentials in `.env`

### Issue: "File upload fails"
**Solution**: 
1. Check file size
2. Check file type
3. Verify API key
4. Check network

### Issue: "CORS error"
**Solution**: Cloudinary handles CORS, check backend CORS settings

---

## Next Steps

1. Create Cloudinary account
2. Get credentials
3. Install packages
4. Configure backend
5. Create upload component
6. Test locally
7. Deploy to Render/Vercel
8. Add to environment variables

---

## Useful Links

- Cloudinary: https://cloudinary.com
- Documentation: https://cloudinary.com/documentation
- Dashboard: https://cloudinary.com/console
- Pricing: https://cloudinary.com/pricing
