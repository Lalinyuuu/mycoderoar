/**
 * Follow Lists
 * Functions for getting followers and following lists
 */

import api from '../../api/index.js';
import { handleApiError, checkAuth, createAuthHeaders } from '../utils/errorHandler.js';

/**
 * Get followers list for a user
 * @param {string} userId - ID of the user
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Followers list
 */
export const getFollowers = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 20, search = '' } = options;
    const params = new URLSearchParams({ page, limit });
    if (search) params.append('search', search);

    const response = await api.get(`/api/follow/followers/${userId}?${params}`);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, 'Failed to get followers');
  }
};

/**
 * Get following list for a user
 * @param {string} userId - ID of the user
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Following list
 */
export const getFollowing = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 20, search = '' } = options;
    const params = new URLSearchParams({ page, limit });
    if (search) params.append('search', search);

    const response = await api.get(`/api/follow/following/${userId}?${params}`);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, 'Failed to get following list');
  }
};

/**
 * Get mutual follows between current user and target user
 * @param {string} userId - ID of the target user
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Mutual follows list
 */
export const getMutualFollows = async (userId, options = {}) => {
  try {
    const authCheck = checkAuth();
    if (!authCheck.success) return authCheck;

    const { page = 1, limit = 20 } = options;
    const params = new URLSearchParams({ page, limit });

    const response = await api.get(`/api/follow/mutual/${userId}?${params}`, {
      headers: createAuthHeaders(authCheck.token)
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, 'Failed to get mutual follows');
  }
};
