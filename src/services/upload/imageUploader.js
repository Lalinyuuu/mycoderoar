/**
 * Image Uploader
 * Handles image upload operations
 */

import apiClient from '../apiClient.js';
import { API_ENDPOINTS } from '../../constants/appConstants.js';

// Upload modes
export const UPLOAD_MODES = {
  CLIENT_UPLOAD: 'client-upload',
  BASE64: 'base64',
  SIMPLE: 'simple'
};

// Upload types
export const UPLOAD_TYPES = {
  AVATAR: 'avatar',
  POST_IMAGE: 'post-image'
};

/**
 * Upload image with specified mode and type
 * @param {File} file - Image file
 * @param {string} type - Upload type (avatar or post-image)
 * @param {string} mode - Upload mode
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Upload result
 */
export const uploadImage = async (file, type = UPLOAD_TYPES.POST_IMAGE, mode = UPLOAD_MODES.CLIENT_UPLOAD, options = {}) => {
  try {
    // Basic file validation
    if (!file || !file.type.startsWith('image/')) {
      throw new Error('Invalid file type. Please upload an image file.');
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('File size must be less than 5MB.');
    }

    // Upload based on mode
    switch (mode) {
      case UPLOAD_MODES.CLIENT_UPLOAD:
        return await uploadWithFormData(file, type, options);
      case UPLOAD_MODES.BASE64:
        return await uploadWithBase64(file, type, options);
      case UPLOAD_MODES.SIMPLE:
        return await uploadSimple(file, type, options);
      default:
        throw new Error('Invalid upload mode');
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Upload image using FormData
 * @param {File} file - Processed file
 * @param {string} type - Upload type
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Upload result
 */
const uploadWithFormData = async (file, type, options = {}) => {
  const formData = new FormData();
  // Try using 'file' field name for all uploads
  // Use 'avatar' for avatar upload, 'file' for post upload
  const fieldName = type === UPLOAD_TYPES.AVATAR ? 'avatar' : 'file';
  formData.append(fieldName, file);
  formData.append('uploadType', type); // Changed from 'type' to 'uploadType'
  
  if (options.folder) {
    formData.append('folder', options.folder);
  }

  // Choose correct endpoint based on type
  const endpoint = type === UPLOAD_TYPES.AVATAR ? '/api/upload/avatar' : '/api/upload/post';
  
  // Add cache-busting parameter to avoid CORS cache issues
  const cacheBuster = `?t=${Date.now()}&v=${Math.random()}&r=${Math.floor(Math.random() * 10000)}`;
  const fullEndpoint = endpoint + cacheBuster;
  
  try {
    const response = await apiClient.post(fullEndpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
        // Authorization header is added automatically by apiClient interceptor
      },
      timeout: 30000, // 30 seconds timeout
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        
        // Call progress callback if provided
        if (options.onProgress) {
          options.onProgress(percentCompleted);
        }
      }
    });

    return {
      success: true,
      data: {
        url: response.data.imageUrl,
        publicId: response.data.publicId,
        width: response.data.width,
        height: response.data.height,
        size: response.data.size
      }
    };
  } catch (error) {
    
    // Fallback to alternative endpoint if specific endpoint fails
    if (error.response?.status === 404) {
      const fallbackEndpoint = type === UPLOAD_TYPES.AVATAR ? '/api/upload/post' : '/api/upload/avatar';
      const fallbackFullEndpoint = fallbackEndpoint + cacheBuster;
      
      try {
        const fallbackResponse = await apiClient.post(fallbackFullEndpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
            // Authorization header is added automatically by apiClient interceptor
          },
          timeout: 30000,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            
            if (options.onProgress) {
              options.onProgress(percentCompleted);
            }
          }
        });

        return {
          success: true,
          data: {
            url: fallbackResponse.data.imageUrl,
            publicId: fallbackResponse.data.publicId,
            width: fallbackResponse.data.width,
            height: fallbackResponse.data.height,
            size: fallbackResponse.data.size
          }
        };
      } catch (fallbackError) {
        return {
          success: false,
          error: 'All upload endpoints failed. Please check your connection and try again.'
        };
      }
    }
    
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Upload image using base64
 * @param {File} file - Processed file
 * @param {string} type - Upload type
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Upload result
 */
const uploadWithBase64 = async (file, type, options = {}) => {
  const base64 = await fileToBase64(file);
  
  // Choose correct endpoint based on type
  const endpoint = type === UPLOAD_TYPES.AVATAR ? '/api/upload/avatar' : '/api/upload/post';
  
  // Add cache-busting parameter to avoid CORS cache issues
  const cacheBuster = `?t=${Date.now()}&v=${Math.random()}&r=${Math.floor(Math.random() * 10000)}`;
  const fullEndpoint = endpoint + cacheBuster;
  
  try {
    const response = await apiClient.post(fullEndpoint, {
      file: base64,
      uploadType: type, // Changed from 'type' to 'uploadType'
      folder: options.folder
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
        // Authorization header is added automatically by apiClient interceptor
      }
    });

    return {
      success: true,
      data: {
        url: response.data.imageUrl,
        publicId: response.data.publicId,
        width: response.data.width,
        height: response.data.height,
        size: response.data.size
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Simple upload without custom headers
 * @param {File} file - Processed file
 * @param {string} type - Upload type
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Upload result
 */
const uploadSimple = async (file, type, options = {}) => {
  const formData = new FormData();
  // Try using 'file' field name for all uploads
  // Use 'avatar' for avatar upload, 'file' for post upload
  const fieldName = type === UPLOAD_TYPES.AVATAR ? 'avatar' : 'file';
  formData.append(fieldName, file);
  formData.append('uploadType', type); // Changed from 'type' to 'uploadType'
  
  if (options.folder) {
    formData.append('folder', options.folder);
  }

  // Choose correct endpoint based on type
  const endpoint = type === UPLOAD_TYPES.AVATAR ? '/api/upload/avatar' : '/api/upload/post';
  
  // Add cache-busting parameter to avoid CORS cache issues
  const cacheBuster = `?t=${Date.now()}&v=${Math.random()}&r=${Math.floor(Math.random() * 10000)}`;
  const fullEndpoint = endpoint + cacheBuster;
  
  try {
    const response = await apiClient.post(fullEndpoint, formData, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    return {
      success: true,
      data: {
        url: response.data.imageUrl,
        publicId: response.data.publicId,
        width: response.data.width,
        height: response.data.height,
        size: response.data.size
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Convert file to base64
 * @param {File} file - File to convert
 * @returns {Promise<string>} Base64 string
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};