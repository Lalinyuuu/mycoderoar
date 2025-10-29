/**
 * Error Handling Utilities
 * Centralized error handling and user feedback
 */

import { toast } from 'sonner';
import { reportError } from './sentry';

/**
 * Error types for consistent handling
 */
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  AUTH: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Classify error type based on response
 * @param {Object} error - Error object
 * @returns {string} - Error type
 */
export const classifyError = (error) => {
  if (!error.response) {
    return ERROR_TYPES.NETWORK;
  }
  
  const status = error.response.status;
  
  switch (status) {
    case 401:
    case 403:
      return ERROR_TYPES.AUTH;
    case 400:
    case 422:
      return ERROR_TYPES.VALIDATION;
    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_TYPES.SERVER;
    default:
      return ERROR_TYPES.UNKNOWN;
  }
};

/**
 * Get user-friendly error message
 * @param {Object} error - Error object
 * @param {string} fallbackMessage - Fallback message
 * @returns {string} - User-friendly message
 */
export const getUserFriendlyMessage = (error, fallbackMessage = 'Something went wrong') => {
  if (!error) return fallbackMessage;
  
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
  
  // Handle specific error types
  const errorType = classifyError(error);
  
  switch (errorType) {
    case ERROR_TYPES.NETWORK:
      return 'Network error. Please check your connection and try again.';
    case ERROR_TYPES.AUTH:
      return 'Authentication failed. Please login again.';
    case ERROR_TYPES.VALIDATION:
      return error.message || 'Please check your input and try again.';
    case ERROR_TYPES.SERVER:
      return 'Server error. Please try again later.';
    default:
      return error.message || fallbackMessage;
  }
};

/**
 * Handle error with appropriate user feedback
 * @param {Object} error - Error object
 * @param {Object} options - Error handling options
 */
export const handleError = (error, options = {}) => {
  const {
    showToast = true,
    fallbackMessage = 'Something went wrong',
    onError = null,
    severity = ERROR_SEVERITY.MEDIUM,
    context = null
  } = options;
  
  const errorType = classifyError(error);
  const message = getUserFriendlyMessage(error, fallbackMessage);
  
  // Report to Sentry for tracking
  if (severity === ERROR_SEVERITY.HIGH || severity === ERROR_SEVERITY.CRITICAL) {
    reportError(error, {
      tags: {
        errorType,
        severity,
        context
      }
    });
  }
  
  // Show toast notification
  if (showToast) {
    const toastType = errorType === ERROR_TYPES.AUTH ? 'error' : 'error';
    toast[toastType](message);
  }
  
  // Call custom error handler
  if (onError) {
    onError(error, message, errorType);
  }
  
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Error occurred:', {
      error,
      message,
      errorType,
      severity,
      context
    });
  }
};

/**
 * Create error boundary handler
 * @param {Object} error - Error object
 * @param {Object} errorInfo - Error info from React
 */
export const handleErrorBoundary = (error, errorInfo) => {
  const errorData = {
    error: error.toString(),
    errorInfo,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  // Report to Sentry
  reportError(error, {
    tags: {
      errorType: 'REACT_ERROR_BOUNDARY',
      severity: ERROR_SEVERITY.CRITICAL
    },
    extra: errorData
  });
  
  // Show user-friendly message
  toast.error('Something went wrong. Please refresh the page.');
  
};

/**
 * Retry mechanism for failed API calls
 * @param {Function} apiCall - API function to retry
 * @param {Object} options - Retry options
 * @returns {Promise} - Retry result
 */
export const retryApiCall = async (apiCall, options = {}) => {
  const {
    maxRetries = 3,
    delay = 1000,
    backoffMultiplier = 2,
    onRetry = null
  } = options;
  
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Don't retry on auth errors
      if (classifyError(error) === ERROR_TYPES.AUTH) {
        throw error;
      }
      
      if (attempt < maxRetries) {
        const delayTime = delay * Math.pow(backoffMultiplier, attempt - 1);
        
        if (onRetry) {
          onRetry(attempt, error, delayTime);
        }
        
        await new Promise(resolve => setTimeout(resolve, delayTime));
      }
    }
  }
  
  throw lastError;
};

/**
 * Validate API response format
 * @param {Object} response - API response
 * @param {Array} requiredFields - Required fields
 * @returns {boolean} - Validation result
 */
export const validateApiResponse = (response, requiredFields = []) => {
  if (!response || typeof response !== 'object') {
    return false;
  }
  
  return requiredFields.every(field => {
    const keys = field.split('.');
    let value = response;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return false;
      }
    }
    
    return value !== undefined && value !== null;
  });
};
