import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student',
    name: '',
    class: '',
    age: '',
    parent_phone: '',
    tempPassword: ''
  });

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    capital: false,
    small: false,
    number: false,
    special: false,
    notUsername: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    const pass = formData.password;
    setPasswordValidation({
      length: pass.length >= 8,
      capital: /[A-Z]/.test(pass),
      small: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[@#$!]/.test(pass),
      notUsername: pass !== formData.username || pass === ''
    });
  }, [formData.password, formData.username]);

  const isPasswordValid = Object.values(passwordValidation).every(v => v) || (formData.role === 'student' && formData.password === '');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) return alert("Please follow all password rules.");
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://${window.location.hostname}:5000/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess(`Account registered successfully! ${data.tempPassword ? `Temp Password is: ${data.tempPassword}` : ''}`);

      // Delay navigation so they can read the success message/temp password
      setTimeout(() => navigate('/login'), 4000);

    } catch (err) {
      setError(err.message);
    }
  };

  const ValidationItem = ({ label, met }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: met ? '#22c55e' : 'var(--text-secondary)', marginBottom: '4px' }}>
      {met ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
      {label}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'url("https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80") center/cover no-repeat',
      padding: '40px 0'
    }}>
      <div className="glass" style={{
        padding: '30px',
        width: '550px',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '5px' }}>Create Account</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '25px', fontSize: '0.9rem' }}>Join our secure academic community</p>

        {error && <div style={{ marginBottom: '15px', color: '#f43f5e', fontSize: '0.9rem', background: 'rgba(244, 63, 94, 0.1)', padding: '10px', borderRadius: '8px' }}>{error}</div>}
        {success && <div style={{ marginBottom: '15px', color: '#22c55e', fontSize: '0.9rem', background: 'rgba(34, 197, 94, 0.1)', padding: '10px', borderRadius: '8px' }}>{success}</div>}

        <form onSubmit={handleRegister}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', textAlign: 'left' }}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Full Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="John Doe"
                required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Role</label>
              <select
                className="input-field"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Username</label>
              <input
                type="text"
                className="input-field"
                placeholder="john_doe"
                required
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="john@example.com"
                required
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {formData.role === 'student' && (
              <>
                <div style={{ marginBottom: '12px', gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Temporary Password (from Admin)</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Enter temp password provided by admin"
                    required
                    onChange={(e) => setFormData({ ...formData, tempPassword: e.target.value })}
                  />
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Admin must create your student record first and provide you with a temporary password
                  </p>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Class</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Grade 10-A"
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Age</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="15"
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
                <div style={{ marginBottom: '12px', gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Parent Phone</label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="+1234567890"
                    onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                  />
                </div>
              </>
            )}

            {formData.role === 'teacher' && (
              <div style={{ marginBottom: '12px', gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Subject</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Mathematics"
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
            )}

            <div style={{ marginBottom: '12px', gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>
                {formData.role === 'student' ? 'New Secure Password' : 'Secure Password'}
              </label>
              <input
                type="password"
                className="input-field"
                placeholder={formData.role === 'admin' ? "••••••••" : formData.role === 'student' ? "Create your new password" : "Leave blank for auto-temp password"}
                required={formData.role === 'admin' || formData.role === 'student'}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <div style={{ marginTop: '10px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--primary)' }}>Password Requirements:</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  <ValidationItem label="8+ Characters" met={passwordValidation.length} />
                  <ValidationItem label="1 Capital Letter" met={passwordValidation.capital} />
                  <ValidationItem label="1 Small Letter" met={passwordValidation.small} />
                  <ValidationItem label="1 Number" met={passwordValidation.number} />
                  <ValidationItem label="Special Symbol" met={passwordValidation.special} />
                  <ValidationItem label="Not same as username" met={passwordValidation.notUsername} />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={!isPasswordValid}
            style={{ width: '100%', padding: '14px', marginTop: '15px', opacity: isPasswordValid ? 1 : 0.5 }}
          >
            {isPasswordValid ? <ShieldCheck size={18} style={{ marginRight: '8px' }} /> : <ShieldAlert size={18} style={{ marginRight: '8px' }} />}
            Register Account
          </button>
        </form>

        <p style={{ marginTop: '15px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account? <a href="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
