import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import DirectorDashboard from './pages/DirectorDashboard';
import ParentDashboard from './pages/ParentDashboard';
import AttendancePage from './pages/AttendancePage';
import ResultPage from './pages/ResultPage';
import PaymentPage from './pages/PaymentPage';
import TimetablePage from './pages/TimetablePage';
import ReportsPage from './pages/ReportsPage';
import ChangePassword from './pages/ChangePassword';
import StudentTable from './components/StudentTable';
import TeacherTable from './components/TeacherTable';
import PreRegisterStudent from './components/PreRegisterStudent';
import AccessDenied from './pages/AccessDenied';
import SettingsPage from './pages/SettingsPage';
import SubmitPDFPage from './pages/SubmitPDFPage';
import SubmissionsPage from './pages/SubmissionsPage';

// 🛡️ Protected Route Component
const ProtectedRoute = ({ user, children, allowedRoles }) => {
  const location = useLocation();
  
  if (!user) {
    // If no user is logged in, redirect to login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user role is not allowed for this route, redirect to Access Denied
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

// Error Boundary Component for routing errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Routing Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1 style={{ color: '#f43f5e', marginBottom: '20px' }}>Something went wrong</h1>
          <p style={{ color: '#64748b', marginBottom: '30px' }}>
            There was an error loading this page. Please try refreshing or go back to the home page.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Go to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  // Authentication State - Defaults to NULL (Logged Out)
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Apply admin theme to body when admin is logged in
  React.useEffect(() => {
    if (user && user.role === 'admin') {
      document.body.classList.add('admin-theme');
    } else {
      document.body.classList.remove('admin-theme');
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    document.body.classList.remove('admin-theme');
    navigate('/login');
  };

  return (
    <ErrorBoundary>
      <div className="app-container" style={{ display: 'flex' }}>
        {user && <Sidebar role={user.role} onLogout={handleLogout} />}

        <main style={{
          marginLeft: user ? '300px' : '0',
          width: '100%',
          padding: user ? '40px' : '0',
          minHeight: '100vh',
          transition: 'margin 0.3s'
        }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage onLogin={(u) => setUser(u)} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="/change-password" element={
              <ProtectedRoute user={user}><ChangePassword /></ProtectedRoute>
            } />

            {/* 🔐 Protected Role-Based Dashboards */}
            <Route path="/student" element={
              <ProtectedRoute user={user} allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>
            } />
            <Route path="/teacher" element={
              <ProtectedRoute user={user} allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute user={user} allowedRoles={['admin']}><DirectorDashboard /></ProtectedRoute>
            } />
            <Route path="/parent" element={
              <ProtectedRoute user={user} allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>
            } />
            <Route path="/parent-dashboard" element={
              <ProtectedRoute user={user} allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>
            } />

            {/* 🔐 Protected Pages */}
            <Route path="/attendance" element={
              <ProtectedRoute user={user} allowedRoles={['teacher', 'admin']}><AttendancePage /></ProtectedRoute>
            } />
            <Route path="/results" element={
              <ProtectedRoute user={user} allowedRoles={['teacher', 'admin', 'student']}><ResultPage user={user} /></ProtectedRoute>
            } />
            <Route path="/payments" element={
              <ProtectedRoute user={user} allowedRoles={['parent', 'admin']}><PaymentPage /></ProtectedRoute>
            } />
            <Route path="/timetable" element={
              <ProtectedRoute user={user}><TimetablePage /></ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute user={user} allowedRoles={['admin']}><ReportsPage /></ProtectedRoute>
            } />
            <Route path="/students" element={
              <ProtectedRoute user={user} allowedRoles={['admin', 'teacher']}><StudentTable /></ProtectedRoute>
            } />
            <Route path="/pre-register-student" element={
              <ProtectedRoute user={user} allowedRoles={['admin']}><PreRegisterStudent /></ProtectedRoute>
            } />
            <Route path="/teachers" element={
              <ProtectedRoute user={user} allowedRoles={['admin']}><TeacherTable /></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute user={user} allowedRoles={['admin']}><SettingsPage /></ProtectedRoute>
            } />
            <Route path="/submit-pdf" element={
              <ProtectedRoute user={user} allowedRoles={['student']}><SubmitPDFPage user={user} /></ProtectedRoute>
            } />
            <Route path="/submissions" element={
              <ProtectedRoute user={user} allowedRoles={['teacher', 'admin']}><SubmissionsPage /></ProtectedRoute>
            } />

            {/* Catch-all route for 404 errors */}
            <Route path="*" element={
              user ? (
                <div style={{ 
                  padding: '40px', 
                  textAlign: 'center',
                  minHeight: '50vh',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <h1 style={{ color: '#f43f5e', marginBottom: '20px' }}>Page Not Found</h1>
                  <p style={{ color: '#64748b', marginBottom: '30px' }}>
                    The page you're looking for doesn't exist.
                  </p>
                  <button 
                    onClick={() => navigate(user.role === 'admin' ? '/admin' : `/${user.role}`)}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Go to Dashboard
                  </button>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            } />

            {/* Default Redirect Logic */}
            <Route path="/" element={
              user ? <Navigate to={user.role === 'admin' ? '/admin' : `/${user.role}`} /> : <Navigate to="/login" />
            } />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
