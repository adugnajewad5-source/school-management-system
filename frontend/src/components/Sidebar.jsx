import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  CalendarCheck,
  GraduationCap,
  CreditCard,
  BarChart3,
  CalendarDays,
  LogOut,
  UserPlus,
  Settings,
  FileUp,
  Inbox
} from 'lucide-react';

const Sidebar = ({ role, onLogout }) => {
  const menuItems = {
    student: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/student' },
      { name: 'Results', icon: GraduationCap, path: '/results' },
      { name: 'Submit PDF', icon: FileUp, path: '/submit-pdf' },
      { name: 'Timetable', icon: CalendarDays, path: '/timetable' },
      { name: 'Payments', icon: CreditCard, path: '/payments' },
    ],
    teacher: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/teacher' },
      { name: 'Students', icon: Users, path: '/students' },
      { name: 'Submissions', icon: Inbox, path: '/submissions' },
      { name: 'Attendance', icon: CalendarCheck, path: '/attendance' },
      { name: 'Results', icon: GraduationCap, path: '/results' },
    ],
    admin: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
      { name: 'Students', icon: Users, path: '/students' },
      { name: 'Teachers', icon: UserSquare2, path: '/teachers' },
      { name: 'Payments', icon: CreditCard, path: '/payments' },
      { name: 'Reports', icon: BarChart3, path: '/reports' },
      { name: 'Accounts', icon: UserPlus, path: '/register' },
      { name: 'Settings', icon: Settings, path: '/settings' },
    ],
    parent: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/parent' },
      { name: 'Results', icon: GraduationCap, path: '/results' },
      { name: 'Attendance', icon: CalendarCheck, path: '/attendance' },
    ]
  };

  const currentMenu = menuItems[role] || [];

  return (
    <div className="sidebar glass" style={{
      width: '260px',
      height: 'calc(100vh - 40px)',
      margin: '20px',
      padding: '20px',
      position: 'fixed',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '40px', color: 'var(--primary)' }}>
        EduPulse Academy
      </div>

      <nav style={{ flex: 1 }}>
        {currentMenu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              marginBottom: '8px',
              borderRadius: '12px',
              textDecoration: 'none',
              color: isActive ? 'white' : 'var(--text-secondary)',
              background: isActive ? 'var(--primary)' : 'transparent',
              transition: '0.3s'
            })}
          >
            <item.icon size={20} style={{ marginRight: '12px' }} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <button
        className="btn-primary"
        onClick={onLogout}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent)' }}
      >
        <LogOut size={18} style={{ marginRight: '8px' }} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
