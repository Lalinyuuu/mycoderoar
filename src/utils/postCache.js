/**
 * Post Cache Utilities
 * Helper functions for managing post interaction state in localStorage
 */

/**
 * Save data to localStorage cache
 * @param {string} postId - Post ID
 * @param {string} key - Cache key (liked, saved, likes, comments)
 * @param {any} value - Value to cache
 */
export const saveToCache = (postId, key, value) => {
  try {
    const cacheKey = `post_${postId}_${key}`;
    localStorage.setItem(cacheKey, JSON.stringify(value));
    
    // Saved to cache successfully
  } catch (error) {
  }
};

/**
 * Get data from localStorage cache
 * @param {string} postId - Post ID
 * @param {string} key - Cache key (liked, saved, likes, comments)
 * @param {any} defaultValue - Default value if cache miss
 * @returns {any} Cached value or default value
 */
export const getFromCache = (postId, key, defaultValue) => {
  try {
    const cacheKey = `post_${postId}_${key}`;
    const data = localStorage.getItem(cacheKey);
    
    // เพิ่ม check นี้
    if (!data || data === 'undefined') {
      return defaultValue;
    }
    
    return JSON.parse(data);
  } catch (error) {
    // ลบข้อมูลที่เสียหายออก
    localStorage.removeItem(`post_${postId}_${key}`);
    return defaultValue;
  }
};

/**
 * Clear all cache for a specific post
 * @param {string} postId - Post ID
 */
export const clearPostCache = (postId) => {
  try {
    const keys = ['liked', 'saved', 'likes', 'comments'];
    keys.forEach(key => {
      const cacheKey = `post_${postId}_${key}`;
      localStorage.removeItem(cacheKey);
    });
    
    // Cleared cache successfully
  } catch (error) {
  }
};

/**
 * Get all cached data for a post
 * @param {string} postId - Post ID
 * @param {object} defaults - Default values
 * @returns {object} All cached data
 */
export const getAllCachedData = (postId, defaults = {}) => {
  return {
    liked: getFromCache(postId, 'liked', defaults.liked || false),
    saved: getFromCache(postId, 'saved', defaults.saved || false),
    likes: getFromCache(postId, 'likes', defaults.likes || 0),
    comments: getFromCache(postId, 'comments', defaults.comments || 0)
  };
};
