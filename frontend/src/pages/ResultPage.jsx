import React, { useState, useEffect } from 'react';
import { Plus, GraduationCap, FileDown, X, Edit2, CheckCircle2 } from 'lucide-react';
import ResultForm from '../components/ResultForm';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ResultPage = ({ user }) => {
  const isStudent = user?.role === 'student';
  const [showForm, setShowForm] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
    // Auto-refresh results every 10 seconds to show new marks from teachers
    const interval = setInterval(() => {
      fetchResults();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchResults = async () => {
    try {
      let url;
      const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';
      
      console.log('🔍 FETCHING RESULTS - User Info:', { 
        isStudent, 
        userRole: user?.role, 
        studentId: user?.studentId,
        username: user?.username 
      });
      
      if (isStudent && user?.studentId) {
        // Students fetch only their own results using their Student ID (STU-XXX format)
        url = `${apiUrl}/api/admin/results/student/${user.studentId}`;
        console.log('📚 Student fetching own results from:', url);
      } else if (isStudent && !user?.studentId) {
        // Student logged in but no Student ID - this shouldn't happen
        console.error('❌ Student user missing studentId:', user);
        setResults([]);
        setLoading(false);
        return;
      } else {
        // Teachers/admins fetch all results
        url = `${apiUrl}/api/admin/results`;
        console.log('👨‍🏫 Teacher/Admin fetching all results from:', url);
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        console.warn('Failed to fetch results:', response.status);
        setResults([]);
      } else {
        const data = await response.json();
        console.log('📊 Results received:', data);
        setResults(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching results:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter results for students - only show their own results
  // When student fetches, they already get only their results
  // When teacher fetches, they get all results
  const displayResults = results;

  // Calculate grade from marks
  const getGrade = (marks) => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    return 'F';
  };

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading results...</p>
      </div>
    );
  }

  const handleFormSubmit = async (data) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';
      if (editingResult) {
        // Update existing result
        const response = await fetch(
          `${apiUrl}/api/admin/results/${editingResult.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ marks: data.marks })
          }
        );
        
        if (!response.ok) {
          const error = await response.json();
          alert(`Error: ${error.message}`);
          return;
        }
        
        alert('Grade updated successfully!');
        setEditingResult(null);
      } else {
        // Add new result or update existing - send studentId in STU-XXX format
        const response = await fetch(
          `${apiUrl}/api/admin/results`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentId: data.studentId, // STU-XXX format
              subject: data.subject,
              marks: data.marks
            })
          }
        );
        
        if (!response.ok) {
          const error = await response.json();
          alert(`Error: ${error.message}`);
          return;
        }
        
        const result = await response.json();
        
        // Show appropriate message based on action
        if (result.action === 'updated') {
          alert(`✓ Grade updated for ${result.studentName} in ${data.subject}!\nPrevious: ${result.previousMarks}, New: ${result.marks}`);
        } else {
          alert(`✓ Grade added successfully for ${result.studentName} in ${data.subject}!`);
        }
      }
      
      // Refresh results list
      fetchResults();
      setShowForm(false);
    } catch (err) {
      console.error('Error submitting result:', err);
      alert('Failed to save result. Please try again.');
    }
  };

  const handleEdit = (res) => {
    setEditingResult(res);
    setShowForm(true);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(63, 81, 181);
    doc.text('EduPulse Academy', 105, 20, { align: 'center' });
    doc.setFontSize(16);
    
    if (isStudent) {
      doc.text(`Academic Report - ${user?.username}`, 105, 30, { align: 'center' });
    } else {
      doc.text('Student Academic Report', 105, 30, { align: 'center' });
    }

    const columns = isStudent 
      ? ["Subject", "Marks (%)", "Grade", "Status"]
      : ["Student ID", "Student Name", "Subject", "Marks (%)", "Grade", "Status"];
    
    const rows = displayResults.map(res => {
      const grade = getGrade(res.marks);
      return isStudent 
        ? [res.subject, res.marks, grade, "Published"]
        : [res.studentId, res.student_name || res.student, res.subject, res.marks, grade, "Published"];
    });

    autoTable(doc, {
      startY: 40,
      head: [columns],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [63, 81, 181], textColor: 255 },
    });

    const filename = isStudent 
      ? `My_Academic_Report_${user?.username}.pdf`
      : 'Student_Results_Report.pdf';
    
    doc.save(filename);
  };

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <GraduationCap size={32} color="var(--primary)" /> Academic Results
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {isStudent ? `Your academic performance - ${user?.username}` : 'Manage and update student marks effectively'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          {displayResults.length > 0 && (
            <button onClick={exportToPDF} className="btn-primary" style={{ background: 'var(--glass-bg)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileDown size={18} /> Export PDF
            </button>
          )}
          {!isStudent && (
            <button
              className="btn-primary"
              onClick={() => { setShowForm(!showForm); if (showForm) setEditingResult(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: showForm ? 'var(--accent)' : 'var(--primary)' }}
            >
              {showForm ? <><X size={18} /> Cancel</> : <><Plus size={18} /> Add New Marks</>}
            </button>
          )}
        </div>
      </header>

      {showForm && (
        <div className="animate-fade-in" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
          <ResultForm
            onSubmit={handleFormSubmit}
            initialData={editingResult}
          />
        </div>
      )}

      <div className="glass" style={{ padding: '24px' }}>
        {displayResults.length === 0 && isStudent ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            <GraduationCap size={64} style={{ opacity: 0.3, marginBottom: '20px' }} />
            <h3>No Results Available</h3>
            <p>Your academic results will appear here once published by your teachers.</p>
            {user?.studentId && (
              <p style={{ fontSize: '0.9rem', marginTop: '10px', color: 'var(--primary)' }}>
                Student ID: {user.studentId}
              </p>
            )}
          </div>
        ) : displayResults.length === 0 && !isStudent ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            <GraduationCap size={64} style={{ opacity: 0.3, marginBottom: '20px' }} />
            <h3>No Results Found</h3>
            <p>No student results have been added yet. Use "Add New Marks" to get started.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                {!isStudent && <th style={{ padding: '16px' }}>Student ID</th>}
                {!isStudent && <th style={{ padding: '16px' }}>Student</th>}
                <th style={{ padding: '16px' }}>Subject</th>
                <th style={{ padding: '16px' }}>Marks / 100</th>
                <th style={{ padding: '16px' }}>Grade</th>
                {!isStudent && <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {displayResults.map((res) => {
                const grade = getGrade(res.marks);
                return (
                <tr key={res.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {!isStudent && (
                    <td style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                      {res.studentId}
                    </td>
                  )}
                  {!isStudent && (
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'var(--primary)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                          {(res.student_name || res.student || '').split(' ').map(n => n[0]).join('')}
                        </div>
                        {res.student_name || res.student}
                      </div>
                    </td>
                  )}
                  <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{res.subject}</td>
                  <td style={{ padding: '16px', fontWeight: 'bold' }}>{res.marks}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ color: res.marks >= 70 ? '#22c55e' : '#0ea5e9', fontWeight: '700' }}>{grade}</span>
                  </td>
                  {!isStudent && (
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleEdit(res)}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Edit2 size={14} /> Edit Grade
                      </button>
                    </td>
                  )}
                </tr>
              )})}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
