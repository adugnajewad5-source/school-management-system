import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const CloudinaryUpload = ({ onUploadSuccess, onUploadError, fileType = 'image', maxSize = 50 }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const errorMsg = `File size exceeds ${maxSize}MB limit`;
      setError(errorMsg);
      if (onUploadError) onUploadError(errorMsg);
      return;
    }

    setUploading(true);
    setError('');
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 201) {
          const data = JSON.parse(xhr.responseText);
          setUploadedFile({
            url: data.url,
            name: data.name,
            publicId: data.publicId,
            size: data.size,
            mimetype: data.mimetype
          });

          if (onUploadSuccess) {
            onUploadSuccess(data);
          }
        } else {
          const error = JSON.parse(xhr.responseText);
          throw new Error(error.message || 'Upload failed');
        }
        setUploading(false);
      });

      xhr.addEventListener('error', () => {
        throw new Error('Upload failed');
      });

      xhr.open('POST', `${API_URL}/api/upload/upload`);
      xhr.send(formData);
    } catch (err) {
      const errorMsg = `Upload error: ${err.message}`;
      setError(errorMsg);
      if (onUploadError) onUploadError(errorMsg);
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!uploadedFile) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/upload/delete/${uploadedFile.publicId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      setUploadedFile(null);
    } catch (err) {
      const errorMsg = `Delete error: ${err.message}`;
      setError(errorMsg);
      if (onUploadError) onUploadError(errorMsg);
    }
  };

  return (
    <div style={{
      border: '2px dashed var(--primary)',
      borderRadius: '12px',
      padding: '24px',
      textAlign: 'center',
      background: 'var(--glass-bg)',
      transition: 'all 0.3s'
    }}>
      {!uploadedFile ? (
        <>
          <Upload size={32} style={{ margin: '0 auto 12px', color: 'var(--primary)' }} />
          <h3 style={{ marginBottom: '8px' }}>Upload File</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>
            Drag and drop or click to select (Max {maxSize}MB)
          </p>

          {uploading && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'var(--primary)',
                  transition: 'width 0.3s'
                }} />
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {Math.round(progress)}%
              </p>
            </div>
          )}

          <input
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'var(--primary)',
            color: 'white',
            borderRadius: '8px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            opacity: uploading ? 0.6 : 1,
            fontWeight: '500',
            transition: 'all 0.3s'
          }}>
            {uploading ? (
              <>
                <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Choose File
              </>
            )}
          </label>
        </>
      ) : (
        <>
          <CheckCircle size={32} style={{ margin: '0 auto 12px', color: '#22c55e' }} />
          <h3 style={{ marginBottom: '8px' }}>File Uploaded</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '14px' }}>
            {uploadedFile.name}
          </p>

          {uploadedFile.mimetype.startsWith('image/') && (
            <img
              src={uploadedFile.url}
              alt="Uploaded"
              style={{
                maxWidth: '200px',
                maxHeight: '200px',
                borderRadius: '8px',
                marginBottom: '16px',
                border: '1px solid var(--border-color)'
              }}
            />
          )}

          <div style={{ marginBottom: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)}MB
          </div>

          <button
            onClick={handleDelete}
            style={{
              padding: '8px 16px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '500',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#dc2626'}
            onMouseLeave={(e) => e.target.style.background = '#ef4444'}
          >
            <X size={16} /> Delete
          </button>
        </>
      )}

      {error && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#ef4444',
          fontSize: '14px'
        }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CloudinaryUpload;
