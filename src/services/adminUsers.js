/**
 * Admin Users API Service
 * Handles all admin user-related API calls
 */

import api from '../api/index.js';

/**
 * Get all users (admin only)
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search keyword
 * @returns {Promise<Object>} Users list with pagination
 */
export const adminListUsers = async (params = {}) => {
  try {
    const { data } = await api.get('/api/admin/users', { params });
    
    // Return the actual data, not wrapped in success/data structure
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user role (admin only)
 * @param {string} userId - User ID
 * @param {Object} payload - Role update payload
 * @param {string} payload.role - New role ('admin' | 'user')
 * @returns {Promise<Object>} Updated user data
 */
export const adminUpdateUserRole = async (userId, payload) => {
  try {
    
    // Validate userId
    if (!userId || userId === 'undefined' || userId === 'null') {
      throw new Error('Invalid user ID provided');
    }
    
    const { data } = await api.put(`/api/admin/users/${userId}/role`, payload);
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete user (admin only)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Deletion result
 */
export const adminDeleteUser = async (userId) => {
  try {
    
    // Validate userId
    if (!userId || userId === 'undefined' || userId === 'null') {
      throw new Error('Invalid user ID provided');
    }
    
    const { data } = await api.delete(`/api/admin/users/${userId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export default {
  adminListUsers,
  adminUpdateUserRole,
  adminDeleteUser
};
