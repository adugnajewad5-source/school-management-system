import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, UserPlus, X } from 'lucide-react';

const TeacherTable = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: '',
    subject: '',
    username: '',
    email: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';
      const res = await fetch(`${apiUrl}/api/admin/teachers`);
      const data = await res.json();
      setTeachers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to completely delete this teacher account?')) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';
      await fetch(`${apiUrl}/api/admin/teachers/${userId}`, {
        method: 'DELETE'
      });
      setMessage({ text: 'Teacher deleted successfully', type: 'success' });
      fetchTeachers();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Error deleting teacher', type: 'error' });
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    
    if (!addFormData.name || !addFormData.username || !addFormData.email) {
      setMessage({ text: 'Please fill in all required fields', type: 'error' });
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: addFormData.username,
          email: addFormData.email,
          role: 'teacher',
          name: addFormData.name,
          subject: addFormData.subject
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        setMessage({ text: data.message || 'Error adding teacher', type: 'error' });
        return;
      }

      setMessage({ 
        text: `Teacher added successfully! ${data.tempPassword ? `Temporary password: ${data.tempPassword}` : ''}`, 
        type: 'success' 
      });
      
      setAddFormData({ name: '', subject: '', username: '', email: '' });
      setShowAddForm(false);
      fetchTeachers();
      
      setTimeout(() => setMessage({ text: '', type: '' }), 8000);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Error adding teacher', type: 'error' });
    }
  };

  const handleEdit = (teacher) => {
    setEditingId(teacher.id);
    setEditFormData({
      name: teacher.name,
      subject: teacher.subject || ''
    });
  };

  const handleSave = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';
      await fetch(`${apiUrl}/api/admin/teachers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      setEditingId(null);
      fetchTeachers();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading teacher records...</div>;

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Teacher Records</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage all faculty members and their subject assignments.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {showAddForm ? <X size={18} /> : <UserPlus size={18} />}
          {showAddForm ? 'Cancel' : 'Add Teacher'}
        </button>
      </header>

      {message.text && (
        <div style={{
          marginBottom: '20px',
          padding: '15px',
          borderRadius: '12px',
          background: message.type === 'error' ? '#f43f5e20' : '#22c55e20',
          color: message.type === 'error' ? '#f43f5e' : '#22c55e',
          border: `1px solid ${message.type === 'error' ? '#f43f5e' : '#22c55e'}`
        }}>
          {message.text}
        </div>
      )}

      {showAddForm && (
        <div className="glass" style={{ padding: '24px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Add New Teacher</h3>
          <form onSubmit={handleAddTeacher}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Full Name <span style={{ color: '#f43f5e' }}>*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="John Doe"
                  value={addFormData.name}
                  onChange={e => setAddFormData({ ...addFormData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Subject
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Mathematics"
                  value={addFormData.subject}
                  onChange={e => setAddFormData({ ...addFormData, subject: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Username <span style={{ color: '#f43f5e' }}>*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="johndoe"
                  value={addFormData.username}
                  onChange={e => setAddFormData({ ...addFormData, username: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Email <span style={{ color: '#f43f5e' }}>*</span>
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="john@school.com"
                  value={addFormData.email}
                  onChange={e => setAddFormData({ ...addFormData, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-primary" style={{ background: '#22c55e' }}>
                Add Teacher
              </button>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)} 
                className="btn-primary" 
                style={{ background: 'var(--glass-bg)' }}
              >
                Cancel
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '15px' }}>
              A temporary password will be automatically generated and must be changed on first login.
            </p>
          </form>
        </div>
      )}

      <div className="glass" style={{ padding: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Subject</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length > 0 ? teachers.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                {editingId === t.id ? (
                  <>
                    <td style={{ padding: '12px' }}>
                      <input className="input-field" value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} style={{ padding: '8px', width: '100%' }} />
                    </td>
                    <td style={{ padding: '12px' }}>
                      <input className="input-field" value={editFormData.subject} onChange={e => setEditFormData({ ...editFormData, subject: e.target.value })} style={{ padding: '8px', width: '100%' }} />
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button onClick={() => handleSave(t.id)} className="btn-primary" style={{ padding: '5px 10px', fontSize: '0.8rem', marginRight: '5px', background: '#22c55e' }}>Save</button>
                      <button onClick={() => setEditingId(null)} className="btn-primary" style={{ padding: '5px 10px', fontSize: '0.8rem', background: 'var(--glass-bg)', color: 'white' }}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '12px' }}>{t.name}</td>
                    <td style={{ padding: '12px' }}>{t.subject || 'N/A'}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button onClick={() => handleEdit(t)} style={{ background: 'transparent', border: 'none', color: '#6366f1', cursor: 'pointer', marginRight: '15px' }} title="Edit"><Pencil size={18} /></button>
                      <button onClick={() => handleDelete(t.userId)} style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer' }} title="Delete Account entirely"><Trash2 size={18} /></button>
                    </td>
                  </>
                )}
              </tr>
            )) : (
              <tr>
                <td colSpan="3" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>No teachers found. Click "Add Teacher" to create one.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherTable;
