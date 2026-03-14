import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserSquare2,
  CreditCard,
  BarChart3,
  UserPlus,
  Settings,
  ShieldCheck
} from 'lucide-react';

const DashboardMenuCard = ({ title, description, icon: Icon, color, path }) => {
  const navigate = useNavigate();

  return (
    <div
      className="glass"
      onClick={() => navigate(path)}
      style={{
        padding: '24px',
        flex: 1,
        minWidth: '250px',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = `0 10px 20px -10px ${color}`;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{
        background: `${color}20`,
        color: color,
        padding: '16px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={32} />
      </div>
      <div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>{description}</p>
      </div>
    </div>
  );
};

const DirectorDashboard = () => {
  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={32} color="var(--primary)" /> Director Console
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Full System Control & Management</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        <DashboardMenuCard
          title="Pre-Register Student"
          description="Create student records with temporary passwords for registration."
          icon={UserPlus}
          color="#10b981"
          path="/pre-register-student"
        />
        <DashboardMenuCard
          title="Manage Students"
          description="View, add, edit, or delete student records and assign classes."
          icon={Users}
          color="#6366f1"
          path="/students"
        />
        <DashboardMenuCard
          title="Manage Teachers"
          description="Oversee teacher profiles, assign subjects, and update details."
          icon={UserSquare2}
          color="#0ea5e9"
          path="/teachers"
        />
        <DashboardMenuCard
          title="Financial Payments"
          description="Record student payments, track history, and manage school fees."
          icon={CreditCard}
          color="#22c55e"
          path="/payments"
        />
        <DashboardMenuCard
          title="System Reports"
          description="Analyze academic, financial, attendance, and teacher reports."
          icon={BarChart3}
          color="#f59e0b"
          path="/reports"
        />
        <DashboardMenuCard
          title="System Settings"
          description="Configure school settings, permissions, and app preferences."
          icon={Settings}
          color="#8b5cf6"
          path="/settings"
        />
      </div>
    </div>
  );
};

export default DirectorDashboard;
