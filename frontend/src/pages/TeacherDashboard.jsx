import React, { useState } from 'react';
import {
  Users,
  FilePlus,
  CheckCircle,
  Calendar,
  Search,
  BookOpen,
  Filter,
  GraduationCap,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StudentTable from '../components/StudentTable';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadData, setUploadData] = useState({
    title: '',
    subject: 'Grade 10B Mathematics',
    file: null
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isUploading, setIsUploading] = useState(false);

  // Mock data for assigned students
  const assignedStudents = [
    { id: 1, student_id: 'STU-102934', name: 'Alex Johnson', class: 'Grade 10B', age: 16, parent_phone: '0911223344' },
    { id: 2, student_id: 'STU-582910', name: 'Maria Garcia', class: 'Grade 10B', age: 15, parent_phone: '0922334455' },
    { id: 3, student_id: 'STU-332198', name: 'James Wilson', class: 'Grade 10B', age: 16, parent_phone: '0933445566' }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setMessage({ text: 'File size must be less than 10MB', type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 4000);
        return;
      }
      setUploadData({ ...uploadData, file });
    }
  };

  const handleUploadMaterial = async () => {
    if (!uploadData.title) {
      setMessage({ text: 'Please enter assignment title', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return;
    }

    if (!uploadData.file) {
      setMessage({ text: 'Please select a file to upload', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return;
    }

    setIsUploading(true);
    setMessage({ text: '', type: '' });

    try {
      // Simulate upload - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success message
      setMessage({ 
        text: `✓ Material "${uploadData.title}" uploaded successfully for ${uploadData.subject}! Students can now access it from the Materials section.`, 
        type: 'success' 
      });

      // Reset form
      setUploadData({ title: '', subject: 'Grade 10B Mathematics', file: null });
      document.getElementById('file-input').value = '';

      setTimeout(() => setMessage({ text: '', type: '' }), 5000);

    } catch (error) {
      setMessage({ 
        text: 'Error uploading material. Please try again.', 
        type: 'error' 
      });
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Teacher Control Center</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Academic Management & Student Progress Tracking</p>
      </header>

      {message.text && (
        <div style={{
          marginBottom: '20px',
          padding: '16px 20px',
          borderRadius: '12px',
          background: message.type === 'error' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(34, 197, 94, 0.15)',
          color: message.type === 'error' ? '#f43f5e' : '#22c55e',
          border: `1px solid ${message.type === 'error' ? '#f43f5e' : '#22c55e'}`,
          fontSize: '0.95rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {message.type === 'success' ? '✓' : '⚠'} {message.text}
        </div>
      )}

      {/* Quick Actions & Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass" style={{ padding: '24px', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '1rem' }}>Active Students</h3>
            <Users size={20} color="var(--primary)" />
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>124</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Assigned to your subjects</p>
        </div>

        <div className="glass" style={{ padding: '24px', borderLeft: '4px solid #22c55e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '1rem' }}>Today's Attendance</h3>
            <CheckCircle size={20} color="#22c55e" />
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>98%</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Across all sections today</p>
        </div>

        <div className="glass" style={{ padding: '24px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '1rem' }}>Student Marks</h3>
            <GraduationCap size={20} color="#f59e0b" />
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Add/Edit</p>
          <button 
            onClick={() => navigate('/results')}
            style={{ 
              fontSize: '0.8rem', 
              color: '#f59e0b', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Manage Student Results →
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '30px', gap: '30px' }}>
          {['overview', 'add-marks', 'assigned-students', 'assignments'].map(tab => (
            <button
              key={tab}
              onClick={() => {
                if (tab === 'add-marks') {
                  navigate('/results');
                } else {
                  setActiveTab(tab);
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                color: tab === 'add-marks' ? '#f59e0b' : activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                padding: '12px 5px',
                cursor: 'pointer',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                borderBottom: activeTab === tab ? '2px solid var(--primary)' : 'none',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'add-marks' ? '📊 Add Marks' : tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div>
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={18} /> Schedule
              </h3>
              {[
                { time: '09:00 AM', subject: 'Grade 10B Math', room: '302' },
                { time: '11:30 AM', subject: 'Grade 12A Physics', room: 'Lab 1' }
              ].map((cls, i) => (
                <div key={i} style={{ padding: '15px', background: 'var(--glass-bg)', borderRadius: '12px', marginBottom: '12px' }}>
                  <p style={{ fontWeight: 'bold' }}>{cls.subject}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{cls.time} • Room {cls.room}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FilePlus size={18} /> Assignment Quick Upload
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Assignment Title (e.g., Chapter 5 Homework)"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                />
                <select 
                  className="input-field"
                  value={uploadData.subject}
                  onChange={(e) => setUploadData({ ...uploadData, subject: e.target.value })}
                >
                  <option>Grade 10B Mathematics</option>
                  <option>Grade 12A Physics</option>
                  <option>Grade 11C Chemistry</option>
                  <option>Grade 9A Biology</option>
                </select>
                <div style={{ position: 'relative' }}>
                  <input 
                    id="file-input"
                    type="file" 
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    onChange={handleFileChange}
                    style={{ 
                      padding: '10px',
                      border: '2px dashed var(--border-color)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      width: '100%',
                      background: 'var(--glass-bg)'
                    }}
                  />
                  {uploadData.file && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
                      Selected: {uploadData.file.name} ({(uploadData.file.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
                <button 
                  className="btn-primary" 
                  onClick={handleUploadMaterial}
                  disabled={isUploading}
                  style={{ 
                    marginTop: '5px',
                    opacity: isUploading ? 0.6 : 1,
                    cursor: isUploading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isUploading ? 'Uploading...' : 'Upload Material'}
                </button>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  Supported: PDF, DOC, DOCX, PPT, PPTX, TXT (Max 10MB)
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assigned-students' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3>My Students</h3>
              <div style={{ position: 'relative', width: '250px' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-secondary)' }} />
                <input type="text" className="input-field" placeholder="Search students..." style={{ paddingLeft: '35px', paddingBottom: '8px', paddingTop: '8px' }} />
              </div>
            </div>
            <StudentTable students={assignedStudents} />
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
            <BookOpen size={48} color="var(--text-secondary)" style={{ marginBottom: '15px' }} />
            <h3>Assignment Management</h3>
            <p style={{ color: 'var(--text-secondary)' }}>No active assignments found. Create one above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
