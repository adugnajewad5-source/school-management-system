import React, { useState } from 'react';
import { UserPlus, Copy, CheckCircle } from 'lucide-react';

const PreRegisterStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    age: '',
    parent_phone: ''
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';
      const response = await fetch(`${apiUrl}/api/admin/students/pre-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Pre-registration failed');
      }

      setResult(data);
      setFormData({ name: '', class: '', age: '', parent_phone: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass" style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <UserPlus size={28} color="var(--primary)" />
        <h2>Pre-Register Student</h2>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '25px', fontSize: '0.9rem' }}>
        Create a student record with a temporary password. The password format is: First 4 letters of name + @ + 3-digit student ID (e.g., "Lami@456" for student ID STU-456).
      </p>

      {error && (
        <div style={{
          marginBottom: '20px',
          padding: '12px',
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: '8px',
          color: '#f43f5e'
        }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{
          marginBottom: '20px',
          padding: '20px',
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
            <CheckCircle size={20} color="#22c55e" />
            <strong style={{ color: '#22c55e' }}>Student Pre-Registered Successfully!</strong>
          </div>
          
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
            <p style={{ marginBottom: '8px' }}><strong>Student Name:</strong> {result.name}</p>
            <p style={{ marginBottom: '8px' }}><strong>Student ID:</strong> {result.studentId}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <p style={{ margin: 0 }}><strong>Temporary Password:</strong> {result.tempPassword}</p>
              <button
                onClick={() => copyToClipboard(result.tempPassword)}
                style={{
                  background: 'var(--primary)',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem'
                }}
              >
                <Copy size={14} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Share these credentials with the student. They must use their exact name and this temporary password to register.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Student Name *</label>
          <input
            type="text"
            className="input-field"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Class</label>
            <input
              type="text"
              className="input-field"
              placeholder="Grade 10-A"
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Age</label>
            <input
              type="number"
              className="input-field"
              placeholder="15"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Parent Phone</label>
          <input
            type="tel"
            className="input-field"
            placeholder="+1234567890"
            value={formData.parent_phone}
            onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <UserPlus size={18} />
          Create Student Record
        </button>
      </form>
    </div>
  );
};

export default PreRegisterStudent;
