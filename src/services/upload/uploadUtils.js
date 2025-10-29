/**
 * Upload Utilities
 * Helper functions for upload operations
 */

/**
 * Get upload progress
 * @param {ProgressEvent} event - Progress event
 * @returns {Object} Progress info
 */
export const getUploadProgress = (event) => {
  if (event.lengthComputable) {
    const percentComplete = (event.loaded / event.total) * 100;
    return {
      loaded: event.loaded,
      total: event.total,
      percentage: Math.round(percentComplete)
    };
  }
  return null;
};

/**
 * Validate upload response
 * @param {Object} response - Upload response
 * @returns {Object} Validation result
 */
export const validateUploadResponse = (response) => {
  if (!response || !response.data) {
    return {
      valid: false,
      error: 'Invalid response format'
    };
  }

  const { url, publicId, width, height, size } = response.data;

  if (!url) {
    return {
      valid: false,
      error: 'No URL returned from upload'
    };
  }

  if (!publicId) {
    return {
      valid: false,
      error: 'No public ID returned from upload'
    };
  }

  return {
    valid: true,
    data: {
      url,
      publicId,
      width: width || 0,
      height: height || 0,
      size: size || 0,
      formattedSize: formatFileSize(size || 0)
    }
  };
};

/**
 * Generate upload preview URL
 * @param {File} file - File to preview
 * @returns {Promise<string>} Preview URL
 */
export const generatePreviewUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Check if file is image
 * @param {File} file - File to check
 * @returns {boolean} Is image
 */
export const isImageFile = (file) => {
  return file && file.type.startsWith('image/');
};

/**
 * Get file extension
 * @param {File} file - File to check
 * @returns {string} File extension
 */
export const getFileExtension = (file) => {
  return file.name.split('.').pop().toLowerCase();
};

/**
 * Check if file type is supported
 * @param {File} file - File to check
 * @param {string[]} allowedTypes - Allowed MIME types
 * @returns {boolean} Is supported
 */
export const isSupportedFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) => {
  return allowedTypes.includes(file.type);
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};