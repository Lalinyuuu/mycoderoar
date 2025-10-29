/**
 * Cloudinary Client
 * Main service that exports all upload-related functions
 */

// Import all upload services
export * from './upload/imageUploader.js';
export * from './upload/cloudinaryService.js';
export * from './upload/uploadUtils.js';

// Re-export commonly used functions for backward compatibility
export {
  uploadImage,
  UPLOAD_MODES,
  UPLOAD_TYPES
} from './upload/imageUploader.js';

export {
  deleteCloudinaryImage,
  transformCloudinaryUrl,
  getCloudinaryPreset
} from './upload/cloudinaryService.js';

export {
  getUploadProgress,
  validateUploadResponse,
  generatePreviewUrl,
  isImageFile,
  getFileExtension,
  isSupportedFileType
} from './upload/uploadUtils.js';