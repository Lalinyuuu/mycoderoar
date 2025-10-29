/**
 * Follow Feed
 * Functions for getting personalized feed based on follows
 */

import api from '../../api/index.js';
import { handleApiError, checkAuth, createAuthHeaders } from '../utils/errorHandler.js';

/**
 * Get personalized feed based on followed users
 * @param {Object} options - Feed options
 * @returns {Promise<Object>} Follow feed data
 */
export const getFollowFeed = async (options = {}) => {
  try {
    const authCheck = checkAuth();
    if (!authCheck.success) return authCheck;

    const {
      page = 1,
      limit = 20,
      filter = 'all',
      sort = 'newest',
      tags = undefined
    } = options;

    const params = new URLSearchParams({ page, limit, filter, sort });
    if (tags && tags.length > 0) {
      params.append('tags', tags.join(','));
    }

    const response = await api.get(`/api/follow/feed?${params}`, {
      headers: createAuthHeaders(authCheck.token)
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, 'Failed to get follow feed');
  }
};

/**
 * Get suggested users to follow
 * @param {Object} options - Suggestion options
 * @returns {Promise<Object>} User suggestions
 */
export const getFollowSuggestions = async (options = {}) => {
  try {
    const authCheck = checkAuth();
    if (!authCheck.success) return authCheck;

    const { limit = 10, exclude = [] } = options;
    const params = new URLSearchParams({ limit });
    if (exclude.length > 0) {
      params.append('exclude', exclude.join(','));
    }

    const response = await api.get(`/api/follow/suggestions?${params}`, {
      headers: createAuthHeaders(authCheck.token)
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, 'Failed to get follow suggestions');
  }
};

/**
 * Get trending users (most followed recently)
 * @param {Object} options - Trending options
 * @returns {Promise<Object>} Trending users
 */
export const getTrendingUsers = async (options = {}) => {
  try {
    const { limit = 10, timeframe = 'week' } = options;
    const params = new URLSearchParams({ limit, timeframe });

    const response = await api.get(`/api/follow/trending?${params}`);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, 'Failed to get trending users');
  }
};
