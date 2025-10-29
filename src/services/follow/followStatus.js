/**
 * Follow Status and Statistics
 * Functions for checking follow status and getting follow statistics
 */

import api from '../../api/index.js';
import { handleApiError, checkAuth, createAuthHeaders } from '../utils/errorHandler.js';

/**
 * Check follow status between current user and target user
 * @param {string} userId - ID of the user to check
 * @returns {Promise<Object>} Follow status
 */
export const checkFollowStatus = async (userId) => {
  try {
    const authCheck = checkAuth();
    if (!authCheck.success) return authCheck;

    const response = await api.get(`/api/follow/status/${userId}`, {
      headers: createAuthHeaders(authCheck.token)
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, 'Failed to check follow status');
  }
};

/**
 * Get follow statistics for a user
 * @param {string} userId - ID of the user
 * @returns {Promise<Object>} Follow statistics
 */
export const getFollowStats = async (userId) => {
  try {
    const response = await api.get(`/api/follow/stats/${userId}`);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, 'Failed to get follow statistics');
  }
};

/**
 * Get follow statistics for current user
 * @returns {Promise<Object>} Current user's follow statistics
 */
export const getMyFollowStats = async () => {
  try {
    const authCheck = checkAuth();
    if (!authCheck.success) return authCheck;

    const response = await api.get('/api/follow/my-stats', {
      headers: createAuthHeaders(authCheck.token)
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, 'Failed to get your follow statistics');
  }
};
