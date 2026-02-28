import React, { useState, useEffect } from 'react';
import { Settings, Shield, Bell, Palette, Moon, Sun } from 'lucide-react';

const SettingsPage = () => {
  const [theme, setTheme] = useState('dark');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (selectedTheme) => {
    if (selectedTheme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    setMessage({ 
      text: `${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated successfully!`, 
      type: 'success' 
    });
    
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };
  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1>System Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your school application preferences and configurations</p>
      </header>

      {message.text && (
        <div style={{
          marginBottom: '20px',
          padding: '16px 20px',
          borderRadius: '12px',
          background: 'rgba(34, 197, 94, 0.15)',
          color: '#22c55e',
          border: '1px solid #22c55e',
          fontSize: '0.95rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          ✓ {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>

        {/* Security Settings */}
        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '10px', borderRadius: '10px', color: '#6366f1' }}>
              <Shield size={24} />
            </div>
            <h3 style={{ margin: 0 }}>Security & Permissions</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> Require strong passwords
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> Two-factor authentication for admins
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" /> Allow students to edit profiles
            </label>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '10px', borderRadius: '10px', color: '#f59e0b' }}>
              <Bell size={24} />
            </div>
            <h3 style={{ margin: 0 }}>Notifications</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> Email alerts for payments
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> System error alerts to Admin
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> Attendance absence SMS integration
            </label>
          </div>
        </div>

        {/* App Appearance */}
        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(34, 197, 94, 0.2)', padding: '10px', borderRadius: '10px', color: '#22c55e' }}>
              <Palette size={24} />
            </div>
            <h3 style={{ margin: 0 }}>App Appearance</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '15px' }}>
            Customize the look and feel of the application.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => handleThemeChange('dark')}
              className="btn-primary" 
              style={{ 
                flex: 1,
                background: theme === 'dark' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--glass-bg)',
                color: 'white',
                border: theme === 'dark' ? 'none' : '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Moon size={18} />
              Dark Mode {theme === 'dark' && '✓'}
            </button>
            <button 
              onClick={() => handleThemeChange('light')}
              className="btn-primary" 
              style={{ 
                flex: 1,
                background: theme === 'light' ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'var(--glass-bg)',
                color: theme === 'light' ? '#1a1a1a' : 'white',
                border: theme === 'light' ? 'none' : '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Sun size={18} />
              Light Mode {theme === 'light' && '✓'}
            </button>
          </div>
        </div>

      </div>

      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-primary" style={{ padding: '12px 24px' }}>Save All Settings</button>
      </div>
    </div>
  );
};

export default SettingsPage;
