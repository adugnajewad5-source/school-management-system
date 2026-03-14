import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, BookOpen, Loader } from 'lucide-react';
import * as parentApi from '../services/parentApi';

/**
 * ParentChildProfilePage Component
 * Displays child's profile information in read-only format
 * Validates: Requirements 13.1, 13.2, 13.4
 */
const ParentChildProfilePage = ({ selectedChild }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedChild) {
      setError('No child selected');
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await parentApi.getChildProfile(selectedChild.id);
        setProfile(data.profile);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [selectedChild]);

  if (!selectedChild) {
    return (
      <div className="profile-page">
        <div className="error-message">
          <p>Please select a child to view their profile</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <Loader className="spinner" size={40} />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="error-message">
          <p>No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Child Profile</h1>
        <p className="subtitle">View {profile.name}'s enrollment details</p>
      </div>

      <div className="profile-container">
        {/* Personal Information Section */}
        <div className="profile-section">
          <h2 className="section-title">
            <User size={20} />
            Personal Information
          </h2>
          <div className="profile-grid">
            <div className="profile-item">
              <label>Student ID</label>
              <p className="profile-value">{profile.student_id}</p>
            </div>
            <div className="profile-item">
              <label>Full Name</label>
              <p className="profile-value">{profile.name}</p>
            </div>
            <div className="profile-item">
              <label>Age</label>
              <p className="profile-value">{profile.age || 'N/A'}</p>
            </div>
            <div className="profile-item">
              <label>Parent Phone</label>
              <p className="profile-value">
                <Phone size={16} className="inline-icon" />
                {profile.parent_phone || 'Not provided'}
              </p>
            </div>
          </div>
        </div>

        {/* Academic Information Section */}
        <div className="profile-section">
          <h2 className="section-title">
            <BookOpen size={20} />
            Academic Information
          </h2>
          <div className="profile-grid">
            <div className="profile-item">
              <label>Class</label>
              <p className="profile-value">{profile.class}</p>
            </div>
            <div className="profile-item">
              <label>Section</label>
              <p className="profile-value">{profile.section}</p>
            </div>
            <div className="profile-item">
              <label>Enrollment Date</label>
              <p className="profile-value">
                <Calendar size={16} className="inline-icon" />
                {profile.enrollment_date 
                  ? new Date(profile.enrollment_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Teachers Section */}
        {profile.teachers && profile.teachers.length > 0 && (
          <div className="profile-section">
            <h2 className="section-title">
              <BookOpen size={20} />
              Assigned Teachers
            </h2>
            <div className="teachers-list">
              {profile.teachers.map(teacher => (
                <div key={teacher.id} className="teacher-card">
                  <div className="teacher-info">
                    <h3>{teacher.name}</h3>
                    <p className="teacher-role">{teacher.role}</p>
                  </div>
                  <div className="teacher-contact">
                    <a href={`mailto:${teacher.email}`} className="contact-link">
                      <Mail size={16} />
                      {teacher.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Read-Only Notice */}
        <div className="read-only-notice">
          <p>ℹ️ This information is read-only. To update any details, please contact the school administration.</p>
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          padding: 2rem 0;
        }

        .profile-header {
          margin-bottom: 2rem;
        }

        .profile-header h1 {
          font-size: 2rem;
          margin: 0 0 0.5rem 0;
          color: var(--text-primary);
        }

        .subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 1rem;
        }

        .profile-container {
          background: var(--bg-secondary);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .profile-section {
          margin-bottom: 2.5rem;
        }

        .profile-section:last-of-type {
          margin-bottom: 1.5rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.3rem;
          margin: 0 0 1.5rem 0;
          color: var(--text-primary);
          border-bottom: 2px solid var(--border-color);
          padding-bottom: 0.75rem;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .profile-item {
          display: flex;
          flex-direction: column;
        }

        .profile-item label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .profile-value {
          font-size: 1.1rem;
          color: var(--text-primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .inline-icon {
          color: var(--primary-color);
          flex-shrink: 0;
        }

        .teachers-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }

        .teacher-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }

        .teacher-card:hover {
          border-color: var(--primary-color);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .teacher-info h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
          color: var(--text-primary);
        }

        .teacher-role {
          margin: 0;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .teacher-contact {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .contact-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary-color);
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .contact-link:hover {
          text-decoration: underline;
        }

        .read-only-notice {
          background: var(--bg-primary);
          border-left: 4px solid var(--primary-color);
          padding: 1rem;
          border-radius: 4px;
          margin-top: 2rem;
        }

        .read-only-notice p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          gap: 1rem;
        }

        .spinner {
          animation: spin 1s linear infinite;
          color: var(--primary-color);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          border-radius: 8px;
          padding: 1.5rem;
          color: #c33;
          text-align: center;
        }

        @media (max-width: 768px) {
          .profile-container {
            padding: 1.5rem;
          }

          .profile-grid {
            grid-template-columns: 1fr;
          }

          .teachers-list {
            grid-template-columns: 1fr;
          }

          .teacher-card {
            flex-direction: column;
            align-items: flex-start;
          }

          .teacher-contact {
            width: 100%;
            margin-top: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ParentChildProfilePage;
