import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Users, UserSquare2, DollarSign } from 'lucide-react';

const ReportsPage = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalRevenue: 0,
    attendanceRate: '100%'
  });
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';
    // Fetch stats
    fetch(`${apiUrl}/api/admin/reports`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);

    // Fetch students for CSV export
    fetch(`${apiUrl}/api/admin/students`)
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(console.error);

    // Fetch teachers for CSV export
    fetch(`${apiUrl}/api/admin/teachers`)
      .then(res => res.json())
      .then(data => setTeachers(data))
      .catch(console.error);

    // Fetch payments for CSV export
    fetch(`${apiUrl}/api/admin/payments`)
      .then(res => res.json())
      .then(data => setPayments(data))
      .catch(console.error);
  }, []);

  const exportToCSV = () => {
    // Create comprehensive CSV report
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add report header
    csvContent += "SCHOOL MANAGEMENT SYSTEM - COMPREHENSIVE REPORT\n";
    csvContent += `Generated on: ${new Date().toLocaleString()}\n\n`;
    
    // Add summary statistics
    csvContent += "SUMMARY STATISTICS\n";
    csvContent += "Metric,Value\n";
    csvContent += `Total Students,${stats.totalStudents}\n`;
    csvContent += `Total Teachers,${stats.totalTeachers}\n`;
    csvContent += `Total Revenue,$${stats.totalRevenue}\n`;
    csvContent += `Attendance Rate,${stats.attendanceRate}\n\n`;
    
    // Add student records
    csvContent += "STUDENT RECORDS\n";
    csvContent += "Student ID,Name,Class,Email,Phone,Age\n";
    students.forEach(student => {
      csvContent += `${student.studentId || 'N/A'},${student.name || student.username || 'N/A'},${student.class || 'N/A'},${student.email || 'N/A'},${student.parent_phone || 'N/A'},${student.age || 'N/A'}\n`;
    });
    csvContent += "\n";
    
    // Add teacher records
    csvContent += "TEACHER RECORDS\n";
    csvContent += "Name,Subject,Email\n";
    teachers.forEach(teacher => {
      csvContent += `${teacher.name || teacher.username || 'N/A'},${teacher.subject || 'N/A'},${teacher.email || 'N/A'}\n`;
    });
    csvContent += "\n";
    
    // Add payment records
    csvContent += "PAYMENT RECORDS\n";
    csvContent += "Student ID,Student Name,Amount,Date,Status,Description\n";
    payments.forEach(payment => {
      const date = payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A';
      csvContent += `${payment.studentId || 'N/A'},${payment.studentName || 'N/A'},${payment.amount || 0},${date},${payment.status || 'N/A'},${payment.description || 'N/A'}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `School_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Academic & Financial Reports</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Live analytics directly from the secure database</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Download size={18} /> Export CSV Report
        </button>
      </header>

      {/* Database Driven Stats */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
        <div className="glass" style={{ padding: '24px', flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Registered Students</p>
            <h3 style={{ fontSize: '1.8rem' }}>{stats.totalStudents}</h3>
          </div>
          <div style={{ color: '#6366f1', background: '#6366f120', padding: '10px', borderRadius: '10px' }}><Users size={24} /></div>
        </div>
        <div className="glass" style={{ padding: '24px', flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Teachers</p>
            <h3 style={{ fontSize: '1.8rem' }}>{stats.totalTeachers}</h3>
          </div>
          <div style={{ color: '#0ea5e9', background: '#0ea5e920', padding: '10px', borderRadius: '10px' }}><UserSquare2 size={24} /></div>
        </div>
        <div className="glass" style={{ padding: '24px', flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Gross Revenue</p>
            <h3 style={{ fontSize: '1.8rem', color: '#22c55e' }}>${stats.totalRevenue}</h3>
          </div>
          <div style={{ color: '#22c55e', background: '#22c55e20', padding: '10px', borderRadius: '10px' }}><DollarSign size={24} /></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
        <div className="glass" style={{ padding: '24px', height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <BarChart3 size={48} color="var(--primary)" style={{ marginBottom: '20px' }} />
          <h3>Grade Distribution</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Visual representation of student performance</p>
        </div>

        <div className="glass" style={{ padding: '24px', height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <PieChart size={48} color="var(--secondary)" style={{ marginBottom: '20px' }} />
          <h3>Revenue Sources</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tuition vs. Other Fees analysis</p>
        </div>
      </div>

      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '20px' }}>Monthly Growth Model</h3>
        <div style={{ height: '100px', width: '100%', background: 'var(--glass-bg)', borderRadius: '12px', display: 'flex', alignItems: 'flex-end', gap: '10px', padding: '10px' }}>
          {[40, 60, 45, 80, 55, 90, 70, 85].map((h, i) => (
            <div key={i} style={{ flex: 1, background: 'var(--primary)', height: `${h}%`, borderRadius: '4px 4px 0 0', opacity: 0.7 }}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
