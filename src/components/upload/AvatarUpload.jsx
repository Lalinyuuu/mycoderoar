import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, X, AlertCircle } from 'lucide-react';
// Toasts are handled by parent components to avoid duplicate notifications
import { uploadImage, UPLOAD_MODES, UPLOAD_TYPES } from '../../services/cloudinaryClient';
import { formatFileSize } from '../../utils/imageUtils';
import { VALIDATION_MESSAGES } from '../../constants/images';
import { preUploadCheck } from '../../utils/connectionUtils';

const AvatarUpload = ({ 
  currentAvatar = null,
  onUploadSuccess = null,
  onUploadError = null,
  className = '',
  size = 'lg'
}) => {
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const sizeConfig = {
    sm: { container: 'w-16 h-16 md:w-20 md:h-20', icon: 'w-6 h-6', text: 'text-xs' },
    md: { container: 'w-20 h-20 md:w-32 md:h-32', icon: 'w-8 h-8 md:w-10 md:h-10', text: 'text-sm' },
    lg: { container: 'w-32 h-32 md:w-40 md:h-40', icon: 'w-10 h-10 md:w-12 md:h-12', text: 'text-sm md:text-base' },
    xl: { container: 'w-40 h-40 md:w-48 md:h-48', icon: 'w-12 h-12 md:w-16 md:h-16', text: 'text-base md:text-lg' }
  };

  const currentSize = sizeConfig[size];

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      // Surface error through callback if provided
      if (onUploadError) {
        onUploadError(new Error(error.message));
      }
      return;
    }

    const file = acceptedFiles[0];
    handleFileSelection(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: uploadStatus === 'uploading'
  });

  const handleFileSelection = async (file) => {
    try {
      setSelectedFile(file);
      await handleUpload(file);
    } catch (error) {
      if (onUploadError) {
        onUploadError(error);
      }
    }
  };

  const handleUpload = async (file) => {
    try {
      setUploadStatus('uploading');
      setUploadProgress(0);
      setUploadError(null);

      // Run pre-upload connection check
      const connectionCheck = await preUploadCheck(import.meta.env.VITE_API_BASE_URL || 'https://blog-api-tau-sand.vercel.app');
      
      if (!connectionCheck.shouldProceed) {
        const errorMsg = connectionCheck.backendReachable 
          ? 'Network connection is poor - Please check your internet connection'
          : 'Backend server is not responding - Please try again later';
        throw new Error(errorMsg);
      }
      
      // Fallback progress simulation
      const fallbackProgress = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 5;
        });
      }, 500);

      // Use centralized upload service with fallback modes
      const result = await uploadImage(file, UPLOAD_TYPES.AVATAR, UPLOAD_MODES.CLIENT_UPLOAD, {
        folder: 'avatars',
        onProgress: (progress) => {
          clearInterval(fallbackProgress);
          setUploadProgress(progress);
        }
      });

      // Clear fallback progress
      clearInterval(fallbackProgress);

      if (result.success) {
        setUploadStatus('success');
        setUploadProgress(100);

        if (onUploadSuccess) {
          onUploadSuccess(result.data);
        }
      } else {
        throw new Error(result.error || 'Upload failed');
      }

    } catch (error) {
      setUploadStatus('error');
      setUploadProgress(0);

      // Clear fallback progress on error
      if (typeof fallbackProgress !== 'undefined') {
        clearInterval(fallbackProgress);
      }

      // Better error messages
      let errorMessage = error.message;
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Upload timeout - Please try again with a smaller file or better connection';
      } else if (error.isNetworkError) {
        errorMessage = 'Network error - Please check your internet connection';
      } else if (error.response?.status === 413) {
        errorMessage = 'File too large - Please choose a smaller image';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication required - Please login again';
      }

      setUploadError(errorMessage);

      if (onUploadError) {
        onUploadError(error);
      }
    }
  };

  const handleRetry = async () => {
    if (!selectedFile || isRetrying) return;
    
    setIsRetrying(true);
    try {
      await handleUpload(selectedFile);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setSelectedFile(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    setUploadError(null);
    
    // Notify parent component that avatar was removed
    if (onUploadSuccess) {
      onUploadSuccess({ 
        imageUrl: null, 
        url: null, 
        publicId: null,
        removed: true 
      });
    }
  };

  // Auto-dismiss success message after 3 seconds
  useEffect(() => {
    if (uploadStatus === 'success') {
      const timer = setTimeout(() => {
        setUploadStatus('idle');
        setSelectedFile(null);
        setUploadProgress(0);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Avatar Container */}
      <div className="relative">
        <div
          {...getRootProps()}
          className={`
            ${currentSize.container} 
            border-2 border-dashed rounded-full cursor-pointer transition-all duration-200
            ${isDragActive ? 'border-purple-4 bg-purple-1' : 'border-gray-5 dark:border-gray-7'}
            ${uploadStatus === 'uploading' ? 'pointer-events-none opacity-50' : 'hover:border-purple-4 hover:bg-gray-2 dark:hover:bg-gray-9'}
            flex items-center justify-center relative overflow-hidden
          `}
        >
          <input {...getInputProps()} />
          
          {/* Current Avatar */}
          {currentAvatar && (
            <img
              src={currentAvatar}
              alt="Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          )}
          
          {/* Upload Overlay */}
          {!currentAvatar && (
            <div className="flex flex-col items-center justify-center text-gray-7 dark:text-gray-6">
              <Camera className={`${currentSize.icon} mb-1`} />
              <span className={`${currentSize.text} text-center`}>
                {isDragActive ? 'Drop here' : 'Upload'}
              </span>
            </div>
          )}
          
          {/* Hover Overlay */}
          {uploadStatus !== 'uploading' && currentAvatar && (
            <div className="absolute inset-0 bg-gray-10/50 opacity-0 hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-1" />
            </div>
          )}
        </div>

        {/* Remove Button */}
        {currentAvatar && uploadStatus !== 'uploading' && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-8 h-8 md:w-6 md:h-6 bg-error hover:bg-error text-gray-1 rounded-full flex items-center justify-center transition-colors shadow-md z-10 active:scale-95"
          >
            <X className="w-4 h-4 md:w-3 md:h-3" />
          </button>
        )}
      </div>

      {/* Upload Status */}
      {uploadStatus !== 'idle' && (
        <div className="w-full max-w-xs space-y-2">
          {/* Mobile: Enhanced status */}
          <div className="md:hidden space-y-2">
            {uploadStatus === 'uploading' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-6 dark:text-gray-4">Uploading...</span>
                  <span className="text-gray-5 dark:text-gray-5">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-2 dark:bg-gray-7 rounded-full h-2 progress-bar-loading">
                  <div 
                    className="bg-gradient-to-r from-purple-5 to-purple-6 h-2 rounded-full progress-bar-fill"
                    style={{ 
                      width: `${uploadProgress}%`
                    }}
                  />
                </div>
              </div>
            )}
            
            {uploadStatus === 'success' && (
              <div className="flex items-center gap-2 text-center">
                <div className="w-4 h-4 bg-success rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm text-success dark:text-success font-medium">Avatar uploaded!</span>
              </div>
            )}
            
            {uploadStatus === 'error' && (
              <div className="flex items-center gap-2 text-error dark:text-error">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{uploadError}</span>
              </div>
            )}
          </div>

          {/* Desktop: Enhanced progress bar */}
          <div className="hidden md:block space-y-2">
            {uploadStatus === 'uploading' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-6 dark:text-gray-4">Uploading...</span>
                  <span className="text-gray-5 dark:text-gray-5">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-2 dark:bg-gray-7 rounded-full h-2 progress-bar-loading">
                  <div 
                    className="bg-gradient-to-r from-purple-5 to-purple-6 h-2 rounded-full progress-bar-fill"
                    style={{ 
                      width: `${uploadProgress}%`
                    }}
                  />
                </div>
              </div>
            )}
            
            {uploadStatus === 'success' && (
              <div className="flex items-center gap-2 text-center">
                <div className="w-4 h-4 bg-success rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm text-success dark:text-success font-medium">Avatar uploaded successfully!</span>
              </div>
            )}
            
            {uploadStatus === 'error' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-error dark:error">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{uploadError}</span>
                  </div>
                  <button
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className="px-3 py-1 text-xs bg-error hover:bg-error disabled:opacity-50 text-gray-1 rounded transition-colors"
                  >
                    {isRetrying ? 'Retrying...' : 'Retry'}
                  </button>
                </div>
                
              </div>
            )}
          </div>
        </div>
      )}


      {/* Instructions - Desktop only */}
      {!currentAvatar && (
        <div className="hidden md:block text-xs text-gray-8 dark:text-gray-5 text-center max-w-xs">
          <p>Drag & drop or click to upload</p>
          <p>JPG, PNG, GIF, WebP up to 5MB</p>
          <p>Will be compressed to square</p>
        </div>
      )}

    </div>
  );
};

export default AvatarUpload;