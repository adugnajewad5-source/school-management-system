import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, User, BookOpen } from 'lucide-react';

const SimpleMaterialsPage = ({ user }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, show some sample materials that would be available
    // This simulates what students would see when teachers upload materials
    const sampleMaterials = [
      {
        id: 1,
        title: "Chapter 5: Quadratic Equations - Study Guide",
        subject: "Mathematics",
        class: "12A",
        uploadDate: "2026-03-10",
        uploadedBy: "Dr. Smith",
        fileType: "PDF",
        description: "Complete study guide for quadratic equations with examples and practice problems"
      },
      {
        id: 2,
        title: "Physics Lab Manual - Electricity",
        subject: "Physics", 
        class: "12A",
        uploadDate: "2026-03-08",
        uploadedBy: "Mr. Brown",
        fileType: "PDF",
        description: "Laboratory experiments and procedures for electricity chapter"
      },
      {
        id: 3,
        title: "English Literature - Romeo and Juliet Analysis",
        subject: "English",
        class: "All",
        uploadDate: "2026-03-05",
        uploadedBy: "Mrs. Higgins", 
        fileType: "Word Document",
        description: "Character analysis and themes in Romeo and Juliet"
      },
      {
        id: 4,
        title: "Chemistry Periodic Table Reference",
        subject: "Chemistry",
        class: "12A",
        uploadDate: "2026-03-03",
        uploadedBy: "Dr. Johnson",
        fileType: "PDF",
        description: "Interactive periodic table with element properties and examples"
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setMaterials(sampleMaterials);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDownload = (material) => {
    // Simulate download - in a real system this would download the actual file
    alert(`Downloading: ${material.title}\n\nNote: This is a demo. In the real system, the file would be downloaded from the server.`);
  };

  const getFileIcon = (fileType) => {
    return <FileText color="#3b82f6" size={20} />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading study materials...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BookOpen size={32} color="var(--primary)" /> Study Materials
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Access learning materials uploaded by your teachers
        </p>
      </header>

      {materials.length === 0 ? (
        <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
          <FileText size={64} style={{ opacity: 0.3, marginBottom: '20px' }} />
          <h3>No Materials Available</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            No study materials have been uploaded yet. Check back later!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {materials.map((material) => (
            <div key={material.id} className="glass" style={{ padding: '24px' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '15px' }}>
                {getFileIcon(material.fileType)}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', lineHeight: '1.3' }}>
                    {material.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span style={{ 
                      background: 'var(--primary)', 
                      color: 'white', 
                      padding: '3px 8px', 
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      {material.subject}
                    </span>
                    {material.class !== 'All' && (
                      <span>Class: {material.class}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p style={{ 
                fontSize: '0.9rem', 
                color: 'var(--text-secondary)', 
                marginBottom: '20px',
                lineHeight: '1.4'
              }}>
                {material.description}
              </p>

              {/* File Info */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                marginBottom: '20px',
                padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px'
              }}>
                <span>{material.fileType}</span>
                <span>Ready to download</span>
              </div>

              {/* Meta Info */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} />
                  {material.uploadedBy}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} />
                  {formatDate(material.uploadDate)}
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={() => handleDownload(material)}
                className="btn-primary"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'var(--primary)'
                }}
              >
                <Download size={16} />
                Download Material
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="glass" style={{ 
        padding: '20px', 
        marginTop: '30px',
        background: 'rgba(34, 197, 94, 0.1)',
        border: '1px solid #22c55e'
      }}>
        <h4 style={{ color: '#22c55e', marginBottom: '10px' }}>📚 How to Access Materials</h4>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Your teachers upload study materials, assignments, and resources here. Click "Download Material" to save files to your device. 
          New materials will appear automatically when teachers upload them.
        </p>
      </div>
    </div>
  );
};

export default SimpleMaterialsPage;