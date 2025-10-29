/**
 * Follow Stats Service
 * Handles follow statistics and counts
 */

import api from '../api/index.js';
import { handleApiCall } from '@/utils/apiHelpers';

/**
 * Get follow statistics for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Follow stats result
 */
export const getFollowStats = async (userId) => {
  try {
    // Use the correct endpoint from API documentation
    const result = await handleApiCall(
      () => api.get(`/api/follow/users/${userId}/follow-stats`),
      {
        showErrorToast: false,
        fallbackMessage: 'Failed to get follow stats'
      }
    );

    if (result.success) {
      return result;
    }

    // Fallback: return default stats if endpoint doesn't exist
    return {
      success: true,
      data: {
        followersCount: 0,
        followingCount: 0,
        postsCount: 0
      },
      isFallback: true
    };
  } catch (error) {
    return {
      success: true,
      data: {
        followersCount: 0,
        followingCount: 0,
        postsCount: 0
      },
      isFallback: true
    };
  }
};

/**
 * Get follow counts for multiple users
 * @param {string[]} userIds - Array of user IDs
 * @returns {Promise<Object>} Follow counts result
 */
export const getFollowCounts = async (userIds) => {
  return await handleApiCall(
    () => api.post('/api/follow/counts', { userIds }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to get follow counts'
    }
  );
};
