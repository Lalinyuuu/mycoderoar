/**
 * Cloudinary Service
 * Handles Cloudinary-specific operations
 */

import apiClient from '../apiClient.js';

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Delete result
 */
export const deleteCloudinaryImage = async (publicId) => {
  try {
    const response = await apiClient.delete(`/api/upload/cloudinary/${publicId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to delete image'
    };
  }
};

/**
 * Transform Cloudinary image URL
 * @param {string} url - Original Cloudinary URL
 * @param {Object} transformations - Transformation options
 * @returns {string} Transformed URL
 */
export const transformCloudinaryUrl = (url, transformations = {}) => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = transformations;

  // Extract base URL and public ID
  const urlParts = url.split('/');
  const baseUrl = urlParts.slice(0, -2).join('/');
  const publicId = urlParts[urlParts.length - 1].split('.')[0];

  // Build transformation string
  const transforms = [];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  transforms.push(`c_${crop}`);
  transforms.push(`q_${quality}`);
  transforms.push(`f_${format}`);

  const transformString = transforms.join(',');

  return `${baseUrl}/${transformString}/${publicId}`;
};

/**
 * Get Cloudinary upload preset
 * @param {string} type - Upload type
 * @returns {Promise<Object>} Preset result
 */
export const getCloudinaryPreset = async (type = 'post-image') => {
  try {
    const response = await apiClient.get(`/api/upload/cloudinary/preset/${type}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to get upload preset'
    };
  }
};