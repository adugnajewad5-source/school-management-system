import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  User,
  Search,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const ParentTable = () => {
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingParent, setEditingParent] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    student_ids: []
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';

  // Fetch parents and students
  useEffect(() => {
    fetchParents();
    fetchStudents();
  }, []);

  const fetchParents = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/parents`);
      if (response.ok) {
        const data = await response.json();
        setParents(data);
      } else {
        setError('Failed to fetch parents');
      }
    } catch (err) {
      setError('Error fetching parents: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/students`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const url = editingParent 
        ? `${apiUrl}/api/admin/parents/${editingParent.user_id}`
        : `${apiUrl}/api/admin/parents`;
      
      const method = editingParent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(editingParent ? 'Parent updated successfully!' : 'Parent added successfully!');
        resetForm();
        fetchParents();
      } else {
        const data = await response.json();
        setError(data.message || 'Operation failed');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  const handleDelete = async (parentId) => {
    if (!confirm('Are you sure you want to delete this parent?')) return;

    try {
      const response = await fetch(`${apiUrl}/api/admin/parents/${parentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSuccess('Parent deleted successfully!');
        fetchParents();
      } else {
        setError('Failed to delete parent');
      }
    } catch (err) {
      setError('Error deleting parent: ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      student_ids: []
    });
    setShowAddForm(false);
    setEditingParent(null);
  };

  const startEdit = (parent) => {
    setEditingParent(parent);
    setFormData({
      name: parent.name || '',
      email: parent.email || '',
      phone: parent.phone || '',
      address: parent.address || '',
      student_ids: parent.students ? parent.students.map(s => s.id) : []
    });
    setShowAddForm(true);
  };

  const handleStudentSelection = (studentId) => {
    const currentIds = formData.student_ids || [];
    const newIds = currentIds.includes(studentId)
      ? currentIds.filter(id => id !== studentId)
      : [...currentIds, studentId];
    
    setFormData({ ...formData, student_ids: newIds });
  };

  const filteredParents = parents.filter(parent =>
    parent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.phone?.includes(searchTerm)
  );

  const getStudentNames = (students) => {
    if (!students || students.length === 0) return 'No students assigned';
    return students.map(student => student.name).join(', ');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Loading parents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users size={32} color="var(--primary)" /> Parent Management
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage parent accounts and student relationships</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowAddForm(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <UserPlus size={18} />
          Add Parent
        </button>
      </header>

      {/* Messages */}
      {error && (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid #ef4444', 
          color: '#ef4444', 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div style={{ 
          background: 'rgba(34, 197, 94, 0.1)', 
          border: '1px solid #22c55e', 
          color: '#22c55e', 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={18} style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'var(--text-secondary)' 
          }} />
          <input
            type="text"
            placeholder="Search parents by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '40px' }}
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="glass" style={{ padding: '24px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={20} />
            {editingParent ? 'Edit Parent' : 'Add New Parent'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500' }}>
                  Parent Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter parent's full name"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  placeholder="parent@example.com"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                  placeholder="+1234567890"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500' }}>
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input-field"
                  placeholder="Home address"
                />
              </div>
            </div>

            {/* Student Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '500' }}>
                Assign Students
              </label>
              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto', 
                border: '1px solid var(--border-color)', 
                borderRadius: '8px', 
                padding: '10px' 
              }}>
                {students.map(student => (
                  <label key={student.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    padding: '8px',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.student_ids?.includes(student.id) || false}
                      onChange={() => handleStudentSelection(student.id)}
                    />
                    <span>{student.name} ({student.student_id})</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn-primary">
                {editingParent ? 'Update Parent' : 'Add Parent'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Parents Table */}
      <div className="glass" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-secondary)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Parent Info</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Contact</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Students</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParents.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    {searchTerm ? 'No parents found matching your search.' : 'No parents registered yet.'}
                  </td>
                </tr>
              ) : (
                filteredParents.map((parent) => (
                  <tr key={parent.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          background: 'var(--primary)', 
                          color: 'white', 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '1.1rem',
                          fontWeight: '600'
                        }}>
                          {parent.name?.charAt(0)?.toUpperCase() || 'P'}
                        </div>
                        <div>
                          <div style={{ fontWeight: '500', marginBottom: '2px' }}>{parent.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            ID: {parent.user_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                          <Mail size={14} color="var(--text-secondary)" />
                          {parent.email || 'No email'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                          <Phone size={14} color="var(--text-secondary)" />
                          {parent.phone || 'No phone'}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {getStudentNames(parent.students)}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => startEdit(parent)}
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)',
                            padding: '8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(parent.user_id)}
                          style={{
                            background: 'transparent',
                            border: '1px solid #ef4444',
                            color: '#ef4444',
                            padding: '8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Showing {filteredParents.length} of {parents.length} parents
      </div>
    </div>
  );
};

export default ParentTable;