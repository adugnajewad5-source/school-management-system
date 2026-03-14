import React, { useState, useEffect } from 'react';
import { Download, FileText, Image, Video, File, Calendar, User, Eye, Search, Filter } from 'lucide-react';

const MaterialsPage = ({ user }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';
      
      // For students, filter by their class
      let url = `${apiUrl}/api/materials`;
      if (user?.role === 'student') {
        // Assuming student class is available in user object or default to 12A
        const studentClass = user?.class || '12A';
        url += `?class=${studentClass}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setMaterials(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (materialId, originalName) => {
    try {
      setDownloadingId(materialId);
      const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';
      
      const response = await fetch(`${apiUrl}/api/materials/download/${materialId}`);
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return <FileText color="#f43f5e" size={20} />;
    if (fileType?.includes('image')) return <Image color="#22c55e" size={20} />;
    if (fileType?.includes('video')) return <Video color="#3b82f6" size={20} />;
    return <File color="#64748b" size={20} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter materials based on search and subject
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === '' || material.subject === selectedSubject;
    
    return matchesSearch && matchesSubject;
  });

  // Get unique subjects for filter
  const subjects = [...new Set(materials.map(m => m.subject))].sort();

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading materials...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FileText size={32} color="var(--primary)" /> Study Materials
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Access learning materials uploaded by your teachers
        </p>
      </header>

      {/* Search and Filter Controls */}
      <div className="glass" style={{ padding: '20px', marginBottom: '30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '12px', 
              color: 'var(--text-secondary)' 
            }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search materials by title, description, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '45px' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter size={18} color="var(--text-secondary)" />
            <select
              className="input-field"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
          <FileText size={64} style={{ opacity: 0.3, marginBottom: '20px' }} />
          <h3>No Materials Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {materials.length === 0 
              ? "No study materials have been uploaded yet." 
              : "No materials match your search criteria."}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {filteredMaterials.map((material) => (
            <div key={material.id} className="glass" style={{ padding: '20px' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '15px' }}>
                {getFileIcon(material.file_type)}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '5px', lineHeight: '1.3' }}>
                    {material.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span style={{ 
                      background: 'var(--primary)', 
                      color: 'white', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      {material.subject}
                    </span>
                    {material.class && material.class !== 'All' && (
                      <span>Class: {material.class}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {material.description && (
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: 'var(--text-secondary)', 
                  marginBottom: '15px',
                  lineHeight: '1.4'
                }}>
                  {material.description}
                </p>
              )}

              {/* File Info */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                marginBottom: '15px',
                padding: '10px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px'
              }}>
                <span>{material.original_name}</span>
                <span>{formatFileSize(material.file_size)}</span>
              </div>

              {/* Meta Info */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                marginBottom: '15px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <User size={14} />
                  {material.uploaded_by_name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={14} />
                  {formatDate(material.upload_date)}
                </div>
              </div>

              {/* Download Stats */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                marginBottom: '15px'
              }}>
                <Eye size={14} />
                Downloaded {material.download_count} times
              </div>

              {/* Download Button */}
              <button
                onClick={() => handleDownload(material.id, material.original_name)}
                disabled={downloadingId === material.id}
                className="btn-primary"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: downloadingId === material.id ? 'var(--glass-bg)' : 'var(--primary)',
                  opacity: downloadingId === material.id ? 0.6 : 1,
                  cursor: downloadingId === material.id ? 'not-allowed' : 'pointer'
                }}
              >
                <Download size={16} />
                {downloadingId === material.id ? 'Downloading...' : 'Download'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialsPage;