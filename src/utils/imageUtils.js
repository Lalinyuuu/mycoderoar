/**
 * Image utility functions for upload, compression, and processing
 */

// File validation
export const validateImageFile = (file, maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']) => {
  const errors = [];

  if (!allowedTypes.includes(file.type)) {
    errors.push('Invalid file type. Please upload JPG, PNG, GIF, or WebP files.');
  }

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    errors.push(`File size must be less than ${maxSizeMB}MB.`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Image compression
export const compressImage = (file, quality = 0.8, maxWidth = 1920, maxHeight = 1080) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          resolve(new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          }));
        },
        file.type,
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// Crop image to square (for avatars)
export const cropImageToSquare = (file) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const size = Math.min(img.width, img.height);
      canvas.width = size;
      canvas.height = size;

      const x = (img.width - size) / 2;
      const y = (img.height - size) / 2;

      ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
      
      canvas.toBlob(
        (blob) => {
          resolve(new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          }));
        },
        file.type,
        0.9
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// Crop image to 16:9 aspect ratio
export const cropImageTo16to9 = (file) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const targetRatio = 16 / 9;
      const currentRatio = img.width / img.height;

      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = img.width;
      let sourceHeight = img.height;

      if (currentRatio > targetRatio) {
        // Image is wider than 16:9, crop width
        sourceWidth = img.height * targetRatio;
        sourceX = (img.width - sourceWidth) / 2;
      } else {
        // Image is taller than 16:9, crop height
        sourceHeight = img.width / targetRatio;
        sourceY = (img.height - sourceHeight) / 2;
      }

      canvas.width = 1920; // Standard width for 16:9
      canvas.height = 1080; // Standard height for 16:9

      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, canvas.width, canvas.height
      );
      
      canvas.toBlob(
        (blob) => {
          resolve(new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          }));
        },
        file.type,
        0.9
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// Get image dimensions
export const getImageDimensions = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        ratio: img.width / img.height
      });
    };
    img.src = URL.createObjectURL(file);
  });
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Create preview URL
export const createPreviewUrl = (file) => {
  return URL.createObjectURL(file);
};

// Clean up preview URL
export const cleanupPreviewUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};
