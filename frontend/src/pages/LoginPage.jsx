import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`http://${window.location.hostname}:5000/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token to localStorage
      localStorage.setItem('token', data.token);

      const user = data.user;

      if (user.must_change_password) {
        navigate('/change-password');
      } else {
        onLogin(user);
        // Redirect based on role
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'teacher') navigate('/teacher');
        else if (user.role === 'student') navigate('/student');
        else if (user.role === 'parent') navigate('/parent');
        else navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'url("https://images.unsplash.com/photo-1523050853063-8802a83557e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80") center/cover no-repeat',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000
    }}>
      <div className="glass" style={{
        padding: '40px',
        width: '400px',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '10px' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>School Management System</p>

        <form onSubmit={handleLogin}>
          {error && <div style={{ marginBottom: '15px', color: '#f43f5e', fontSize: '0.9rem', background: 'rgba(244, 63, 94, 0.1)', padding: '10px', borderRadius: '8px' }}>{error}</div>}
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Username</label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '30px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }}>
            Sign In
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <a href="/register" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Register here</a>
        </p>
      </div>
    </div >
  );
};

export default LoginPage;
