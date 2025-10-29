/**
 * Share Service
 * Handles post sharing operations
 */

import api from '../api';
import { handleApiCall } from '@/utils/apiHelpers';

/**
 * Share a post
 * @param {string} postId - Post ID
 * @param {string} platform - Sharing platform
 * @returns {Promise<Object>} Result
 */
export const sharePost = async (postId, platform = 'general') => {
  return await handleApiCall(
    () => api.post(`/api/interactions/posts/${postId}/share`, { platform }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to share post'
    }
  );
};

/**
 * Get post share count
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Result
 */
export const getPostShareCount = async (postId) => {
  return await handleApiCall(
    () => api.get(`/api/interactions/posts/${postId}/share-count`),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to get share count'
    }
  );
};

/**
 * Track post view
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Result
 */
export const trackPostView = async (postId) => {
  return await handleApiCall(
    () => api.post(`/api/interactions/posts/${postId}/view`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to track view'
    }
  );
};

/**
 * Get post stats (likes, comments, shares, views)
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Result
 */
export const getPostStats = async (postId) => {
  return await handleApiCall(
    () => api.get(`/api/interactions/posts/${postId}/stats`),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to get post stats'
    }
  );
};
