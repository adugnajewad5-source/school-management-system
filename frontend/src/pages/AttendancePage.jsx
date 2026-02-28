import React, { useState } from 'react';
import { Calendar as CalendarIcon, Search, UserCheck, UserX, Clock, Filter } from 'lucide-react';

const AttendancePage = () => {
  const [activeTab, setActiveTab] = useState('mark');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([
    { id: 1, name: 'Alex Johnson', status: null },
    { id: 2, name: 'Maria Garcia', status: null },
    { id: 3, name: 'James Wilson', status: null },
    { id: 4, name: 'Emma Brown', status: null },
  ]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSaving, setIsSaving] = useState(false);

  const toggleStatus = (id, status) => {
    setStudents(students.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleSaveRecords = async () => {
    // Check if all students have attendance marked
    const unmarked = students.filter(s => s.status === null);
    if (unmarked.length > 0) {
      setMessage({ 
        text: `Please mark attendance for all students. ${unmarked.length} student(s) remaining.`, 
        type: 'error' 
      });
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
      return;
    }

    setIsSaving(true);
    setMessage({ text: '', type: '' });

    try {
      // Simulate API call - replace with actual backend call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would normally send data to backend:
      // const response = await fetch(`http://${window.location.hostname}:5000/api/attendance`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ date, students })
      // });

      const presentCount = students.filter(s => s.status === 'present').length;
      const absentCount = students.filter(s => s.status === 'absent').length;

      setMessage({ 
        text: `✓ Attendance saved successfully! ${presentCount} Present, ${absentCount} Absent for ${new Date(date).toLocaleDateString()}`, 
        type: 'success' 
      });

      // Clear the message after 5 seconds
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);

      // Reset all statuses after successful save
      setTimeout(() => {
        setStudents(students.map(s => ({ ...s, status: null })));
      }, 2000);

    } catch (error) {
      setMessage({ 
        text: 'Error saving attendance records. Please try again.', 
        type: 'error' 
      });
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CalendarIcon size={32} color="var(--primary)" /> Attendance Management
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track and record daily student participation</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="glass" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarIcon size={18} color="var(--primary)" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', cursor: 'pointer' }}
            />
          </div>
          <button 
            className="btn-primary" 
            onClick={handleSaveRecords}
            disabled={isSaving}
            style={{ 
              boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
              opacity: isSaving ? 0.6 : 1,
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            {isSaving ? 'Saving...' : 'Save Records'}
          </button>
        </div>
      </header>

      {message.text && (
        <div style={{
          marginBottom: '20px',
          padding: '16px 20px',
          borderRadius: '12px',
          background: message.type === 'error' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(34, 197, 94, 0.15)',
          color: message.type === 'error' ? '#f43f5e' : '#22c55e',
          border: `1px solid ${message.type === 'error' ? '#f43f5e' : '#22c55e'}`,
          fontSize: '0.95rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {message.type === 'success' ? '✓' : '⚠'} {message.text}
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <button
          onClick={() => setActiveTab('mark')}
          className="glass"
          style={{
            padding: '12px 24px',
            border: activeTab === 'mark' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
            color: activeTab === 'mark' ? 'var(--primary)' : 'white',
            cursor: 'pointer'
          }}
        >
          Mark Attendance
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className="glass"
          style={{
            padding: '12px 24px',
            border: activeTab === 'history' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
            color: activeTab === 'history' ? 'var(--primary)' : 'white',
            cursor: 'pointer'
          }}
        >
          View History
        </button>
      </div>

      <div className="glass" style={{ padding: '24px' }}>
        {activeTab === 'mark' ? (
          <>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '300px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Search student..."
                  style={{ paddingLeft: '40px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem' }}>
                <span style={{ color: '#22c55e' }}>● Total Present: {students.filter(s => s.status === 'present').length}</span>
                <span style={{ color: '#f43f5e' }}>● Total Absent: {students.filter(s => s.status === 'absent').length}</span>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '16px' }}>Student Name</th>
                  <th style={{ padding: '16px' }}>Subject Code</th>
                  <th style={{ padding: '16px', textAlign: 'center' }}>Attendance Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px' }}>{student.name}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>MATH-10B</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                        <button
                          onClick={() => toggleStatus(student.id, 'present')}
                          style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: '1px solid #22c55e30',
                            background: student.status === 'present' ? '#22c55e' : 'transparent',
                            color: student.status === 'present' ? 'white' : '#22c55e',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: '0.3s'
                          }}
                        >
                          <UserCheck size={16} /> Present
                        </button>
                        <button
                          onClick={() => toggleStatus(student.id, 'absent')}
                          style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: '1px solid #f43f5e30',
                            background: student.status === 'absent' ? '#f43f5e' : 'transparent',
                            color: student.status === 'absent' ? 'white' : '#f43f5e',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: '0.3s'
                          }}
                        >
                          <UserX size={16} /> Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <Clock size={48} color="var(--text-secondary)" style={{ marginBottom: '20px' }} />
            <h3>Attendance History</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Select a date to view past attendance records.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
