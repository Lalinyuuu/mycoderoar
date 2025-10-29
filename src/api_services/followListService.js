/**
 * Follow List Service
 * Handles followers and following lists
 */

import api from '../api/index.js';
import { handleApiCall } from '@/utils/apiHelpers';

/**
 * Get user's followers
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Followers result
 */
export const getFollowers = async (userId, options = {}) => {
  const { page = 1, limit = 20, search = '' } = options;
  
  return await handleApiCall(
    () => api.get(`/api/follow/users/${userId}/followers`, {
      params: { page, limit, search },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to get followers'
    }
  );
};

/**
 * Get user's following list
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Following result
 */
export const getFollowing = async (userId, options = {}) => {
  const { page = 1, limit = 20, search = '' } = options;
  
  return await handleApiCall(
    () => api.get(`/api/follow/users/${userId}/following`, {
      params: { page, limit, search },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to get following list'
    }
  );
};

/**
 * Get mutual followers between current user and target user
 * @param {string} userId - Target user ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Mutual followers result
 */
export const getMutualFollowers = async (userId, options = {}) => {
  const { page = 1, limit = 20 } = options;
  
  return await handleApiCall(
    () => api.get(`/api/follow/${userId}/mutual`, {
      params: { page, limit },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to get mutual followers'
    }
  );
};
