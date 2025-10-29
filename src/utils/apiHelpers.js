/**
 * API Helper Utilities
 * Centralized functions for common API operations and error handling
 */

/**
 * Extract error message from API response
 * @param {Object} error - Error object from API call
 * @returns {string} - User-friendly error message
 */
export const extractErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred';
  
  // Handle different error response formats
  if (error.response?.data) {
    const responseData = error.response.data;
    
    // Handle errors array format
    if (responseData.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
      return responseData.errors[0].message || responseData.errors[0];
    }
    // Handle single error message
    if (responseData.error) {
      return responseData.error;
    }
    // Handle message field
    if (responseData.message) {
      return responseData.message;
    }
  }
  
  return error.message || 'An unexpected error occurred';
};

/**
 * Handle API response with consistent format
 * @param {Function} apiCall - API function to call
 * @param {Object} options - Options for error handling
 * @returns {Promise<Object>} - Standardized response format
 */
export const handleApiCall = async (apiCall, options = {}) => {
  const { 
    showErrorToast = true, 
    errorMessage = 'Operation failed',
    onError = null,
    timeout = 10000 // 10 seconds timeout
  } = options;

  try {
    // Add timeout protection
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    );
    
    const response = await Promise.race([apiCall(), timeoutPromise]);
    return {
      success: true,
      data: response.data || response,
      response
    };
  } catch (error) {
    const message = extractErrorMessage(error);
    
    if (onError) {
      onError(error, message);
    }
    
    return {
      success: false,
      error: message,
      originalError: error
    };
  }
};

/**
 * Build query parameters for API calls
 * @param {Object} params - Parameters object
 * @returns {URLSearchParams} - Built query string
 */
export const buildQueryParams = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        searchParams.append(key, value.join(','));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  
  return searchParams;
};

/**
 * Check if user is authenticated
 * @returns {boolean} - Authentication status
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

/**
 * Get authentication headers
 * @returns {Object} - Headers with authorization
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Handle pagination data extraction
 * @param {Object} response - API response
 * @returns {Object} - Normalized pagination data
 */
export const extractPaginationData = (response) => {
  const data = response.data || response;
  
  // Handle different pagination formats
  if (data.pagination) {
    return data.pagination;
  }
  
  if (data.currentPage && data.totalPages) {
    return {
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      total: data.total || 0,
      page: data.currentPage,
      limit: data.limit || 20
    };
  }
  
  return {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    page: 1,
    limit: 20
  };
};

/**
 * Handle posts data extraction
 * @param {Object} response - API response
 * @returns {Array} - Normalized posts array
 */
export const extractPostsData = (response) => {
  const data = response.data || response;
  let posts = [];
  
  // Handle nested data structure: {success: true, data: {...}}
  if (data.success && data.data) {
    const nestedData = data.data;
    
    if (nestedData.posts && Array.isArray(nestedData.posts)) {
      posts = nestedData.posts;
    } else if (Array.isArray(nestedData)) {
      posts = nestedData;
    }
  } else if (data.posts && Array.isArray(data.posts)) {
    posts = data.posts;
  } else if (data.data && Array.isArray(data.data)) {
    posts = data.data;
  } else if (Array.isArray(data)) {
    posts = data;
  }
  
  
  // Transform posts to normalized format
  if (posts.length > 0) {
    return posts.map(post => ({
      id: post.id || post._id || 'unknown',
      title: post.title || 'Draft Post',
      description: post.description || post.content?.substring(0, 150) || 'No description available',
      content: post.content || post.body || '',
      image: post.image || post.imageUrl || post.coverImage || '/images/placeholder.jpg',
      imagePublicId: post.imagePublicId || post.image_public_id || null,
      category: post.category || post.tags?.[0] || 'General',
      tags: Array.isArray(post.tags) ? post.tags : [],
      author: post.author || post.user || {},
      date: post.date || post.createdAt || new Date().toISOString(),
      updatedAt: post.updatedAt || post.updated_at || post.date || post.createdAt,
      likes: post.likes || post.likesCount || post.likeCount || post._count?.likes || 0,
      comments: post.comments || post.commentsCount || post.commentCount || post._count?.comments || 0,
      views: post.views || post.viewsCount || post.viewCount || post._count?.views || 0,
      isLiked: Boolean(post.isLiked || post.liked || false),
      isSaved: Boolean(post.isSaved || post.saved || false),
      status: post.status || 'published',
      slug: post.slug || post.title?.toLowerCase().replace(/\s+/g, '-') || 'untitled'
    }));
  }
  
  return [];
};

/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Throttle function for scroll events
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
