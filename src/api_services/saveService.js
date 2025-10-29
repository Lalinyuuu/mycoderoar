/**
 * Save Service
 * Handles post save/unsave operations
 */

import api from '../api';
import { handleApiCall } from '@/utils/apiHelpers';

/**
 * Save a post
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Result
 */
export const savePost = async (postId) => {
  return await handleApiCall(
    () => api.post(`/api/interactions/posts/${postId}/save`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to save post'
    }
  );
};

/**
 * Unsave a post
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Result
 */
export const unsavePost = async (postId) => {
  return await handleApiCall(
    () => api.delete(`/api/interactions/posts/${postId}/save`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to unsave post'
    }
  );
};

/**
 * Check if user has saved a post
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Result
 */
export const checkSaveStatus = async (postId) => {
  return await handleApiCall(
    () => api.get(`/api/interactions/posts/${postId}/save-status`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to check save status'
    }
  );
};

/**
 * Get user's saved posts
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Result
 */
export const getSavedPosts = async (options = {}) => {
  const { page = 1, limit = 20, sort = 'newest' } = options;
  
  return await handleApiCall(
    () => api.get('/api/interactions/saved-posts', {
      params: { page, limit, sort },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to get saved posts'
    }
  );
};
