import React, { useState, useEffect } from 'react';
import { Inbox, Download, Trash2, FileText, Clock } from 'lucide-react';

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/submissions/list`);
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this submission?')) return;
    try {
      await fetch(`http://${window.location.hostname}:5000/api/submissions/${id}`, { method: 'DELETE' });
      fetchSubmissions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = (filename) => {
    window.open(`http://${window.location.hostname}:5000/api/submissions/download/${filename}`, '_blank');
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Inbox size={32} color="var(--primary)" /> Student Submissions
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>PDF documents submitted by your students</p>
        </div>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {submissions.length} document{submissions.length !== 1 ? 's' : ''}
        </span>
      </header>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading submissions...</p>
      ) : submissions.length === 0 ? (
        <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
          <Inbox size={48} color="var(--text-secondary)" style={{ marginBottom: '15px' }} />
          <h3 style={{ marginBottom: '8px' }}>No Submissions Yet</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Once students upload PDF documents, they will appear here instantly.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {submissions.map(sub => (
            <div key={sub.id} className="glass" style={{
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                {/* PDF icon */}
                <div style={{
                  background: '#f43f5e20',
                  color: '#f43f5e',
                  padding: '14px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileText size={28} />
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '1rem', margin: 0 }}>{sub.original_name}</h3>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      background: '#6366f120',
                      color: '#6366f1'
                    }}>{sub.subject || 'General'}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    From: <strong style={{ color: 'var(--primary)' }}>{sub.student_name}</strong>
                  </p>
                  {sub.message && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      "{sub.message}"
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <Clock size={12} /> {timeAgo(sub.created_at)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleDownload(sub.filename)}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px' }}
                >
                  <Download size={16} /> Download
                </button>
                <button
                  onClick={() => handleDelete(sub.id)}
                  style={{
                    background: 'rgba(244, 63, 94, 0.1)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    color: '#f43f5e',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Remove submission"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionsPage;
