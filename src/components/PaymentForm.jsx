import React from 'react';

const PaymentForm = ({ onSubmit }) => {
  return (
    <div className="glass" style={{ padding: '24px', maxWidth: '500px' }}>
      <h3 style={{ marginBottom: '20px' }}>Record Payment</h3>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Student ID</label>
          <input type="text" className="input-field" placeholder="e.g. STU-101" required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Amount ($)</label>
          <input type="number" className="input-field" placeholder="0.00" required />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Payment Date</label>
          <input type="date" className="input-field" required />
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Submit Record</button>
      </form>
    </div>
  );
};

export default PaymentForm;
