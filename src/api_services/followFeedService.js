/**
 * Follow Feed Service
 * Handles follow feed and suggestions
 */

import api from '../api/index.js';
import { handleApiCall } from '@/utils/apiHelpers';

/**
 * Get follow feed (posts from followed users)
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Follow feed result
 */
export const getFollowFeed = async (options = {}) => {
  const { 
    page = 1, 
    limit = 20, 
    type = 'all',
    sort = 'newest',
    tags = [],
    search = ''
  } = options;
  
  
  // Check if user is authenticated
  const token = localStorage.getItem('token');
  if (!token) {
    return {
      success: false,
      error: 'Authentication required',
      data: {
        posts: [],
        pagination: {
          page: 1,
          limit: limit,
          total: 0,
          totalPages: 0
        }
      }
    };
  }
  
  const params = { page, limit, type, sort };
  if (tags.length > 0) params.tags = tags.join(',');
  if (search) params.search = search;
  
  try {
    
    const result = await handleApiCall(
      () => api.get('/api/follow/feed', {
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }),
      {
        showErrorToast: false,
        fallbackMessage: 'Failed to get follow feed'
      }
    );


    if (result.success) {
      // Check if we have actual data
      if (result.data && (result.data.posts || result.data.data)) {
        return result;
      } else {
        // API succeeded but no data, use fallback
      }
    }

    // Fallback: try regular posts API
    
    try {
      const fallbackResult = await handleApiCall(
        () => api.get('/api/posts', {
          params: { page, limit, status: 'published' }
        }),
        {
          showErrorToast: false,
          fallbackMessage: 'Failed to load posts'
        }
      );


      if (fallbackResult.success) {
        return {
          success: true,
          data: fallbackResult.data,
          isFallback: true
        };
      }
    } catch (fallbackError) {
    }

    // Final fallback: return empty feed
    return {
      success: true,
      data: {
        posts: [],
        pagination: {
          page: 1,
          limit: limit,
          total: 0,
          totalPages: 0
        }
      },
      isFallback: true
    };
  } catch (error) {
    
    // Return empty feed on error
    return {
      success: true,
      data: {
        posts: [],
        pagination: {
          page: 1,
          limit: limit,
          total: 0,
          totalPages: 0
        }
      },
      isFallback: true
    };
  }
};

/**
 * Get user suggestions (users to follow)
 * @param {Object} options - Query options
 * @returns {Promise<Object>} User suggestions result
 */
export const getUserSuggestions = async (options = {}) => {
  const { 
    page = 1, 
    limit = 10, 
    type = 'recommended',
    exclude = []
  } = options;
  
  try {
    // Try the suggestions endpoint first
    const result = await handleApiCall(
      () => api.get('/api/users/suggestions', {
        params: { page, limit, type, exclude: exclude.join(',') },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }),
      {
        showErrorToast: false,
        fallbackMessage: 'Failed to get user suggestions'
      }
    );

    if (result.success) {
      return result;
    }

    // Fallback: return empty suggestions if endpoint doesn't exist
    return {
      success: true,
      data: {
        users: [],
        pagination: {
          page: 1,
          limit: limit,
          total: 0,
          totalPages: 0
        }
      },
      isFallback: true
    };
  } catch (error) {
    return {
      success: true,
      data: {
        users: [],
        pagination: {
          page: 1,
          limit: limit,
          total: 0,
          totalPages: 0
        }
      },
      isFallback: true
    };
  }
};

/**
 * Get trending users
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Trending users result
 */
export const getTrendingUsers = async (options = {}) => {
  const { 
    page = 1, 
    limit = 10,
    timeframe = 'week'
  } = options;
  
  try {
    // Try the trending endpoint first
    const result = await handleApiCall(
      () => api.get('/api/follow/trending', {
        params: { page, limit, timeframe },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }),
      {
        showErrorToast: false,
        fallbackMessage: 'Failed to get trending users'
      }
    );

    if (result.success) {
      return result;
    }

    // Fallback: return empty trending users if endpoint doesn't exist
    return {
      success: true,
      data: {
        users: [],
        pagination: {
          page: 1,
          limit: limit,
          total: 0,
          totalPages: 0
        }
      },
      isFallback: true
    };
  } catch (error) {
    return {
      success: true,
      data: {
        users: [],
        pagination: {
          page: 1,
          limit: limit,
          total: 0,
          totalPages: 0
        }
      },
      isFallback: true
    };
  }
};
