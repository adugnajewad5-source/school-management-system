/**
 * Parent API Service
 * Handles all API calls for parent portal functionality
 * Includes JWT token management and error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com/api';

/**
 * Get JWT token from localStorage
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Make API request with JWT token
 */
const apiCall = async (endpoint, options = {}) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error codes
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error(data.message || 'Session expired');
      }

      if (response.status === 403) {
        throw new Error(data.message || 'Access denied');
      }

      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

/**
 * Get all children for logged-in parent
 * GET /api/parent/children
 */
export const getChildren = async () => {
  return apiCall('/parent/children');
};

/**
 * Get child's profile information
 * GET /api/parent/child/:studentId/profile
 */
export const getChildProfile = async (studentId) => {
  return apiCall(`/parent/child/${studentId}/profile`);
};

/**
 * Get child's academic results
 * GET /api/parent/child/:studentId/results
 */
export const getChildResults = async (studentId, page = 1) => {
  return apiCall(`/parent/child/${studentId}/results?page=${page}`);
};

/**
 * Get child's attendance records
 * GET /api/parent/child/:studentId/attendance
 */
export const getChildAttendance = async (studentId, days = 30) => {
  return apiCall(`/parent/child/${studentId}/attendance?days=${days}`);
};

/**
 * Get child's payment history
 * GET /api/parent/child/:studentId/payments
 */
export const getChildPayments = async (studentId) => {
  return apiCall(`/parent/child/${studentId}/payments`);
};

export default {
  getChildren,
  getChildProfile,
  getChildResults,
  getChildAttendance,
  getChildPayments
};
