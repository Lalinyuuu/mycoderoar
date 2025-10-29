/**
 * BlogCard Helper Functions
 * Utility functions for BlogCard components
 */

/**
 * Normalize author data
 * @param {object} author - Author object
 * @returns {object} Normalized author data
 */
export const normalizeAuthor = (author) => {
  if (!author) return { name: 'Unknown', avatar: null };
  
  return {
    name: author.name || author.username || 'Unknown',
    avatar: author.avatar || null
  };
};

/**
 * Format long date
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatLongDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Convert date to ISO string
 * @param {string|Date} date - Date to convert
 * @returns {string} ISO date string
 */
export const toISO = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  return dateObj.toISOString();
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Format view count
 * @param {number} views - View count
 * @returns {string} Formatted view count
 */
export const formatViewCount = (views) => {
  if (!views || views < 1000) return views?.toString() || '0';
  return `${(views / 1000).toFixed(1)}k`;
};

/**
 * Get category color class
 * @param {string} category - Category name
 * @returns {string} Tailwind color class
 */
export const getCategoryColor = (category) => {
  const colorMap = {
    'Beginner': 'bg-gradient-to-r from-emerald-5/20 to-emerald-6/20 text-emerald-8 border border-emerald-4',
    'Crafting': 'bg-gradient-to-r from-yellow-4/20 to-yellow-5/20 yellow-7 border border-yellow-4',
    'PvP': 'bg-gradient-to-r from-error/20 to-error/20 error border border-error',
    'Events': 'bg-gradient-to-r from-pink-4/20 to-pink-5/20 pink-7 border border-pink-4',
    'Builds': 'bg-gradient-to-r from-purple-5/20 to-purple-6/20 text-purple-8 border border-purple-4',
    'MVP': 'bg-gradient-to-r from-yellow-4/20 to-yellow-5/20 yellow-7 border border-yellow-4',
    'Guides': 'bg-gradient-to-r from-blue-4/20 to-blue-5/20 blue-7 border border-blue-4',
    'Lore': 'bg-gradient-to-r from-purple-4/20 to-purple-5/20 purple-6 border border-purple-4',
    
  };
  
  return colorMap[category] || 'bg-gradient-to-r from-gray-4/20 to-gray-5/20 gray-6 border border-gray-5';
};

/**
 * Generate fallback avatar URL
 * @param {string} name - Author name
 * @returns {string} Fallback avatar URL
 */
export const getFallbackAvatar = (name) => {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=6366f1&color=ffffff&size=200`;
};

/**
 * Validate image URL
 * @param {string} url - Image URL
 * @returns {boolean} Whether URL is valid
 */
export const isValidImageUrl = (url) => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get reading time estimate
 * @param {string} text - Text content
 * @returns {number} Estimated reading time in minutes
 */
export const getReadingTime = (text) => {
  if (!text) return 1;
  
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return Math.max(1, minutes);
};

/**
 * Generate unique key for post
 * @param {string} id - Post ID
 * @param {string} variant - Card variant
 * @returns {string} Unique key
 */
export const getPostKey = (id, variant = 'default') => {
  return `${variant}_${id}`;
};

/**
 * Check if post is trending
 * @param {number} likes - Like count
 * @param {number} comments - Comment count
 * @param {number} views - View count
 * @returns {boolean} Whether post is trending
 */
export const isTrending = (likes, comments, views) => {
  const engagementScore = (likes * 2) + (comments * 3) + (views * 0.1);
  return engagementScore > 100;
};

/**
 * Get engagement level
 * @param {number} likes - Like count
 * @param {number} comments - Comment count
 * @returns {string} Engagement level
 */
export const getEngagementLevel = (likes, comments) => {
  const totalEngagement = likes + (comments * 2);
  
  if (totalEngagement >= 50) return 'high';
  if (totalEngagement >= 20) return 'medium';
  return 'low';
};
