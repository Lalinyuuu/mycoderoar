/**
 * Post Form Component
 * Form for creating and editing posts
 */

import { useState, useEffect } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  User, 
  FileText, 
  Tag,
  Save,
  Eye,
  X
} from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import PostImageUpload from '@/components/upload/PostImageUpload';
import TagsDropdown from '@/components/ui/TagsDropdown';

const PostForm = ({
  post = null,
  categories = [],
  categoriesLoading = false,
  onSave,
  onCancel,
  saving = false,
  uploading = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    content: '',
    image: '',
    imagePublicId: '',
    bylineName: '',
    bylineAvatar: '',
    tags: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        category: post.category || '',
        description: post.description || '',
        content: post.content || '',
        image: post.image || '',
        imagePublicId: post.imagePublicId || '',
        bylineName: post.bylineName || '',
        bylineAvatar: post.bylineAvatar || '',
        tags: post.tags || []
      });
    }
  }, [post]);

  const handleInputChange = (field, value) => {
    // Prevent saving empty titles - more strict validation
    if (field === 'title') {
      const trimmedValue = value?.trim() || '';
      if (!trimmedValue) {
        setFormData(prev => ({
          ...prev,
          [field]: ''
        }));
        setErrors(prev => ({
          ...prev,
          title: 'Title is required'
        }));
        return;
      }
      
      // Set the trimmed value
      setFormData(prev => ({
        ...prev,
        [field]: trimmedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // More strict title validation
    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.content || !formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (status) => {
    // Very strict validation before saving
    const trimmedTitle = formData.title?.trim() || '';
    const trimmedContent = formData.content?.trim() || '';
    
    if (!trimmedTitle) {
      setErrors(prev => ({ ...prev, title: 'Title is required' }));
      return;
    }
    
    if (trimmedTitle.length < 3) {
      setErrors(prev => ({ ...prev, title: 'Title must be at least 3 characters' }));
      return;
    }
    
    if (!trimmedContent) {
      setErrors(prev => ({ ...prev, content: 'Content is required' }));
      return;
    }
    
    if (trimmedContent.length < 10) {
      setErrors(prev => ({ ...prev, content: 'Content must be at least 10 characters' }));
      return;
    }
    
    // Additional check for "Untitled Post" or similar invalid titles
    if (trimmedTitle.toLowerCase().includes('untitled') || 
        trimmedTitle === 'Untitled Post' || 
        trimmedTitle === 'untitled post' ||
        trimmedTitle === 'Untitled' ||
        trimmedTitle === 'untitled') {
      setErrors(prev => ({ ...prev, title: 'Please enter a proper title for your post' }));
      return;
    }
    
    // Check if trying to publish with invalid title
    if (status === 'published') {
      if (trimmedTitle.toLowerCase().includes('untitled') || 
          trimmedTitle === 'Untitled Post' || 
          trimmedTitle === 'untitled post' ||
          trimmedTitle === 'Untitled' ||
          trimmedTitle === 'untitled') {
        setErrors(prev => ({ ...prev, title: 'Cannot publish post with "Untitled Post" title. Please enter a proper title.' }));
        return;
      }
    }
    
    if (!validateForm()) return;
    
    // Ensure we send trimmed data
    const trimmedData = {
      ...formData,
      title: trimmedTitle,
      description: formData.description?.trim() || '',
      content: trimmedContent,
      bylineName: formData.bylineName?.trim() || ''
    };
    
    onSave(trimmedData, status);
  };

  const handleImageUpload = (imageUrl, publicId) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl,
      imagePublicId: publicId
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-5 to-blue-7 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-9">
                {post ? 'Edit Post' : 'Create New Post'}
              </h1>
              <p className="text-gray-6">Write and publish your content</p>
            </div>
          </div>
          
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-1 rounded-xl transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-6" />
            </button>
          )}
        </div>

        <form className="space-y-6">
          {/* Title */}
          <div>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter post title"
              label="Title"
              required
              size="lg"
              error={errors.title}
            />
          </div>

          {/* Category and Description Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-7 mb-2">
                Category *
              </label>
              <Select
                value={formData.category}
                onChange={(value) => handleInputChange('category', value)}
                placeholder="Select category"
                size="lg"
                disabled={categoriesLoading}
                error={!!errors.category}
                options={categories.map((cat) => ({
                  value: cat.name,
                  label: cat.name
                }))}
              />
              {errors.category && (
                <p className="text-red-6 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <Input
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description"
                label="Description"
                size="lg"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-7 mb-2">
              Featured Image
            </label>
            <PostImageUpload
              onUploadSuccess={(result) => handleImageUpload(result.url, result.publicId)}
              currentImage={formData.image}
              uploading={uploading}
              initialImage={formData.image ? { url: formData.image, publicId: formData.imagePublicId } : null}
            />
          </div>

          {/* Byline Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                type="text"
                value={formData.bylineName}
                onChange={(e) => handleInputChange('bylineName', e.target.value)}
                placeholder="Author name"
                label="Byline Name"
                size="lg"
              />
            </div>

            <div>
              <Input
                type="url"
                value={formData.bylineAvatar}
                onChange={(e) => handleInputChange('bylineAvatar', e.target.value)}
                placeholder="Avatar image URL"
                label="Byline Avatar URL"
                size="lg"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-7 mb-2">
              Tags
            </label>
            <TagsDropdown
              selectedTags={formData.tags}
              onTagsChange={(tags) => handleInputChange('tags', tags)}
            />
          </div>

          {/* Content */}
          <div>
            <Textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Write your post content here..."
              rows={15}
              label="Content"
              required
              size="lg"
              error={errors.content}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-1">
            <div className="text-sm text-gray-6">
              {formData.content.length} characters
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSave('draft')}
                disabled={saving || !formData.title?.trim() || formData.title?.trim().length < 3 || !formData.content?.trim() || formData.content?.trim().length < 10}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-gray-7 to-gray-8 px-6 py-3 font-bold text-white hover:scale-105 disabled:opacity-50 transition-all shadow-md"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              
              <button
                type="button"
                onClick={() => handleSave('published')}
                disabled={saving || !formData.title?.trim() || formData.title?.trim().length < 3 || !formData.content?.trim() || formData.content?.trim().length < 10}
                className="flex items-center gap-2 rounded-full bg-emerald-5 px-6 py-3 font-bold text-white hover:bg-emerald-6 hover:scale-105 disabled:opacity-50 transition-all shadow-md"
              >
                <Eye className="w-4 h-4" />
                {saving ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
