import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const ResultForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    student: '',
    subject: 'Mathematics',
    midExamMarks: '',
    assignmentMarks: '',
    finalExamMarks: '',
    totalMarks: ''
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
        midExamMarks: initialData.mid_exam_marks || '',
        assignmentMarks: initialData.assignment_marks || '',
        finalExamMarks: initialData.final_exam_marks || '',
        totalMarks: initialData.total_marks || initialData.marks || ''
      });
      setStudentVerification({ status: 'valid', message: 'Student verified' });
    }
  }, [initialData]);

  // Verify student ID when it changes
  const verifyStudentId = async (studentId) => {
    // Clean the input - remove extra spaces and convert to uppercase
    const cleanStudentId = studentId?.trim().toUpperCase();
    
    if (!cleanStudentId || cleanStudentId.length < 3) {
      setStudentVerification({ status: null, message: '' });
      setFormData(prev => ({ ...prev, student: '' }));
      setStudentData(null);
      return;
    }

    setStudentVerification({ status: 'checking', message: 'Verifying student ID...' });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';
      console.log('🔍 STUDENT VERIFICATION DEBUG:');
      console.log('- Input Student ID:', studentId);
      console.log('- Cleaned Student ID:', cleanStudentId);
      console.log('- API URL:', `${apiUrl}/api/admin/students`);
      
      const response = await fetch(`${apiUrl}/api/admin/students`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const students = await response.json();
      console.log('📋 Total students received:', students.length);
      console.log('📋 Available Student IDs:', students.map(s => s.student_id));
      
      // Look for student_id field with case-insensitive and whitespace-tolerant matching
      const foundStudent = students.find(s => {
        const dbStudentId = s.student_id?.trim().toUpperCase();
        console.log(`Comparing: "${cleanStudentId}" === "${dbStudentId}"`);
        return dbStudentId === cleanStudentId;
      });
      
      if (foundStudent) {
        console.log('✅ Student found:', foundStudent);
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
        console.log('❌ Student not found for ID:', cleanStudentId);
        console.log('❌ Available IDs for comparison:', students.map(s => s.student_id?.trim().toUpperCase()));
        setStudentVerification({ 
          status: 'invalid', 
          message: `✗ Student ID "${cleanStudentId}" not found. Available IDs: ${students.slice(0, 3).map(s => s.student_id).join(', ')}...` 
        });
        setFormData(prev => ({ ...prev, student: '' }));
        setStudentData(null);
      }
    } catch (error) {
      console.error('❌ Error verifying student:', error);
      setStudentVerification({ 
        status: 'invalid', 
        message: `Error connecting to server: ${error.message}. Please try again.` 
      });
    }
  };

  // Calculate total marks automatically
  const calculateTotal = (midExam, assignment, finalExam) => {
    const mid = parseInt(midExam) || 0;
    const assign = parseInt(assignment) || 0;
    const final = parseInt(finalExam) || 0;
    return mid + assign + final;
  };

  // Handle marks input changes with auto-calculation
  const handleMarksChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    
    if (field === 'midExamMarks' || field === 'assignmentMarks' || field === 'finalExamMarks') {
      // Auto-calculate total when component marks change
      const total = calculateTotal(
        field === 'midExamMarks' ? value : formData.midExamMarks,
        field === 'assignmentMarks' ? value : formData.assignmentMarks,
        field === 'finalExamMarks' ? value : formData.finalExamMarks
      );
      newFormData.totalMarks = total;
    }
    
    setFormData(newFormData);
  };

  const handleStudentIdChange = (e) => {
    let newStudentId = e.target.value.toUpperCase().trim();
    
    // Auto-format: if user types just numbers, add STU- prefix
    if (/^\d{3}$/.test(newStudentId)) {
      newStudentId = `STU-${newStudentId}`;
    }
    
    setFormData({ ...formData, studentId: newStudentId });
    
    // Debounce the verification
    clearTimeout(window.studentIdTimeout);
    window.studentIdTimeout = setTimeout(() => {
      verifyStudentId(newStudentId);
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate student ID before submission
    if (studentVerification.status !== 'valid') {
      alert('Please enter a valid Student ID that exists in the database.');
      return;
    }

    // Validate marks - at least one component should be entered
    const midExam = parseInt(formData.midExamMarks) || 0;
    const assignment = parseInt(formData.assignmentMarks) || 0;
    const finalExam = parseInt(formData.finalExamMarks) || 0;
    const total = parseInt(formData.totalMarks) || 0;

    if (midExam === 0 && assignment === 0 && finalExam === 0 && total === 0) {
      alert('Please enter at least one mark component.');
      return;
    }

    // Validate individual components
    if (midExam > 30) {
      alert('Mid-exam marks cannot exceed 30 points.');
      return;
    }
    if (assignment > 20) {
      alert('Assignment marks cannot exceed 20 points.');
      return;
    }
    if (finalExam > 50) {
      alert('Final exam marks cannot exceed 50 points.');
      return;
    }
    if (total > 100) {
      alert('Total marks cannot exceed 100 points.');
      return;
    }

    onSubmit({
      studentId: formData.studentId,
      subject: formData.subject,
      midExamMarks: midExam || undefined,
      assignmentMarks: assignment || undefined,
      finalExamMarks: finalExam || undefined,
      marks: total, // For backward compatibility
      studentName: formData.student,
      studentDatabaseId: studentData?.id
    });
    
    // Reset form if not editing
    if (!initialData) {
      setFormData({ 
        studentId: '', 
        student: '', 
        subject: 'Mathematics', 
        midExamMarks: '',
        assignmentMarks: '',
        finalExamMarks: '',
        totalMarks: ''
      });
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
            placeholder="e.g., STU-357, STU-285, STU-311"
            value={formData.studentId}
            onChange={handleStudentIdChange}
            required
            style={{
              borderColor: studentVerification.status === 'valid' ? '#22c55e' : 
                          studentVerification.status === 'invalid' ? '#f43f5e' : 
                          'var(--border-color)',
              textTransform: 'uppercase'
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
          <p style={{ marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Available Student IDs: STU-357, STU-285, STU-311, STU-491, STU-755, STU-184, STU-585, STU-262, STU-443, STU-800, STU-984
          </p>
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

        {/* Detailed Marks Breakdown */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '20px', 
          background: 'rgba(59, 130, 246, 0.1)', 
          borderRadius: '12px',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <h4 style={{ marginBottom: '15px', color: 'var(--primary)', fontSize: '1rem' }}>
            📊 Marks Breakdown
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                Mid-Exam Marks <span style={{ color: '#6b7280' }}>(Max: 30)</span>
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="0-30"
                min="0"
                max="30"
                value={formData.midExamMarks}
                onChange={(e) => handleMarksChange('midExamMarks', e.target.value)}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                Assignment Marks <span style={{ color: '#6b7280' }}>(Max: 20)</span>
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="0-20"
                min="0"
                max="20"
                value={formData.assignmentMarks}
                onChange={(e) => handleMarksChange('assignmentMarks', e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                Final Exam Marks <span style={{ color: '#6b7280' }}>(Max: 50)</span>
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="0-50"
                min="0"
                max="50"
                value={formData.finalExamMarks}
                onChange={(e) => handleMarksChange('finalExamMarks', e.target.value)}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                <strong>Total Marks <span style={{ color: '#6b7280' }}>(Auto-calculated)</span></strong>
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="0-100"
                min="0"
                max="100"
                value={formData.totalMarks}
                readOnly
                style={{ 
                  background: 'rgba(34, 197, 94, 0.1)', 
                  border: '2px solid #22c55e',
                  fontWeight: 'bold',
                  color: '#22c55e'
                }}
              />
            </div>
          </div>

          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            background: 'rgba(34, 197, 94, 0.1)', 
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#059669'
          }}>
            💡 <strong>Grading System:</strong> Mid-Exam (30) + Assignment (20) + Final Exam (50) = Total (100)
          </div>
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
