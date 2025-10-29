/**
 * Common error handling utilities for API services
 */

/**
 * Handle API errors with consistent response format
 * @param {Error} error - The error object
 * @param {string} defaultMessage - Default error message
 * @param {Object} specialCases - Special error cases to handle
 * @returns {Object} Standardized error response
 */
export const handleApiError = (error, defaultMessage, specialCases = {}) => {
  
  const status = error.response?.status;
  const errorData = error.response?.data;
  const errorMessage = errorData?.message || errorData?.error || error.message;
  
  // Handle authentication errors
  if (status === 401) {
    return {
      success: false,
      error: 'Authentication failed. Please login again.'
    };
  }
  
  // Handle bad request errors
  if (status === 400) {
    // Check for special cases (like "already following")
    for (const [key, handler] of Object.entries(specialCases)) {
      if (handler(errorMessage)) {
        return handler(errorMessage);
      }
    }
    
    return {
      success: false,
      error: errorMessage || 'Invalid request. Please check your input.'
    };
  }
  
  // Handle not found errors
  if (status === 404) {
    return {
      success: false,
      error: errorMessage || 'Resource not found.'
    };
  }
  
  // Handle server errors
  if (status >= 500) {
    return {
      success: false,
      error: 'Server error. Please try again later.'
    };
  }
  
  // Default error handling
  return {
    success: false,
    error: errorMessage || defaultMessage || 'An unexpected error occurred.'
  };
};

/**
 * Check if user is authenticated
 * @returns {Object} Authentication check result
 */
export const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return {
      success: false,
      error: 'Please sign in to continue'
    };
  }
  return { success: true, token };
};

/**
 * Create API headers with authorization
 * @param {string} token - Auth token
 * @returns {Object} Headers object
 */
export const createAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});
