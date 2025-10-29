/**
 * Image constants and fallback URLs
 * Centralized location for all image-related constants
 */

// Fallback images
export const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=450&fit=crop";
export const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=240&h=240&fit=crop";

// Default profile images
export const DEFAULT_PROFILE_IMAGES = {
  ADMIN: "/images/avatar/profile_admin.png",
  USER: "/images/avatar/profile_mockup.png"
};

// Image transform configurations
export const IMAGE_TRANSFORMS = {
  // Avatar transforms
  AVATAR: {
    width: 240,
    height: 240,
    crop: "fill",
    gravity: "face",
    quality: "auto",
    format: "auto"
  },
  
  // Post image transforms
  POST_THUMBNAIL: {
    width: 400,
    height: 225,
    crop: "fill",
    quality: "auto",
    format: "auto"
  },
  
  POST_FEATURED: {
    width: 800,
    height: 450,
    crop: "fill",
    quality: "auto",
    format: "auto"
  },
  
  POST_FULL: {
    width: 1200,
    height: 675,
    crop: "fill",
    quality: "auto",
    format: "auto"
  }
};

// Upload configurations
export const UPLOAD_CONFIG = {
  AVATAR: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    dimensions: { width: 512, height: 512 },
    quality: 0.8
  },
  
  POST_IMAGE: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    dimensions: { width: 1920, height: 1080 },
    quality: 0.8
  }
};

// Image validation messages
export const VALIDATION_MESSAGES = {
  INVALID_TYPE: 'Invalid file type. Please upload JPG, PNG, GIF, or WebP files.',
  FILE_TOO_LARGE: (maxSize) => `File size must be less than ${(maxSize / (1024 * 1024)).toFixed(1)}MB.`,
  FILE_EMPTY: 'File is empty! Please select a valid image file.',
  UPLOAD_FAILED: 'Upload failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.'
};

// Helper function to get transformed image URL
export const getTransformedImageUrl = (originalUrl, transform) => {
  if (!originalUrl || originalUrl.includes('unsplash.com') || originalUrl.includes('localhost')) {
    return originalUrl; // Don't transform fallback or local images
  }
  
  // If it's a Cloudinary URL, apply transforms
  if (originalUrl.includes('cloudinary.com')) {
    const parts = originalUrl.split('/');
    const publicId = parts[parts.length - 1].split('.')[0];
    const baseUrl = originalUrl.split('/').slice(0, -1).join('/');
    
    const transformString = Object.entries(transform)
      .map(([key, value]) => `${key}_${value}`)
      .join(',');
    
    return `${baseUrl}/${transformString}/${publicId}`;
  }
  
  return originalUrl;
};

// Helper function to get avatar URL with fallback
export const getAvatarUrl = (avatarUrl, userType = 'user') => {
  if (avatarUrl) {
    return getTransformedImageUrl(avatarUrl, IMAGE_TRANSFORMS.AVATAR);
  }
  
  return userType === 'admin' ? DEFAULT_PROFILE_IMAGES.ADMIN : DEFAULT_PROFILE_IMAGES.USER;
};

// Helper function to get post image URL with fallback
export const getPostImageUrl = (imageUrl, size = 'featured') => {
  if (imageUrl) {
    const transform = size === 'thumbnail' ? IMAGE_TRANSFORMS.POST_THUMBNAIL :
                     size === 'full' ? IMAGE_TRANSFORMS.POST_FULL :
                     IMAGE_TRANSFORMS.POST_FEATURED;
    return getTransformedImageUrl(imageUrl, transform);
  }
  
  return FALLBACK_IMG;
};