import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle2, AlertCircle } from 'lucide-react';

const NotificationsPanel = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.studentId) {
      fetchNotifications();
      fetchUnreadCount();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchNotifications();
        fetchUnreadCount();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `http://${window.location.hostname}:5000/api/notifications/student/${user.studentId}`
      );
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(
        `http://${window.location.hostname}:5000/api/notifications/student/${user.studentId}/unread-count`
      );
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(
        `http://${window.location.hostname}:5000/api/notifications/${notificationId}/read`,
        { method: 'PUT' }
      );
      fetchNotifications();
      fetchUnreadCount();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    if (type === 'marks') {
      return <CheckCircle2 size={20} style={{ color: '#22c55e' }} />;
    }
    return <AlertCircle size={20} style={{ color: '#0ea5e9' }} />;
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Notification Bell Icon */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Bell size={24} color="var(--primary)" />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              background: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {showPanel && (
        <div
          style={{
            position: 'absolute',
            top: '50px',
            right: '0',
            background: 'var(--glass-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            width: '350px',
            maxHeight: '500px',
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            zIndex: 1000
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h3 style={{ margin: 0 }}>Notifications</h3>
            <button
              onClick={() => setShowPanel(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Notifications List */}
          <div>
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  color: 'var(--text-secondary)'
                }}
              >
                <Bell size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.is_read && markAsRead(notif.id)}
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    background: notif.is_read ? 'transparent' : 'rgba(63, 81, 181, 0.05)',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(63, 81, 181, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = notif.is_read
                      ? 'transparent'
                      : 'rgba(63, 81, 181, 0.05)';
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ marginTop: '4px' }}>
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          margin: '0 0 4px 0',
                          fontWeight: notif.is_read ? '500' : '600',
                          color: notif.is_read ? 'var(--text-secondary)' : 'white'
                        }}
                      >
                        {notif.title}
                      </h4>
                      <p
                        style={{
                          margin: '0 0 8px 0',
                          fontSize: '14px',
                          color: 'var(--text-secondary)',
                          lineHeight: '1.4'
                        }}
                      >
                        {notif.message}
                      </p>
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          opacity: 0.7
                        }}
                      >
                        {new Date(notif.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {!notif.is_read && (
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: 'var(--primary)',
                          marginTop: '8px'
                        }}
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;
