import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-dark)',
      padding: '20px'
    }}>
      <div className="glass" style={{
        padding: '50px',
        maxWidth: '500px',
        textAlign: 'center',
        border: '1px solid rgba(244, 63, 94, 0.3)' // Subtle red border for warning
      }}>
        <div style={{
          background: 'rgba(244, 63, 94, 0.1)',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 25px'
        }}>
          <ShieldAlert size={40} color="#f43f5e" />
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '15px', color: '#f43f5e' }}>Access Denied</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.6' }}>
          You do not have the necessary permissions to view this page. This area is restricted to authorized roles only.
        </p>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn-primary"
            style={{
              background: 'var(--glass-bg)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={18} /> Go Back
          </button>

          <button
            onClick={() => navigate('/')}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Lock size={18} /> Return Home
          </button>
        </div>

        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Security ID: ERR_AUTH_RESTRICTED_{Math.floor(Math.random() * 9000) + 1000}
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
