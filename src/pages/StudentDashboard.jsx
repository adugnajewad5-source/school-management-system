import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  Trophy,
  CreditCard,
  DollarSign,
  CheckCircle,
  Sun,
  Moon,
  Palette
} from 'lucide-react';
import NotificationsPanel from '../components/NotificationsPanel';

const StudentDashboard = ({ user }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    description: 'Tuition Fee',
    method: 'credit-card'
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [theme, setTheme] = useState('dark');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('student-theme') || 'dark';
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
    localStorage.setItem('student-theme', newTheme);
    
    setMessage({ 
      text: `${newTheme === 'dark' ? '🌙 Dark' : '☀️ Bright'} mode activated successfully!`, 
      type: 'success' 
    });
    
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handlePayment = async () => {
    if (!paymentData.amount || paymentData.amount <= 0) {
      setMessage({ text: 'Please enter a valid payment amount', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return;
    }

    setIsProcessing(true);
    setMessage({ text: '', type: '' });

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would normally process payment with backend:
      // const response = await fetch(`http://${window.location.hostname}:5000/api/payments/student`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     amount: paymentData.amount,
      //     description: paymentData.description,
      //     method: paymentData.method
      //   })
      // });

      setMessage({ 
        text: `✓ Payment of $${paymentData.amount} processed successfully! Transaction ID: TXN-${Date.now()}`, 
        type: 'success' 
      });

      // Reset form
      setPaymentData({ amount: '', description: 'Tuition Fee', method: 'credit-card' });
      setShowPayment(false);

      setTimeout(() => setMessage({ text: '', type: '' }), 6000);

    } catch (error) {
      setMessage({ 
        text: 'Payment processing failed. Please try again or contact support.', 
        type: 'error' 
      });
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Student Portal</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Hello, Alex Johnson! Ready for your classes today?</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Notifications Panel */}
          {user && <NotificationsPanel user={user} />}
          
          {/* Theme Toggle Buttons */}
          <div className="glass" style={{ padding: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Palette size={18} color="var(--primary)" />
          <button 
            onClick={() => handleThemeChange('dark')}
            style={{ 
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: theme === 'dark' ? 'linear-gradient(135deg, #1e293b, #334155)' : 'transparent',
              color: theme === 'dark' ? '#f1f5f9' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: theme === 'dark' ? 'bold' : 'normal',
              transition: 'all 0.3s ease',
              boxShadow: theme === 'dark' ? '0 2px 8px rgba(0,0,0,0.3)' : 'none'
            }}
          >
            <Moon size={14} />
            Dark
            {theme === 'dark' && <span style={{ color: '#22c55e' }}>✓</span>}
          </button>
          
          <button 
            onClick={() => handleThemeChange('light')}
            style={{ 
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: theme === 'light' ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'transparent',
              color: theme === 'light' ? '#1a1a1a' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: theme === 'light' ? 'bold' : 'normal',
              transition: 'all 0.3s ease',
              boxShadow: theme === 'light' ? '0 2px 8px rgba(251,191,36,0.3)' : 'none'
            }}
          >
            <Sun size={14} />
            Bright
            {theme === 'light' && <span style={{ color: '#22c55e' }}>✓</span>}
          </button>
        </div>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <Calendar color="var(--primary)" />
            <h3 style={{ fontSize: '1rem' }}>Next Class</h3>
          </div>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Advanced Mathematics</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Room 302 • 10:30 AM</p>
        </div>

        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <BookOpen color="var(--secondary)" />
            <h3 style={{ fontSize: '1rem' }}>Assignments</h3>
          </div>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>2 Pending</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Physics, Literature</p>
        </div>

        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <Trophy color="#f59e0b" />
            <h3 style={{ fontSize: '1rem' }}>CGPA</h3>
          </div>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>3.85 / 4.0</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Top 5% of class</p>
        </div>

        <div className="glass" style={{ padding: '24px', cursor: 'pointer' }} onClick={() => setShowPayment(!showPayment)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <CreditCard color="#22c55e" />
            <h3 style={{ fontSize: '1rem' }}>Quick Payment</h3>
          </div>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>I Pay</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Click to make payment</p>
        </div>
      </div>

      {showPayment && (
        <div className="glass animate-fade-in" style={{ padding: '24px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={20} color="var(--primary)" />
            Student Payment Portal
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Payment Amount ($)
              </label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
                <input
                  type="number"
                  className="input-field"
                  placeholder="0.00"
                  style={{ paddingLeft: '35px' }}
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Payment For
              </label>
              <select
                className="input-field"
                value={paymentData.description}
                onChange={(e) => setPaymentData({ ...paymentData, description: e.target.value })}
              >
                <option value="Tuition Fee">Tuition Fee</option>
                <option value="Library Fee">Library Fee</option>
                <option value="Lab Fee">Lab Fee</option>
                <option value="Sports Fee">Sports Fee</option>
                <option value="Exam Fee">Exam Fee</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Payment Method
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { value: 'credit-card', label: 'Credit Card', icon: '💳' },
                { value: 'debit-card', label: 'Debit Card', icon: '💳' },
                { value: 'bank-transfer', label: 'Bank Transfer', icon: '🏦' },
                { value: 'digital-wallet', label: 'Digital Wallet', icon: '📱' }
              ].map(method => (
                <button
                  key={method.value}
                  onClick={() => setPaymentData({ ...paymentData, method: method.value })}
                  style={{
                    flex: 1,
                    padding: '12px 8px',
                    borderRadius: '8px',
                    border: paymentData.method === method.value ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: paymentData.method === method.value ? 'rgba(99, 102, 241, 0.1)' : 'var(--glass-bg)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{method.icon}</span>
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn-primary" 
              onClick={handlePayment}
              disabled={isProcessing}
              style={{ 
                flex: 1,
                background: '#22c55e',
                opacity: isProcessing ? 0.6 : 1,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Pay Now
                </>
              )}
            </button>
            <button 
              className="btn-primary" 
              onClick={() => setShowPayment(false)}
              style={{ 
                background: 'var(--glass-bg)',
                color: 'white',
                border: '1px solid var(--border-color)'
              }}
            >
              Cancel
            </button>
          </div>
          
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '15px' }}>
            🔒 Secure payment processing • All transactions are encrypted
          </p>
        </div>
      )}

      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '20px' }}>Today's Timetable</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {[
            { time: '08:30 AM', subject: 'English Literature', teacher: 'Mrs. Higgins' },
            { time: '10:30 AM', subject: 'Advanced Mathematics', teacher: 'Dr. Smith' },
            { time: '01:00 PM', subject: 'Physics Lab', teacher: 'Mr. Brown' }
          ].map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              background: 'var(--glass-bg)',
              borderRadius: '12px'
            }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Clock size={16} color="var(--text-secondary)" />
                <span style={{ fontWeight: '500' }}>{item.time}</span>
              </div>
              <div style={{ flex: 1, marginLeft: '40px' }}>
                <p style={{ fontWeight: '600' }}>{item.subject}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.teacher}</p>
              </div>
              <button 
                className="btn-primary" 
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                onClick={() => {
                  alert(`📚 Study Material for ${item.subject}\n\nTeacher: ${item.teacher}\nTime: ${item.time}\n\n📖 Available Materials:\n• Lecture Notes PDF\n• Practice Exercises\n• Reference Links\n\n💡 Note: This is a demo. In the full system, materials would be downloaded from the server.`);
                }}
              >
                View Material
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
