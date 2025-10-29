/**
 * Users API Service
 * Handles all user-related API calls
 */

import api from '../api/index.js';

/**
 * Get user profile by ID
 * @param {string} userId - ID of the user
 * @returns {Promise<Object>} User profile data
 */
export const getUserById = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        success: false,
        error: 'Please sign in to view this profile'
      };
    }

    // ใช้ API endpoint ที่ถูกต้องสำหรับดึงข้อมูล user
    const response = await api.get(`/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get user profile'
    };
  }
};

/**
 * Get user posts by user ID
 * @param {string} userId - ID of the user
 * @param {Object} options - Pagination options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @returns {Promise<Object>} User posts
 */
export const getUserPosts = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 6 } = options;
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        success: false,
        error: 'Please sign in to view posts'
      };
    }


    // ใช้ API endpoint ที่ถูกต้องสำหรับดึง posts ของ user
    const response = await api.get(`/api/users/${userId}/posts?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    
    // ตรวจสอบและ normalize ข้อมูล
    const posts = response.data?.data?.posts || response.data?.posts || response.data?.data || [];
    
    return {
      success: true,
      data: {
        posts: Array.isArray(posts) ? posts : [],
        pagination: response.data?.pagination || {
          page: 1,
          limit: limit,
          total: posts.length,
          totalPages: 1
        }
      }
    };
  } catch (error) {
    
    // Fallback: return empty posts if API fails
    return {
      success: true,
      data: {
        posts: [],
        pagination: {
          page: 1,
          limit: 6,
          total: 0,
          totalPages: 0
        }
      },
      isFallback: true
    };
  }
};

/**
 * Get current user profile
 * @returns {Promise<Object>} Current user profile
 */
export const getCurrentUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        success: false,
        error: 'Please sign in to continue'
      };
    }

    // ใช้ API ที่มีอยู่จริง - เรียก auth/me endpoint
    const response = await api.get(`/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get current user profile'
    };
  }
};

export default {
  getUserById,
  getUserPosts,
  getCurrentUserProfile
};
