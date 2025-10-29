/**
 * User Interactions
 * Functions for getting user's interaction status and data
 */

import apiClient from '../apiClient.js';
import { handleApiCall } from '@/utils/apiHelpers';

/**
 * Get user's post interaction status
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} User's interaction status
 */
export const getUserPostStatus = async (postId) => {
  try {
    // Use the correct endpoint from API documentation
    const result = await handleApiCall(
      () => apiClient.get(`/api/interactions/posts/${postId}/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }),
      {
        showErrorToast: false,
        fallbackMessage: 'Failed to get user post status'
      }
    );

    if (result.success) {
      const statusData = {
        success: true,
        data: {
          liked: result.data?.isLiked || result.data?.liked || false,
          saved: result.data?.isSaved || result.data?.saved || false,
          likesCount: result.data?.likesCount || 0,
          commentsCount: result.data?.commentsCount || 0
        }
      };
      return statusData;
    }

    // Fallback: return default values if endpoint doesn't exist
    return {
      success: true,
      data: {
        liked: false,
        saved: false,
        likesCount: 0,
        commentsCount: 0
      },
      isFallback: true
    };
  } catch (error) {
    return {
      success: true,
      data: {
        liked: false,
        saved: false,
        likesCount: 0,
        commentsCount: 0
      },
      isFallback: true
    };
  }
};

/**
 * Get user's saved posts
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Saved posts
 */
export const getSavedPosts = async (options = {}) => {
  const { page = 1, limit = 20 } = options;
  const params = new URLSearchParams({ page, limit });

  return await handleApiCall(
    () => apiClient.get(`/api/interactions/saved-posts?${params}`, {
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

/**
 * Get user's liked posts
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Liked posts
 */
export const getLikedPosts = async (options = {}) => {
  const { page = 1, limit = 20 } = options;
  const params = new URLSearchParams({ page, limit });

  return await handleApiCall(
    () => apiClient.get(`/api/interactions/liked-posts?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }),
    {
      showErrorToast: false,
      fallbackMessage: 'Failed to get liked posts'
    }
  );
};
