/**
 * Follow User Service
 * Handles user follow/unfollow operations
 */

import api from '../api/index.js';

/**
 * Follow a user
 * @param {string} userId - ID of the user to follow
 * @returns {Promise<Object>} Follow result
 */
export const followUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }

    const response = await api.post(`/api/follow/${userId}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    
    // Handle specific error cases
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Bad request';
      return {
        success: false,
        error: errorMessage
      };
    }
    
    if (error.response?.status === 401) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }
    
    if (error.response?.status === 409) {
      // Already following
      return {
        success: true,
        data: {
          message: 'Already following this user',
          isFollowing: true
        }
      };
    }
    
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to follow user'
    };
  }
};

/**
 * Unfollow a user
 * @param {string} userId - ID of the user to unfollow
 * @returns {Promise<Object>} Unfollow result
 */
export const unfollowUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }

    const response = await api.delete(`/api/follow/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    
    // Handle specific error cases
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Bad request';
      return {
        success: false,
        error: errorMessage
      };
    }
    
    if (error.response?.status === 401) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }
    
    if (error.response?.status === 404) {
      // Not following
      return {
        success: true,
        data: {
          message: 'Not following this user',
          isFollowing: false
        }
      };
    }
    
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to unfollow user'
    };
  }
};

/**
 * Check follow status between current user and target user
 * @param {string} userId - Target user ID
 * @returns {Promise<Object>} Follow status result
 */
export const checkFollowStatus = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }

    const response = await api.get(`/api/follow/${userId}/status`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    
    // Handle specific error cases
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Bad request';
      return {
        success: false,
        error: errorMessage
      };
    }
    
    if (error.response?.status === 401) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }
    
    if (error.response?.status === 404) {
      // User not found or not following
      return {
        success: true,
        data: {
          isFollowing: false
        }
      };
    }
    
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to check follow status'
    };
  }
};
