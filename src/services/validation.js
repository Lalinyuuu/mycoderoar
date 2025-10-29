/**
 * API service for real-time validation
 * Calls backend validation endpoints
 */

import api from './api.js';

/**
 * Check if email is valid and available
 */
export const checkEmail = async (email) => {
  try {
    const response = await api.post('/api/auth/check-email', { email });
    return {
      isValid: true,
      isAvailable: true,
      message: 'Email is available'
    };
  } catch (error) {
    
    if (error.response?.status === 400) {
      const errorMessage = error.response.data.errors?.[0]?.message || 'Email validation failed';
      return {
        isValid: false,
        isAvailable: false,
        message: errorMessage.includes('already exists') ? 'Email already exists' : errorMessage
      };
    }
    
    // Network or other errors
    return {
      isValid: false,
      isAvailable: false,
      message: 'Network error. Please try again.'
    };
  }
};

/**
 * Check if username is valid and available
 */
export const checkUsername = async (username) => {
  try {
    const response = await api.post('/api/auth/check-username', { username });
    return {
      isValid: true,
      isAvailable: true,
      message: 'Username is available'
    };
  } catch (error) {
    
    if (error.response?.status === 400) {
      const errorMessage = error.response.data.errors?.[0]?.message || 'Username validation failed';
      return {
        isValid: false,
        isAvailable: false,
        message: errorMessage.includes('already exists') ? 'Username already exists' : errorMessage
      };
    }
    
    // Network or other errors
    return {
      isValid: false,
      isAvailable: false,
      message: 'Network error. Please try again.'
    };
  }
};

/**
 * Check password strength
 */
export const checkPassword = async (password) => {
  try {
    const response = await api.post('/api/auth/check-password', { password });
    return {
      isValid: true,
      message: response.data.message
    };
  } catch (error) {
    if (error.response?.status === 400) {
      return {
        isValid: false,
        message: error.response.data.errors[0].message
      };
    }
    throw error;
  }
};

/**
 * Real-time validation for registration form
 */
export const validateRegistrationRealTime = async (formData) => {
  const results = {};
  
  // Check email
  if (formData.email) {
    try {
      const emailResult = await checkEmail(formData.email);
      results.email = emailResult;
    } catch (error) {
      results.email = { isValid: false, message: 'Network error' };
    }
  }
  
  // Check username
  if (formData.username) {
    try {
      const usernameResult = await checkUsername(formData.username);
      results.username = usernameResult;
    } catch (error) {
      results.username = { isValid: false, message: 'Network error' };
    }
  }
  
  // Check password
  if (formData.password) {
    try {
      const passwordResult = await checkPassword(formData.password);
      results.password = passwordResult;
    } catch (error) {
      results.password = { isValid: false, message: 'Network error' };
    }
  }
  
  return results;
};
