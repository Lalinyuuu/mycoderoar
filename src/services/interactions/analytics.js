/**
 * Analytics and Tracking
 * Functions for tracking views and getting analytics
 */

import apiClient from '../apiClient.js';
import { handleApiCall } from '@/utils/apiHelpers';

/**
 * Track post view
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Result
 */
export const trackView = async (postId) => {
  return await handleApiCall(
    () => apiClient.post(`/api/interactions/posts/${postId}/view`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to track view'
    }
  );
};

/**
 * Get post statistics
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Post statistics
 */
export const getPostStats = async (postId) => {
  return await handleApiCall(
    () => apiClient.get(`/api/interactions/posts/${postId}/stats`),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to get post statistics'
    }
  );
};

/**
 * Get user's interaction history
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Interaction history
 */
export const getInteractionHistory = async (options = {}) => {
  try {
    const authCheck = checkAuth();
    if (!authCheck.success) return authCheck;

    const { page = 1, limit = 20, type = 'all' } = options;
    const params = new URLSearchParams({ page, limit, type });

    const response = await api.get(
      `/api/interactions/history?${params}`,
      { headers: createAuthHeaders(authCheck.token) }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, 'Failed to get interaction history');
  }
};
