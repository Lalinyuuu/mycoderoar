/**
 * Comment Interactions
 * Like, unlike comments
 */

import apiClient from '../apiClient.js';
import { handleApiError, checkAuth, createAuthHeaders } from '../utils/errorHandler.js';

/**
 * Like a comment
 * @param {string} commentId - Comment ID
 * @returns {Promise<Object>} Result
 */
export const likeComment = async (commentId) => {
  try {
    const authCheck = checkAuth();
    if (!authCheck.success) return authCheck;

    const response = await apiClient.post(
      `/api/interactions/comments/${commentId}/like`,
      {},
      { headers: createAuthHeaders(authCheck.token) }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, 'Failed to like comment');
  }
};

/**
 * Unlike a comment
 * @param {string} commentId - Comment ID
 * @returns {Promise<Object>} Result
 */
export const unlikeComment = async (commentId) => {
  try {
    const authCheck = checkAuth();
    if (!authCheck.success) return authCheck;

    const response = await apiClient.delete(
      `/api/interactions/comments/${commentId}/like`,
      { headers: createAuthHeaders(authCheck.token) }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, 'Failed to unlike comment');
  }
};
