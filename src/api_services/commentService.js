/**
 * Comment Service
 * Handles comment operations
 */

import api from '../api';
import { handleApiCall } from '@/utils/apiHelpers';

/**
 * Get post comments
 * @param {string} postId - Post ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Result
 */
export const getPostComments = async (postId, options = {}) => {
  const { page = 1, limit = 20, sort = 'newest' } = options;
  
  return await handleApiCall(
    () => api.get(`/api/posts/${postId}/comments`, {
      params: { page, limit, sort },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to get comments'
    }
  );
};

/**
 * Add a comment to a post
 * @param {string} postId - Post ID
 * @param {string} content - Comment content
 * @param {string} parentId - Parent comment ID (for replies)
 * @returns {Promise<Object>} Result
 */
export const addComment = async (postId, content, parentId = null) => {
  const payload = { content };
  if (parentId) {
    payload.parentId = parentId;
  }

  return await handleApiCall(
    () => api.post(`/api/posts/${postId}/comments`, payload, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to add comment'
    }
  );
};

/**
 * Update a comment
 * @param {string} commentId - Comment ID
 * @param {string} content - New comment content
 * @returns {Promise<Object>} Result
 */
export const updateComment = async (commentId, content) => {
  return await handleApiCall(
    () => api.put(`/api/comments/comments/${commentId}`, { content }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to update comment'
    }
  );
};

/**
 * Delete a comment
 * @param {string} commentId - Comment ID
 * @returns {Promise<Object>} Result
 */
export const deleteComment = async (commentId) => {
  return await handleApiCall(
    () => api.delete(`/api/comments/comments/${commentId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to delete comment'
    }
  );
};

/**
 * Like a comment
 * @param {string} commentId - Comment ID
 * @returns {Promise<Object>} Result
 */
export const likeComment = async (commentId) => {
  return await handleApiCall(
    () => api.post(`/api/interactions/comments/${commentId}/like`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to like comment'
    }
  );
};

/**
 * Unlike a comment
 * @param {string} commentId - Comment ID
 * @returns {Promise<Object>} Result
 */
export const unlikeComment = async (commentId) => {
  return await handleApiCall(
    () => api.delete(`/api/interactions/comments/${commentId}/like`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to unlike comment'
    }
  );
};
