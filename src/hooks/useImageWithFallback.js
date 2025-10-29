import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for handling image loading with fallback
 * @param {string} imageUrl - Initial image URL
 * @returns {object} { src, onError }
 */
export const useImageWithFallback = (imageUrl) => {
  const [src, setSrc] = useState(imageUrl);
  const [hasError, setHasError] = useState(false);

  // Only update src when imageUrl actually changes and is valid
  useEffect(() => {
    if (imageUrl && imageUrl !== 'undefined' && imageUrl !== 'null' && imageUrl !== '') {
      if (imageUrl !== src) {
        setSrc(imageUrl);
        setHasError(false);
      }
    } else if (!imageUrl || imageUrl === 'undefined' || imageUrl === 'null' || imageUrl === '') {
      // Only set fallback if we don't already have a valid src
      if (src === imageUrl) {
        setSrc('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop');
        setHasError(false);
      }
    }
  }, [imageUrl]); // Remove src from dependencies to prevent flickering

  const onError = useCallback(() => {
    if (!hasError) {
      setHasError(true);
      // Set fallback image when original fails to load
      setSrc('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop');
    }
  }, [hasError]);

  return { src, onError };
};