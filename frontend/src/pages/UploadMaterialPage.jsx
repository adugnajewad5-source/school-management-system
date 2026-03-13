import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';

const UploadMaterialPage = ({ user }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'Mathematics',
    class: 'All'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        setMessage({ text: 'File size must be less than 50MB', type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        return;
      }
      
      setSelectedFile(file);
      setMessage({ text: '', type: '' });
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    document.getElementById('file-input').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setMessage({ text: 'Please select a file to upload', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      return;
    }

    if (!formData.title.trim()) {
      setMessage({ text: 'Please enter a title for the material', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      return;
    }

    setUploading(true);
    setMessage({ text: '', type: '' });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';
      
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      uploadFormData.append('title', formData.title.trim());
      uploadFormData.append('description', formData.description.trim());
      uploadFormData.append('subject', formData.subject);
      uploadFormData.append('class', formData.class);
      uploadFormData.append('uploadedBy', user?.id || 1); // Use actual user ID

      const response = await fetch(`${apiUrl}/api/materials`, {
        method: 'POST',
        body: uploadFormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      
      setMessage({ 
        text: `✓ Material "${formData.title}" uploaded successfully!`, 
        type: 'success' 
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        subject: 'Mathematics',
        class: 'All'
      });
      setSelectedFile(null);
      document.getElementById('file-input').value = '';

      setTimeout(() => setMessage({ text: '', type: '' }), 6000);

    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ 
        text: `Upload failed: ${error.message}`, 
        type: 'error' 
      });
      setTimeout(() => setMessage({ text: '', type: '' }), 6000);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Upload size={32} color="var(--primary)" /> Upload Study Material
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Share learning resources with your students
        </p>
      </header>

      {message.text && (
        <div style={{
          marginBottom: '30px',
          padding: '16px 20px',
          borderRadius: '12px',
          background: message.type === 'error' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(34, 197, 94, 0.15)',
          color: message.type === 'error' ? '#f43f5e' : '#22c55e',
          border: `1px solid ${message.type === 'error' ? '#f43f5e' : '#22c55e'}`,
          fontSize: '0.95rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Upload Form */}
        <div className="glass" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="var(--primary)" />
            Material Details
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
                Title *
              </label>
              <input
                type="text"
                name="title"
                className="input-field"
                placeholder="e.g., Chapter 5: Quadratic Equations"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
                Description
              </label>
              <textarea
                name="description"
                className="input-field"
                placeholder="Brief description of the material content..."
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
                  Subject *
                </label>
                <select
                  name="subject"
                  className="input-field"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Literature">Literature</option>
                  <option value="Science">Science</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
                  Class
                </label>
                <select
                  name="class"
                  className="input-field"
                  value={formData.class}
                  onChange={handleInputChange}
                >
                  <option value="All">All Classes</option>
                  <option value="9A">Class 9A</option>
                  <option value="9B">Class 9B</option>
                  <option value="10A">Class 10A</option>
                  <option value="10B">Class 10B</option>
                  <option value="11A">Class 11A</option>
                  <option value="11B">Class 11B</option>
                  <option value="12A">Class 12A</option>
                  <option value="12B">Class 12B</option>
                </select>
              </div>
            </div>

            {/* File Upload */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
                Select File *
              </label>
              
              {!selectedFile ? (
                <div
                  onClick={() => document.getElementById('file-input').click()}
                  style={{
                    border: '2px dashed var(--border-color)',
                    borderRadius: '12px',
                    padding: '40px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255,255,255,0.02)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.background = 'rgba(99, 102, 241, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.background = 'rgba(255,255,255,0.02)';
                  }}
                >
                  <Upload size={32} color="var(--text-secondary)" style={{ marginBottom: '10px' }} />
                  <p style={{ fontSize: '1rem', marginBottom: '5px' }}>Click to select file</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    PDF, Word, PowerPoint, Excel, Images, Videos (Max: 50MB)
                  </p>
                </div>
              ) : (
                <div style={{
                  border: '1px solid var(--primary)',
                  borderRadius: '12px',
                  padding: '15px',
                  background: 'rgba(99, 102, 241, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <p style={{ fontWeight: '500', marginBottom: '5px' }}>{selectedFile.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    style={{
                      background: 'rgba(244, 63, 94, 0.1)',
                      border: '1px solid #f43f5e',
                      borderRadius: '6px',
                      padding: '6px',
                      cursor: 'pointer',
                      color: '#f43f5e'
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <input
                id="file-input"
                type="file"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={uploading || !selectedFile}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                opacity: (uploading || !selectedFile) ? 0.6 : 1,
                cursor: (uploading || !selectedFile) ? 'not-allowed' : 'pointer'
              }}
            >
              {uploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Upload size={18} />
                  Upload Material
                </>
              )}
            </button>
          </form>
        </div>

        {/* Guidelines */}
        <div className="glass" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>Upload Guidelines</h3>
          
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '10px', color: 'var(--secondary)' }}>
              📁 Supported File Types
            </h4>
            <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <li>📄 Documents: PDF, Word (.doc, .docx), Text (.txt)</li>
              <li>📊 Presentations: PowerPoint (.ppt, .pptx)</li>
              <li>📈 Spreadsheets: Excel (.xls, .xlsx)</li>
              <li>🖼️ Images: JPEG, PNG, GIF</li>
              <li>🎥 Videos: MP4, AVI, QuickTime</li>
            </ul>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '10px', color: 'var(--secondary)' }}>
              📏 File Requirements
            </h4>
            <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <li>Maximum file size: 50MB</li>
              <li>Use descriptive file names</li>
              <li>Ensure content is appropriate for students</li>
              <li>Check file quality before uploading</li>
            </ul>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '10px', color: 'var(--secondary)' }}>
              💡 Best Practices
            </h4>
            <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <li>Write clear, descriptive titles</li>
              <li>Add helpful descriptions</li>
              <li>Organize by subject and class</li>
              <li>Update materials regularly</li>
              <li>Use consistent naming conventions</li>
            </ul>
          </div>

          <div style={{
            padding: '15px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid #22c55e',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#22c55e'
          }}>
            <strong>💡 Tip:</strong> Students will be able to download and view your materials from their portal. Make sure all content is educational and appropriate.
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadMaterialPage;