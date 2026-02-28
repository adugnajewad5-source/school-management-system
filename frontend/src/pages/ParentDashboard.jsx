import React, { useState, useEffect } from 'react';
import { Sun, Moon, User, BookOpen, Calendar, DollarSign, GraduationCap } from 'lucide-react';

const ParentDashboard = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'bright');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'bright' ? 'dark' : 'bright');
  };
  
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const MenuCard = ({ title, description, icon: Icon, color, onClick }) => (
    <div
      className="menu-card"
      onClick={onClick}
      style={{
        '--card-color': color
      }}
    >
      <div className="menu-card-icon" style={{ background: `${color}20`, color }}>
        <Icon size={32} />
      </div>
      <div className="menu-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
  
  return (
    <div className="parent-dashboard">
      {/* Header with Theme Toggle */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <GraduationCap size={40} className="logo-icon" />
            <div>
              <h1>Parent Portal</h1>
              <p className="subtitle">Monitor Your Child's Progress</p>
            </div>
          </div>
          
          <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'bright' ? 'dark' : 'bright'} mode`}>
            {theme === 'bright' ? <Moon size={24} /> : <Sun size={24} />}
          </button>
        </div>
      </header>
      
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <div className="welcome-icon">👋</div>
          <h2 className="welcome-text">
            WELCOME, Parent!
          </h2>
          <p className="welcome-greeting">{getGreeting()}</p>
          <p className="welcome-datetime">
            {formatDate()} - {formatTime()}
          </p>
        </div>
      </div>
      
      {/* Dashboard Menu */}
      <div className="dashboard-menu">
        <MenuCard
          title="Child Profile"
          description="View your child's personal information and enrollment details"
          icon={User}
          color="#6366f1"
          onClick={() => alert('Child Profile - Coming Soon!')}
        />
        
        <MenuCard
          title="Academic Results"
          description="Check grades, marks, and academic performance"
          icon={BookOpen}
          color="#10b981"
          onClick={() => alert('Academic Results - Coming Soon!')}
        />
        
        <MenuCard
          title="Attendance Records"
          description="Monitor daily attendance and view attendance statistics"
          icon={Calendar}
          color="#f59e0b"
          onClick={() => alert('Attendance Records - Coming Soon!')}
        />
        
        <MenuCard
          title="Payment Status"
          description="View fee payments, history, and outstanding balances"
          icon={DollarSign}
          color="#ef4444"
          onClick={() => alert('Payment Status - Coming Soon!')}
        />
      </div>
      
      <style jsx>{`
        .parent-dashboard {
          min-height: 100vh;
          background: var(--bg-primary);
          color: var(--text-primary);
          transition: all 0.3s ease;
        }
        
        .dashboard-header {
          background: var(--bg-secondary);
          padding: 1.5rem 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .logo-icon {
          color: var(--primary-color);
        }
        
        .dashboard-header h1 {
          margin: 0;
          font-size: 1.8rem;
          color: var(--text-primary);
        }
        
        .subtitle {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        .theme-toggle {
          background: var(--bg-primary);
          border: 2px solid var(--border-color);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: var(--text-primary);
        }
        
        .theme-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .welcome-section {
          background: linear-gradient(135deg, var(--welcome-bg-start) 0%, var(--welcome-bg-end) 100%);
          padding: 3rem 2rem;
          text-align: center;
          animation: fadeIn 0.5s ease-in;
        }
        
        .welcome-content {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .welcome-icon {
          font-size: 4rem;
          animation: wave 1s ease-in-out infinite;
          display: inline-block;
        }
        
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-20deg); }
        }
        
        .welcome-text {
          font-size: 3rem;
          font-weight: 700;
          color: var(--welcome-color);
          margin: 1rem 0;
          text-shadow: var(--welcome-shadow);
          animation: slideIn 0.5s ease-out;
          letter-spacing: 2px;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .welcome-greeting {
          font-size: 1.5rem;
          color: var(--text-primary);
          margin: 0.5rem 0;
          font-weight: 500;
        }
        
        .welcome-datetime {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-top: 0.5rem;
        }
        
        .dashboard-menu {
          max-width: 1200px;
          margin: 3rem auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }
        
        .menu-card {
          background: var(--bg-secondary);
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid var(--border-color);
        }
        
        .menu-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px var(--card-shadow);
          border-color: var(--card-color);
        }
        
        .menu-card-icon {
          width: 70px;
          height: 70px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .menu-card-content h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.3rem;
          color: var(--text-primary);
        }
        
        .menu-card-content p {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        
        @media (max-width: 768px) {
          .welcome-text {
            font-size: 2rem;
          }
          
          .dashboard-menu {
            grid-template-columns: 1fr;
          }
          
          .menu-card {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ParentDashboard;
