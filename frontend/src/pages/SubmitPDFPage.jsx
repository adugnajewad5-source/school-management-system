import React, { useState } from 'react';
import { FileUp, CheckCircle2, AlertCircle } from 'lucide-react';

const SubmitPDFPage = ({ user }) => {
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus('error:Please select a PDF file first.');
      return;
    }

    setUploading(true);
    setStatus('');

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('student_id', user?.id || '');
    formData.append('student_name', user?.username || 'Unknown Student');
    formData.append('subject', subject);
    formData.append('message', message);

    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/submissions/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStatus('success:Document submitted successfully! Your teacher will receive it.');
      setFile(null);
      setSubject('');
      setMessage('');
      // Reset file input
      document.getElementById('pdf-input').value = '';
    } catch (err) {
      setStatus(`error:${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const isError = status.startsWith('error:');
  const statusMsg = status.replace('error:', '').replace('success:', '');

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FileUp size={32} color="var(--primary)" /> Submit Document
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Upload a PDF document to send directly to your teacher</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>

        {/* Upload Form */}
        <div className="glass" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '25px' }}>Upload PDF</h3>

          {statusMsg && (
            <div style={{
              marginBottom: '20px',
              padding: '12px',
              borderRadius: '10px',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: isError ? 'rgba(244, 63, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              color: isError ? '#f43f5e' : '#22c55e'
            }}>
              {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              {statusMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Subject / Course</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Mathematics, Physics"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Message to Teacher (optional)</label>
              <textarea
                className="input-field"
                placeholder="Any notes for your teacher..."
                rows="3"
                value={message}
                onChange={e => setMessage(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select PDF File (max 10MB)</label>
              <input
                id="pdf-input"
                type="file"
                accept=".pdf"
                onChange={e => setFile(e.target.files[0])}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--glass-bg)',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '12px',
                  color: 'white',
                  cursor: 'pointer'
                }}
              />
              {file && (
                <p style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--primary)' }}>
                  Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={uploading}
              style={{ width: '100%', padding: '14px', opacity: uploading ? 0.6 : 1 }}
            >
              {uploading ? 'Uploading...' : 'Send to Teacher'}
            </button>
          </form>
        </div>

        {/* Info Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass" style={{ padding: '24px', background: 'linear-gradient(135deg, #6366f120, #0ea5e920)' }}>
            <h3 style={{ marginBottom: '15px' }}>How It Works</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { step: '1', text: 'Select your subject and upload a PDF file' },
                { step: '2', text: 'Add an optional message for context' },
                { step: '3', text: 'Click "Send to Teacher" to submit' },
                { step: '4', text: 'Your teacher receives it instantly in their portal' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'var(--primary)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0
                  }}>{item.step}</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '10px', color: '#f59e0b' }}>Rules</h3>
            <ul style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.8', paddingLeft: '18px' }}>
              <li>Only PDF files are accepted</li>
              <li>Maximum file size: 10 MB</li>
              <li>Include the correct subject name</li>
              <li>Do not submit empty or corrupted files</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitPDFPage;
