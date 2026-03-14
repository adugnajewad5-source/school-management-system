import React, { useState, useEffect } from 'react';
import { CreditCard, History, DollarSign, Download, Trash2, Pencil } from 'lucide-react';

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [studentRef, setStudentRef] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';
      const res = await fetch(`${apiUrl}/api/admin/payments`);
      const data = await res.json();
      setPayments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    setMsg('');
    if (!studentRef || !amount || !date) {
      setMsg('Please fill in all fields (Student ID, Amount, Date).');
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';
      const res = await fetch(`${apiUrl}/api/admin/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentRef, // Admin Controller handles looking up the STU-ref
          amount: parseFloat(amount),
          date: date
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMsg('Payment successfully recorded!');
      setStudentRef('');
      setAmount('');
      fetchPayments();

      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payment record?')) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';
      await fetch(`${apiUrl}/api/admin/payments/${id}`, {
        method: 'DELETE'
      });
      fetchPayments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1>Financial Management</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Record and track all school fee payments</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>

        {/* Record Payment Tool */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={20} color="var(--primary)" />
              Record Payment
            </h3>

            {msg && <div style={{
              marginBottom: '15px',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              background: msg.includes('Error') ? '#f43f5e20' : '#22c55e20',
              color: msg.includes('Error') ? '#f43f5e' : '#22c55e'
            }}>{msg}</div>}

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Student ID (e.g. STU-123456)</label>
              <input
                type="text"
                className="input-field"
                placeholder="STU-XXXXXX"
                value={studentRef}
                onChange={e => setStudentRef(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Amount</label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
                <input
                  type="number"
                  className="input-field"
                  placeholder="0.00"
                  style={{ paddingLeft: '32px' }}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Payment Date</label>
              <input
                type="date"
                className="input-field"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>

            <button onClick={handleProcessPayment} className="btn-primary" style={{ width: '100%' }}>Process Payment</button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '15px', textAlign: 'center' }}>
              Authorized Admin Action
            </p>
          </div>
        </div>

        {/* Payment History View */}
        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <History size={20} color="var(--secondary)" />
              Transaction History
            </h3>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Live Database</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '500px', overflowY: 'auto', paddingRight: '5px' }}>
            {loading ? <p>Loading History...</p> : payments.map(item => (
              <div key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '15px',
                background: 'var(--glass-bg)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <p style={{ fontWeight: '600' }}>{item.student_name} <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>({item.student_ref})</span></p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {new Date(item.paymentDate || item.date || item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 'bold' }}>${item.amount}</p>
                    <span style={{ fontSize: '0.75rem', color: '#22c55e' }}>Success</span>
                  </div>
                  <button onClick={() => handleDelete(item.id)} style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer' }} title="Delete Record">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            {!loading && payments.length === 0 && (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>No payment records found.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentPage;
