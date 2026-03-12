import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Copy, Check, Search, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';
      const res = await fetch(`${apiUrl}/api/admin/students`);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to completely delete this student account?')) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';
      await fetch(`${apiUrl}/api/admin/students/${userId}`, {
        method: 'DELETE'
      });
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setEditFormData({
      name: student.name,
      class: student.class || '',
      age: student.age || '',
      parent_phone: student.parent_phone || ''
    });
  };

  const handleSave = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';
      await fetch(`${apiUrl}/api/admin/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const copyStudentId = (student_id) => {
    navigator.clipboard.writeText(student_id);
    setCopiedId(student_id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportToExcel = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(63, 81, 181);
    doc.text('Student Records Report', 105, 20, { align: 'center' });
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });
    
    // Prepare table data
    const tableData = filteredStudents.map(s => [
      s.student_id || 'N/A',
      s.name || s.username || 'N/A',
      s.class || 'N/A',
      s.parent_phone || 'N/A',
      s.email || 'N/A'
    ]);
    
    // Add table
    autoTable(doc, {
      startY: 35,
      head: [['Student ID', 'Name', 'Class', 'Phone', 'Email']],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [63, 81, 181],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 5
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });
    
    // Save the PDF
    doc.save(`Student_Records_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Filter students based on search query
  const filteredStudents = students.filter(student => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      (student.student_id && student.student_id.toLowerCase().includes(query)) ||
      (student.name && student.name.toLowerCase().includes(query)) ||
      (student.username && student.username.toLowerCase().includes(query)) ||
      (student.class && student.class.toLowerCase().includes(query)) ||
      (student.email && student.email.toLowerCase().includes(query)) ||
      (student.parent_phone && student.parent_phone.includes(query))
    );
  });

  const navigate = useNavigate();

  if (loading) return <div style={{ padding: '20px' }}>Loading student records...</div>;

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Student Records</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage all enrolled students, their classes, and contact info.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="btn-primary" 
            style={{ 
              background: showSearch ? 'var(--primary)' : 'var(--glass-bg)', 
              color: showSearch ? 'white' : 'var(--primary)', 
              border: '1px solid var(--primary)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}
          >
            <Search size={18} />
            Search Student
          </button>
          <button 
            onClick={exportToExcel}
            className="btn-primary" 
            style={{ 
              background: 'var(--secondary)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}
          >
            <FileDown size={18} />
            Export List
          </button>
          <button onClick={() => navigate('/register')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Add Student
          </button>
        </div>
      </header>

      {showSearch && (
        <div className="glass animate-fade-in" style={{ padding: '20px', marginBottom: '20px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search by Student ID, Name, Class, Email, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '12px' }}
            autoFocus
          />
          {searchQuery && (
            <p style={{ marginTop: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Found {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}
      <div className="glass" style={{ padding: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Class</th>
              <th style={{ padding: '12px' }}>Phone</th>
              <th style={{ padding: '12px' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? filteredStudents.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      fontWeight: 'bold', 
                      color: 'var(--primary)', 
                      background: 'rgba(6, 182, 212, 0.15)',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontFamily: 'monospace',
                      border: '1px solid rgba(6, 182, 212, 0.3)'
                    }}>
                      {s.student_id}
                    </span>
                    <button
                      onClick={() => copyStudentId(s.student_id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: copiedId === s.student_id ? '#22c55e' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'color 0.2s'
                      }}
                      title="Copy Student ID"
                    >
                      {copiedId === s.student_id ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </td>

                {editingId === s.id ? (
                  <>
                    <td style={{ padding: '12px' }}><input className="input-field" value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} style={{ padding: '8px' }} /></td>
                    <td style={{ padding: '12px' }}><input className="input-field" value={editFormData.class} onChange={e => setEditFormData({ ...editFormData, class: e.target.value })} style={{ padding: '8px' }} /></td>
                    <td style={{ padding: '12px' }}><input className="input-field" value={editFormData.parent_phone} onChange={e => setEditFormData({ ...editFormData, parent_phone: e.target.value })} style={{ padding: '8px' }} /></td>
                    <td style={{ padding: '12px' }}>{s.email}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button onClick={() => handleSave(s.id)} className="btn-primary" style={{ padding: '5px 10px', fontSize: '0.8rem', marginRight: '5px', background: '#22c55e' }}>Save</button>
                      <button onClick={() => setEditingId(null)} className="btn-primary" style={{ padding: '5px 10px', fontSize: '0.8rem', background: 'var(--glass-bg)', color: 'white' }}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '12px' }}>{s.name || s.username}</td>
                    <td style={{ padding: '12px' }}>{s.class || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>{s.parent_phone || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>{s.email}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button onClick={() => handleEdit(s)} style={{ background: 'transparent', border: 'none', color: '#6366f1', cursor: 'pointer', marginRight: '15px' }} title="Edit"><Pencil size={18} /></button>
                      <button onClick={() => handleDelete(s.userId || s.user_id)} style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer' }} title="Delete Account entirely"><Trash2 size={18} /></button>
                    </td>
                  </>
                )}
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  {searchQuery ? `No students found matching "${searchQuery}"` : 'No students found in the database. Use Accounts to add a student.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
