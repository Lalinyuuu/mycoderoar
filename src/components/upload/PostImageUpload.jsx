import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image, Upload, X, AlertCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadImage, UPLOAD_MODES, UPLOAD_TYPES } from '../../services/upload/imageUploader';
import { formatFileSize } from '../../utils/imageUtils';
import { VALIDATION_MESSAGES } from '../../constants/images';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';

const PostImageUpload = ({ 
  onUploadSuccess = null,
  onUploadError = null,
  className = '',
  multiple = false,
  maxFiles = 5,
  postId = null,
  initialImage = null // เพิ่ม prop สำหรับรูปภาพเริ่มต้น
}) => {
  
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadedImages, setUploadedImages] = useState(initialImage ? [initialImage] : []);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);


  // Sync with initialImage prop
  useEffect(() => {
    if (initialImage && !uploadedImages.find(img => img.url === initialImage.url)) {
      setUploadedImages([initialImage]);
    }
  }, [initialImage]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach(error => {
          toast.error(`${file.name}: ${error.message}`);
        });
      });
    }

    if (acceptedFiles.length > 0) {
      if (multiple) {
        acceptedFiles.forEach(file => handleFileSelection(file));
      } else {
        handleFileSelection(acceptedFiles[0]);
      }
    }
  }, [multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: multiple ? maxFiles : 1,
    maxSize: 10 * 1024 * 1024,
    disabled: uploadStatus === 'uploading'
  });

  const handleFileSelection = async (file) => {
    try {
      setSelectedFile(file);
      
      // Upload directly without cropping for now
      await handleUpload(file);
    } catch (error) {
    }
  };


  const handleUpload = async (file) => {
    try {
      setUploadStatus('uploading');
      setUploadProgress(0);
      setUploadError(null);

      // Use centralized upload service with fallback modes
      const result = await uploadImage(file, UPLOAD_TYPES.POST_IMAGE, UPLOAD_MODES.CLIENT_UPLOAD, {
        folder: 'posts',
        onProgress: (progress) => {
          setUploadProgress(progress);
        }
      });
      
      
      if (result.success) {
        setUploadStatus('success');
        setUploadProgress(100);
        
        const newImage = {
          id: result.data.publicId || Date.now().toString(),
          url: result.data.url,
          publicId: result.data.publicId,
          originalName: file.name,
          size: file.size,
          uploadedAt: new Date()
        };
        
        
        setUploadedImages(prev => {
          // For single image upload, replace the existing image
          const updated = multiple ? [...prev, newImage] : [newImage];
          return updated;
        });
        
        if (onUploadSuccess) {
          onUploadSuccess(result.data);
        }
      } else {
        throw new Error(result.error || 'Upload failed');
      }

    } catch (error) {
      setUploadStatus('error');
      setUploadProgress(0);
      
      // Better error messages
      let errorMessage = error.message;
      if (error.response?.status === 500) {
        errorMessage = 'Server error - Please try again later';
      } else if (error.response?.status === 413) {
        errorMessage = 'File too large - Please choose a smaller image';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication required - Please login again';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Upload timeout - Please try again with a smaller file';
      } else if (error.isNetworkError) {
        errorMessage = 'Network error - Please check your connection';
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

  const handleRemoveUploaded = async (imageId) => {
    // Find the image to remove
    const imageToRemove = uploadedImages.find(img => img.id === imageId);
    if (!imageToRemove) {
      return;
    }

    try {
      // Delete from Cloudinary if publicId exists and it's a post image
      if (imageToRemove.publicId && imageToRemove.publicId.includes('posts/')) {
        // Note: deleteImage function not available in imageUploader
        // For now, just remove from local state
      }

      // Remove from local state
      setUploadedImages(prev => prev.filter(img => img.id !== imageId));

    } catch (error) {
      // Still remove from local state even if Cloudinary deletion fails
      setUploadedImages(prev => prev.filter(img => img.id !== imageId));
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-purple-2 bg-purple-1 dark:bg-purple-6/20' : 'border-gray-3 dark:border-gray-6'}
          ${uploadStatus === 'uploading' ? 'pointer-events-none opacity-50' : 'hover:border-purple-2 hover:bg-light-2 dark:hover:bg-gray-7'}
          flex flex-col items-center justify-center text-center
        `}
      >
        <input {...getInputProps()} />
        
        {/* Show existing image if available */}
        {uploadedImages.length > 0 && !multiple && uploadedImages[0]?.url && (
          <div className="mb-4">
            <div className="w-full aspect-[16/9] overflow-hidden rounded-lg border border-gray-2 dark:border-gray-7 bg-gray-1 dark:bg-gray-8">
              <img
                src={uploadedImages[0].url}
                alt={uploadedImages[0].originalName}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs gray-5 mt-2">Current image • Full size</p>
          </div>
        )}
        
        <div className="flex flex-col items-center gap-3">
          <Image className="w-12 h-12 gray-4 dark:gray-5" />
          
          <div className="space-y-1">
            <p className="text-lg font-medium gray-9 dark:text-white">
              {isDragActive ? 'Drop images here' : uploadedImages.length > 0 ? 'Replace image' : 'Upload images'}
            </p>
            <p className="text-sm gray-5 dark:gray-4">
              Drag & drop or click to browse
            </p>
            <p className="text-xs gray-4 dark:gray-5">
              JPG, PNG, GIF, WebP up to 10MB • Full size upload
            </p>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadStatus !== 'idle' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="gray-6 dark:gray-4">
              {uploadStatus === 'uploading' && 'Uploading...'}
              {uploadStatus === 'success' && 'Upload completed!'}
              {uploadStatus === 'error' && 'Upload failed'}
            </span>
            <span className="gray-5 dark:gray-5">
              {uploadProgress}%
            </span>
          </div>
          
          {uploadStatus === 'uploading' && (
            <div className="w-full bg-gray-2 dark:bg-gray-7 rounded-full h-2 progress-bar-loading">
              <div 
                className="bg-gradient-to-r from-purple-5 to-purple-6 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          
          {uploadStatus === 'error' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-6">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{uploadError}</span>
              </div>
              <Button
                onClick={handleRetry}
                variant="danger"
                size="md"
                loading={isRetrying}
              >
                Retry
              </Button>
            </div>
          )}
          
          {uploadStatus === 'success' && (
            <div className="flex items-center gap-2 text-emerald-6">
              <div className="w-4 h-4 bg-emerald-6 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-sm">Image uploaded successfully!</span>
            </div>
          )}
        </div>
      )}

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium gray-7 dark:gray-3">
            Uploaded Images ({uploadedImages.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((image, index) => {
              return (
                <div key={image.id || `image-${index}`} className="relative group">
                  {image.url ? (
                    <div className="w-full aspect-[16/9] overflow-hidden rounded-lg border border-gray-2 dark:border-gray-7 bg-gray-1 dark:bg-gray-8">
                      <img
                        src={image.url}
                        alt={image.originalName}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[16/9] bg-gray-2 dark:bg-gray-7 rounded-lg border border-gray-2 dark:border-gray-7 flex items-center justify-center">
                      <span className="text-gray-5 text-xs">No URL</span>
                    </div>
                  )}
                  <IconButton
                    onClick={() => handleRemoveUploaded(image.id)}
                    icon={<Trash2 />}
                    variant="danger"
                    size="md"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    tooltip="Remove image"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs p-1 rounded">
                    <p className="truncate">{image.originalName}</p>
                    <p>{formatFileSize(image.size)} • Full size</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostImageUpload;