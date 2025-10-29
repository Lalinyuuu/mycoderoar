/**
 * Create Post Page
 * Main page component for creating new posts
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { adminCreatePost } from "@/services/posts";
import { usePostsStore } from "@/stores/postsStore";
import { useAdminCategories } from "@/hooks/useAdminCategories";
import PostForm from "./components/PostForm";

export default function CreatePostPage() {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const navigate = useNavigate();
  const { addPost } = usePostsStore();
  const { categories, loading: categoriesLoading } = useAdminCategories();

  const handleSave = async (formData, status = "draft") => {
    if (saving) return;
    
    // Very strict validation before sending to backend
    const trimmedTitle = formData.title?.trim() || '';
    const trimmedContent = formData.content?.trim() || '';
    
    if (!trimmedTitle) {
      toast.error('Title is required');
      return;
    }
    
    if (trimmedTitle.length < 3) {
      toast.error('Title must be at least 3 characters');
      return;
    }
    
    if (!trimmedContent) {
      toast.error('Content is required');
      return;
    }
    
    if (trimmedContent.length < 10) {
      toast.error('Content must be at least 10 characters');
      return;
    }
    
    // Additional check for "Untitled Post" or similar invalid titles
    if (trimmedTitle.toLowerCase().includes('untitled') || 
        trimmedTitle === 'Untitled Post' || 
        trimmedTitle === 'untitled post' ||
        trimmedTitle === 'Untitled' ||
        trimmedTitle === 'untitled') {
      toast.error('Please enter a proper title for your post');
      return;
    }
    
    // Check if trying to publish with invalid title
    if (status === 'published') {
      if (trimmedTitle.toLowerCase().includes('untitled') || 
          trimmedTitle === 'Untitled Post' || 
          trimmedTitle === 'untitled post' ||
          trimmedTitle === 'Untitled' ||
          trimmedTitle === 'untitled') {
        toast.error('Cannot publish post with "Untitled Post" title. Please enter a proper title.');
        return;
      }
    }
    
    setSaving(true);

    try {
      const rawPost = await toast.promise(
        adminCreatePost({
          title: formData.title.trim(),
          category: formData.category,
          description: formData.description.trim(),
          content: formData.content.trim(),
          image: formData.image,
          imagePublicId: formData.imagePublicId,
          status,
          bylineName: formData.bylineName?.trim() || undefined,
          bylineAvatar: formData.bylineAvatar || undefined,
          tags: formData.tags && formData.tags.length > 0 ? formData.tags : undefined,
        }),
        {
          loading: status === 'draft' ? 'Saving draft...' : 'Publishing post...',
          success: status === 'draft' ? 'Draft saved!' : 'Post published!',
          error: 'Failed to save post'
        }
      );

      // Add to store
      addPost(rawPost);

      // Navigate based on status
      if (status === 'published') {
        navigate('/admin/posts');
      } else {
        navigate('/admin/posts');
      }
    } catch (error) {
      toast.error('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/posts');
  };

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <PostForm
          categories={categories}
          categoriesLoading={categoriesLoading}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
          uploading={uploading}
        />
      </div>
    </div>
  );
}