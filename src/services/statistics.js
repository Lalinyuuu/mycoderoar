/**
 * Statistics Service
 * API calls for statistics and analytics data
 */

import api from './api';

// Platform Statistics - Try direct route first, then API route
export const getPlatformStatistics = async () => {
  try {
    // Try new direct route first
    const response = await api.get('/statistics/platforms');
    // Return the data object directly since API wraps it in {success: true, data: {...}}
    return response.data.data || response.data;
  } catch (directError) {
    try {
      // Try API route
      const response = await api.get('/api/statistics/platforms');
      // Return the data object directly since API wraps it in {success: true, data: {...}}
      return response.data.data || response.data;
    } catch (apiError) {
      try {
        // Fallback to admin stats
        const response = await api.get('/api/admin/stats');
        return response.data;
      } catch (adminError) {
        throw adminError;
      }
    }
  }
};

// User Statistics - Now using the new Statistics API
export const getUserStatistics = async (userId = null) => {
  try {
    if (userId) {
      // Get specific user statistics
      const response = await api.get(`/api/statistics/users/${userId}`);
      return response.data;
    } else {
      // Try new direct route first, then fallback to API route
      try {
        const response = await api.get('/statistics/users');
        // Return the data object directly since API wraps it in {success: true, data: {...}}
        return response.data.data || response.data;
      } catch (directError) {
        try {
          const response = await api.get('/api/statistics/users');
          // Return the data object directly since API wraps it in {success: true, data: {...}}
          return response.data.data || response.data;
        } catch (apiError) {
          throw apiError;
        }
      }
    }
  } catch (error) {
    throw error;
  }
};

// Post Statistics - Now using the new Statistics API
export const getPostStatistics = async (postId = null) => {
  try {
    if (postId) {
      // Get specific post statistics
      const response = await api.get(`/api/statistics/posts/${postId}`);
      return response.data;
    } else {
      // Try new direct route first, then fallback to API route
      try {
        const response = await api.get('/statistics/posts');
        // Return the data object directly since API wraps it in {success: true, data: {...}}
        return response.data.data || response.data;
      } catch (directError) {
        const response = await api.get('/api/statistics/posts');
        // Return the data object directly since API wraps it in {success: true, data: {...}}
        return response.data.data || response.data;
      }
    }
  } catch (error) {
    throw error;
  }
};

// Multiple Posts Statistics
export const getMultiplePostsStatistics = async (postIds) => {
  try {
    const response = await api.post('/api/statistics/posts/multiple', {
      postIds: postIds
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Engagement Statistics - Try direct route first, then API route
export const getEngagementStatistics = async (timeRange = '7d') => {
  try {
    // Try new direct route first
    const response = await api.get('/statistics/engagement', {
      params: { timeRange }
    });
    return response.data;
  } catch (directError) {
    try {
      // Try API route
      const response = await api.get('/api/statistics/engagement', {
        params: { timeRange }
      });
      return response.data;
    } catch (apiError) {
      throw apiError;
    }
  }
};

// Analytics Dashboard Data
export const getAnalyticsDashboard = async () => {
  try {
    // Call all Statistics APIs that are now available
    const [platform, users, posts, engagement] = await Promise.all([
      getPlatformStatistics().catch(err => {
        return null;
      }),
      getUserStatistics().catch(err => {
        return null;
      }),
      getPostStatistics().catch(err => {
        return null;
      }),
      getEngagementStatistics().catch(err => {
        return null;
      })
    ]);

    return {
      platform,
      users,
      posts,
      engagement: engagement || platform // Use engagement data or platform as fallback
    };
  } catch (error) {
    // Return empty data structure instead of throwing
    return {
      platform: null,
      users: null,
      posts: null,
      engagement: null
    };
  }
};

// Time-based Statistics
export const getTimeBasedStatistics = async (type, timeRange = '30d') => {
  try {
    const response = await api.get(`/api/statistics/${type}/time`, {
      params: { timeRange }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Top Performers
export const getTopPerformers = async (type, limit = 10) => {
  try {
    const response = await api.get(`/api/statistics/top/${type}`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Export all functions
export default {
  getPlatformStatistics,
  getUserStatistics,
  getPostStatistics,
  getMultiplePostsStatistics,
  getEngagementStatistics,
  getAnalyticsDashboard,
  getTimeBasedStatistics,
  getTopPerformers
};
