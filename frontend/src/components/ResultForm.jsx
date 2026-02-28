import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const ResultForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    student: '',
    subject: 'Mathematics',
    marks: ''
  });
  const [studentVerification, setStudentVerification] = useState({
    status: null, // 'valid', 'invalid', 'checking'
    message: ''
  });
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        studentId: initialData.studentId || '',
        student: initialData.student,
        subject: initialData.subject,
        marks: initialData.marks
      });
      setStudentVerification({ status: 'valid', message: 'Student verified' });
    }
  }, [initialData]);

  // Verify student ID when it changes
  const verifyStudentId = async (studentId) => {
    if (!studentId || studentId.length < 3) {
      setStudentVerification({ status: null, message: '' });
      setFormData(prev => ({ ...prev, student: '' }));
      setStudentData(null);
      return;
    }

    setStudentVerification({ status: 'checking', message: 'Verifying student ID...' });

    try {
      const response = await fetch(`http://${window.location.hostname}:5000/api/admin/students`);
      const students = await response.json();
      
      const foundStudent = students.find(s => s.studentId === studentId);
      
      if (foundStudent) {
        setStudentVerification({ 
          status: 'valid', 
          message: `✓ Student found: ${foundStudent.name || foundStudent.username}` 
        });
        setFormData(prev => ({ 
          ...prev, 
          student: foundStudent.name || foundStudent.username 
        }));
        setStudentData(foundStudent);
      } else {
        setStudentVerification({ 
          status: 'invalid', 
          message: '✗ Student ID not found in database' 
        });
        setFormData(prev => ({ ...prev, student: '' }));
        setStudentData(null);
      }
    } catch (error) {
      console.error('Error verifying student:', error);
      setStudentVerification({ 
        status: 'invalid', 
        message: 'Error verifying student ID' 
      });
    }
  };

  const handleStudentIdChange = (e) => {
    const newStudentId = e.target.value;
    setFormData({ ...formData, studentId: newStudentId });
    
    // Debounce the verification
    const timeoutId = setTimeout(() => {
      verifyStudentId(newStudentId);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate student ID before submission
    if (studentVerification.status !== 'valid') {
      alert('Please enter a valid Student ID that exists in the database.');
      return;
    }

    // Validate marks
    const marksValue = parseInt(formData.marks);
    if (isNaN(marksValue) || marksValue < 0 || marksValue > 100) {
      alert('Please enter valid marks between 0 and 100.');
      return;
    }

    onSubmit({
      studentId: formData.studentId, // Send the STU-XXX format ID
      subject: formData.subject,
      marks: marksValue,
      studentName: formData.student,
      studentDatabaseId: studentData?.id // Include the database ID for reference
    });
    
    // Reset form if not editing
    if (!initialData) {
      setFormData({ studentId: '', student: '', subject: 'Mathematics', marks: '' });
      setStudentVerification({ status: null, message: '' });
      setStudentData(null);
    }
  };

  return (
    <div className="glass" style={{ padding: '24px', width: '100%', maxWidth: '500px' }}>
      <h3 style={{ marginBottom: '20px' }}>{initialData ? 'Update Student Marks' : 'Add Student Marks'}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Student ID</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g., STU-001"
            value={formData.studentId}
            onChange={handleStudentIdChange}
            required
            style={{
              borderColor: studentVerification.status === 'valid' ? '#22c55e' : 
                          studentVerification.status === 'invalid' ? '#f43f5e' : 
                          'var(--border-color)'
            }}
          />
          {studentVerification.message && (
            <div style={{ 
              marginTop: '8px', 
              fontSize: '0.85rem',
              color: studentVerification.status === 'valid' ? '#22c55e' : 
                     studentVerification.status === 'invalid' ? '#f43f5e' : 
                     'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {studentVerification.status === 'valid' && <CheckCircle size={16} />}
              {studentVerification.status === 'invalid' && <AlertCircle size={16} />}
              {studentVerification.message}
            </div>
          )}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Student Name</label>
          <input
            type="text"
            className="input-field"
            placeholder="Auto-filled from database..."
            value={formData.student}
            readOnly
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              cursor: 'not-allowed',
              color: studentVerification.status === 'valid' ? '#22c55e' : 'var(--text-secondary)'
            }}
          />
          <p style={{ marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Name is automatically filled when valid Student ID is entered
          </p>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Subject</label>
          <select
            className="input-field"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          >
            <option>Mathematics</option>
            <option>Physics</option>
            <option>History</option>
            <option>English</option>
            <option>Science</option>
          </select>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Marks (0-100)</label>
          <input
            type="number"
            className="input-field"
            placeholder="85"
            min="0"
            max="100"
            value={formData.marks}
            onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
            required
          />
        </div>
        <button 
          type="submit" 
          className="btn-primary" 
          style={{ 
            width: '100%',
            opacity: studentVerification.status === 'valid' ? 1 : 0.5,
            cursor: studentVerification.status === 'valid' ? 'pointer' : 'not-allowed'
          }}
          disabled={studentVerification.status !== 'valid'}
        >
          {initialData ? 'Update Grade' : 'Save Marks'}
        </button>
        {studentVerification.status !== 'valid' && formData.studentId && (
          <p style={{ 
            marginTop: '10px', 
            fontSize: '0.85rem', 
            color: '#f43f5e', 
            textAlign: 'center' 
          }}>
            Please enter a valid Student ID to continue
          </p>
        )}
      </form>
    </div>
  );
};

export default ResultForm;
