/**
 * Like Service
 * Handles post like/unlike operations
 */

import api from '../api';
import { handleApiCall } from '@/utils/apiHelpers';

/**
 * Like a post
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Result
 */
export const likePost = async (postId) => {
  
  const result = await handleApiCall(
    () => api.post(`/api/posts/${postId}/like`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to like post'
    }
  );
  
  return result;
};

/**
 * Unlike a post
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Result
 */
export const unlikePost = async (postId) => {
  
  const result = await handleApiCall(
    () => api.delete(`/api/interactions/posts/${postId}/like`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to unlike post'
    }
  );
  
  return result;
};

/**
 * Check if user has liked a post
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Result
 */
export const checkLikeStatus = async (postId) => {
  return await handleApiCall(
    () => api.get(`/api/interactions/posts/${postId}/like-status`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to check like status'
    }
  );
};

/**
 * Get post likes count
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Result
 */
export const getPostLikesCount = async (postId) => {
  return await handleApiCall(
    () => api.get(`/api/interactions/posts/${postId}/likes-count`),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to get likes count'
    }
  );
};
