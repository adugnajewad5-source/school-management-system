import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, KeyRound } from 'lucide-react';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validation, setValidation] = useState({
    length: false, capital: false, small: false, number: false, special: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    setValidation({
      length: password.length >= 8,
      capital: /[A-Z]/.test(password),
      small: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@#$!]/.test(password),
    });
  }, [password]);

  const isPasswordValid = Object.values(validation).every(v => v) && password === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Password updated successfully! Redirecting to dashboard...");
    navigate('/');
  };

  const ValidationItem = ({ label, met }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: met ? '#22c55e' : 'var(--text-secondary)' }}>
      {met ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
      {label}
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-dark)' }}>
      <div className="glass" style={{ padding: '40px', width: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <KeyRound color="white" size={32} />
          </div>
          <h2>Secure Your Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>You are logging in for the first time. Please set a strong password.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              className="input-field"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '25px' }}>
            <input
              type="password"
              className="input-field"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {password !== confirmPassword && confirmPassword !== '' && (
              <p style={{ color: 'var(--accent)', fontSize: '0.75rem', marginTop: '5px' }}>Passwords do not match</p>
            )}
          </div>

          <div style={{ background: 'var(--glass-bg)', padding: '15px', borderRadius: '12px', marginBottom: '30px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <ValidationItem label="8+ chars" met={validation.length} />
              <ValidationItem label="1 Capital" met={validation.capital} />
              <ValidationItem label="1 Small" met={validation.small} />
              <ValidationItem label="1 Number" met={validation.number} />
              <ValidationItem label="1 Symbol" met={validation.special} />
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%' }} disabled={!isPasswordValid}>
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
