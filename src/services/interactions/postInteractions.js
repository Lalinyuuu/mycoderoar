/**
 * Post Interactions
 * Like, unlike, save, unsave posts
 */

import apiClient from '@/services/apiClient.js';
import { handleApiError, checkAuth, createAuthHeaders } from '../utils/errorHandler.js';

/**
 * Like a post
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Result
 */
export const likePost = async (postId) => {
  try {
    const authCheck = checkAuth();
    if (!authCheck.success) return authCheck;

    const response = await apiClient.post(
      `/api/interactions/posts/${postId}/like`,
      {},
      { headers: createAuthHeaders(authCheck.token) }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, 'Failed to like post');
  }
};

/**
 * Unlike a post
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Result
 */
export const unlikePost = async (postId) => {
  try {
    const authCheck = checkAuth();
    if (!authCheck.success) return authCheck;

    const response = await apiClient.delete(
      `/api/interactions/posts/${postId}/like`,
      { headers: createAuthHeaders(authCheck.token) }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, 'Failed to unlike post');
  }
};

/**
 * Save a post
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Result
 */
export const savePost = async (postId) => {
  try {
    const authCheck = checkAuth();
    if (!authCheck.success) return authCheck;

    const response = await apiClient.post(
      `/api/interactions/posts/${postId}/save`,
      {},
      { headers: createAuthHeaders(authCheck.token) }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, 'Failed to save post');
  }
};

/**
 * Unsave a post
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Result
 */
export const unsavePost = async (postId) => {
  try {
    const authCheck = checkAuth();
    if (!authCheck.success) return authCheck;

    const response = await apiClient.delete(
      `/api/interactions/posts/${postId}/save`,
      { headers: createAuthHeaders(authCheck.token) }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, 'Failed to unsave post');
  }
};

/**
 * Get post interaction status
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Interaction status
 */
export const getPostInteractionStatus = async (postId) => {
  try {
    const authCheck = checkAuth();
    if (!authCheck.success) return authCheck;

    const response = await apiClient.get(
      `/api/interactions/posts/${postId}/status`,
      { headers: createAuthHeaders(authCheck.token) }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, 'Failed to get post interaction status');
  }
};
