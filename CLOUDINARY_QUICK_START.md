# Cloudinary Quick Start - 10 Minutes

## Step 1: Create Cloudinary Account (2 minutes)

1. Go to https://cloudinary.com
2. Click "Sign Up Free"
3. Create account with email
4. Verify email
5. Go to Dashboard

---

## Step 2: Get Your Credentials (1 minute)

1. In Cloudinary Dashboard, click "Settings"
2. Go to "API Keys" tab
3. Copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

---

## Step 3: Update Backend .env (1 minute)

Add to `backend/.env`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Step 4: Install Packages (2 minutes)

```bash
cd backend
npm install cloudinary multer-storage-cloudinary
```

---

## Step 5: Test Upload (2 minutes)

### Use the Upload Component

In any page:
```javascript
import CloudinaryUpload from '../components/CloudinaryUpload';

export default function MyPage() {
  const handleUploadSuccess = (data) => {
    console.log('File uploaded:', data.url);
  };

  return (
    <CloudinaryUpload onUploadSuccess={handleUploadSuccess} />
  );
}
```

---

## Step 6: Deploy (2 minutes)

### Add to Render Environment Variables

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Done! 🎉

Your system now supports file uploads to Cloudinary!

---

## API Endpoints

### Upload File
```
POST /api/upload/upload
```

### Delete File
```
DELETE /api/upload/delete/:publicId
```

### List Files
```
GET /api/upload/list
```

---

## Component Usage

### Basic Upload
```javascript
<CloudinaryUpload 
  onUploadSuccess={(data) => {
    console.log('URL:', data.url);
  }}
/>
```

### With Error Handling
```javascript
<CloudinaryUpload 
  onUploadSuccess={(data) => {
    console.log('Success:', data.url);
  }}
  onUploadError={(error) => {
    console.log('Error:', error);
  }}
  maxSize={50}
/>
```

---

## Features

✓ Drag and drop upload
✓ Progress bar
✓ File preview
✓ Delete files
✓ Size validation
✓ Type validation
✓ Error handling
✓ Responsive design

---

## Supported File Types

- Images: JPG, PNG, GIF, WebP
- Documents: PDF, DOC, DOCX
- Text: TXT

---

## File Size Limit

Default: 50MB (configurable)

---

## Troubleshooting

### "Invalid credentials"
- Check Cloudinary credentials in `.env`
- Verify API Key and Secret

### "Upload fails"
- Check file size (max 50MB)
- Check file type
- Check network connection

### "CORS error"
- Check backend CORS settings
- Verify Cloudinary is configured

---

## Next Steps

1. Create Cloudinary account
2. Get credentials
3. Update `.env`
4. Install packages
5. Use CloudinaryUpload component
6. Test locally
7. Deploy to Render

---

## Useful Links

- Cloudinary: https://cloudinary.com
- Dashboard: https://cloudinary.com/console
- Docs: https://cloudinary.com/documentation
