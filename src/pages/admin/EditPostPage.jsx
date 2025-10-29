import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  adminGetPost,
  adminUpdatePost,
  adminDeletePost,
} from "@/services/posts";
import { usePostsStore } from "@/stores/postsStore";
import { useAdminCategories } from "@/hooks/useAdminCategories";
import PostImageUpload from "@/components/upload/PostImageUpload";
import TagsDropdown from "@/components/ui/TagsDropdown";
import { parseTagsFromString } from "@/constants/tags";
import LoadingPoring from "@/components/loading/LoadingPoring";
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal.jsx';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { Save, Eye, Trash2 } from 'lucide-react';

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updatePost } = usePostsStore();
  const { categories, loading: categoriesLoading } = useAdminCategories();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    content: "",
    image: "",
    imagePublicId: "",
    status: "draft",
    bylineName: "",
    bylineAvatar: "",
    tags: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const p = await adminGetPost(id);
        const postTitle = p.title || "";
        
        // Check if post has invalid title
        if (postTitle.toLowerCase().includes('untitled') || postTitle === 'Untitled Post') {
          toast.warning('This post has an invalid title. Please update the title before publishing.', {
            duration: 5000,
          });
        }
        
        setForm({
          title: postTitle,
          category: p.category || "",
          description: p.description || "",
          content: p.content || "",
          image: p.image || "",
          imagePublicId: p.imagePublicId || "",
          status: p.status || "draft",
          bylineName: p.bylineName || "",
          bylineAvatar: p.bylineAvatar || "",
          tags: Array.isArray(p.tags) ? p.tags : parseTagsFromString(p.tags || ""),
        });
      } catch (e) {
        toast.error("Load failed");
      } finally {
        // เพิ่ม delay เพื่อให้ดู Poring animation นานขึ้น
        await new Promise(resolve => setTimeout(resolve, 500));
        setLoading(false);
      }
    })();
  }, [id]);

  const save = async (overrideStatus) => {
    // Very strict validation before saving
    const trimmedTitle = form.title?.trim() || '';
    const trimmedContent = form.content?.trim() || '';
    
    // Check for empty or invalid title first
    if (!trimmedTitle) {
      toast.error('Title is required');
      return;
    }
    
    // Check for "Untitled Post" or similar invalid titles
    if (trimmedTitle.toLowerCase().includes('untitled') || 
        trimmedTitle === 'Untitled Post' || 
        trimmedTitle === 'untitled post' ||
        trimmedTitle === 'Untitled' ||
        trimmedTitle === 'untitled') {
      toast.error('Please enter a proper title for your post');
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
    
    // Additional check for publishing with invalid title
    if (overrideStatus === 'published') {
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
      const updatedPost = await toast.promise(adminUpdatePost(id, { 
        ...form, 
        title: form.title.trim(),
        description: form.description.trim(),
        content: form.content.trim(),
        bylineName: form.bylineName?.trim() || '',
        status: overrideStatus || form.status,
        tags: form.tags && form.tags.length > 0 ? form.tags : undefined,
      }), {
        loading: "Saving...",
        success: overrideStatus === "published" ? "Published 🎉" : "Saved ✅",
        error: (e) => e?.response?.data?.error || "Update failed",
      });
      
      // Update posts store with new status
      const newStatus = overrideStatus || form.status;
      updatePost(String(id), { status: newStatus });
      
      // Wait a bit for store update to complete, then redirect
      setTimeout(() => {
        navigate("/admin/posts");
      }, 100);
    } finally {
      setSaving(false);
    }
  };

  const del = async () => {
    try {
      await toast.promise(adminDeletePost(id), {
        loading: "Deleting...",
        success: "Deleted",
        error: "Delete failed",
      });
      navigate("/admin/posts");
    } catch {}
  };


  if (loading) return <LoadingPoring fullscreen={true} text="Loading Article..." />;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-7 via-purple-6 to-purple-5 bg-clip-text text-transparent">
            Edit article
          </h2>
          <p className="text-sm gray-7 font-medium mt-1">Update your article content and settings</p>
        </div>

        {/* Main Form Card */}
        <div className="rounded-2xl border-2 border-purple-3 bg-light-1 shadow-xl p-4 sm:p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <svg className="h-5 w-5 text-purple-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span className="text-sm font-bold gray-10">Title</span>
            </label>
            <input
              className="w-full rounded-lg border-2 border-purple-3 px-4 py-2.5 focus:outline-none focus:border-purple-5 transition-colors bg-light-1 gray-10 font-medium placeholder:gray-6"
              value={form.title || ''}
              onChange={(e)=>setForm(f=>({...f,title:e.target.value}))}
              placeholder="Enter article title"
            />
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <svg className="h-5 w-5 text-purple-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="text-sm font-bold gray-10">Category</span>
            </label>
            {categoriesLoading ? (
              <div className="w-full rounded-lg border-2 border-purple-3 px-4 py-2.5 bg-light-1 flex items-center justify-center">
                <div className="w-8 h-8">
                  <LoadingPoring text="" imgSrc="/images/loading/coderoar-loading.png" />
                </div>
              </div>
            ) : (
              <Select
                value={form.category || ''}
                onChange={(value) => setForm(f => ({ ...f, category: value }))}
                placeholder="Select category"
                size="lg"
                options={categories.map((category) => ({
                  value: category.name,
                  label: category.name
                }))}
              />
            )}
          </div>

          {/* Thumbnail Image Section */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-bold gray-10">
              <svg className="h-5 w-5 text-purple-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Thumbnail image
            </label>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Image Preview */}
              <div className="w-full md:w-64 h-40 md:h-40 border-2 border-dashed border-purple-3 rounded-xl bg-gradient-to-br from-purple-1/30 to-emerald-1/20 flex items-center justify-center overflow-hidden relative">
                {form.image ? (
                  <>
                    <img 
                      src={form.image} 
                      alt="Thumbnail preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, image: '' }))}
                        className="rounded-full bg-error px-4 py-2 text-sm font-bold text-light-1 hover:bg-error/90 transition-colors shadow-lg"
                      >
                        Remove
                      </button>
                    </div>
                  </>
                ) : null}
                <div className={`flex flex-col items-center gap-2 gray-6 ${form.image ? 'hidden' : 'flex'}`}>
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">No image selected</span>
                </div>
              </div>
              
              {/* Upload Component */}
              <div className="flex-1 space-y-4">
                <PostImageUpload
                  onUploadSuccess={(result) => {
                    setForm(f => ({ ...f, image: result.url, imagePublicId: result.publicId }));
                    toast.success('Image uploaded successfully!');
                  }}
                  onUploadError={(error) => {
                    toast.error(`Upload failed: ${error.message}`);
                  }}
                  currentImage={form.image}
                  initialImage={form.image ? { url: form.image, publicId: form.imagePublicId } : null}
                  multiple={false}
                  maxFiles={1}
                  className="w-full"
                  postId={id}
                />
                
                {/* Manual URL Input */}
                <div>
                  <input
                    type="text"
                    placeholder="Or enter image URL manually"
                    value={form.image || ''}
                    onChange={(e) => setForm(f => ({ ...f, image: e.target.value }))}
                    className="w-full gray-10 font-medium border-2 border-purple-3 focus:border-purple-5 rounded-lg px-4 py-2 bg-light-1 focus:outline-none transition-all text-base"
                  />
                  <p className="text-xs gray-6 mt-1 font-medium">
                    You can also paste an image URL directly
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <svg className="h-5 w-5 text-purple-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <span className="text-sm font-bold gray-10">Introduction</span>
            </label>
            <textarea
              className="w-full rounded-lg border-2 border-purple-3 px-4 py-2.5 focus:outline-none focus:border-purple-5 transition-colors resize-none bg-gradient-to-br from-light-1 to-purple-1/10 gray-10 font-medium placeholder:gray-6"
              rows={3}
              value={form.description || ''}
              onChange={(e)=>setForm(f=>({...f,description:e.target.value}))}
              placeholder="Write a brief introduction..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <svg className="h-5 w-5 text-purple-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="text-sm font-bold gray-10">Tags</span>
            </label>
            <TagsDropdown
              selectedTags={form.tags}
              onTagsChange={(tags) => setForm(f => ({ ...f, tags }))}
              placeholder="Select tags for your post..."
              maxTags={5}
              className="w-full"
            />
            <p className="text-xs gray-7 mt-1 font-medium">
              Select up to 5 tags to categorize your post. Popular tags: dino, base, survival, pvp, events
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <svg className="h-5 w-5 text-purple-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-bold gray-10">Content</span>
            </label>
            <textarea
              className="w-full rounded-lg border-2 border-purple-3 px-4 py-2.5 focus:outline-none focus:border-purple-5 transition-colors resize-none bg-gradient-to-br from-light-1 to-purple-1/10 gray-10 font-medium placeholder:gray-6"
              rows={12}
              value={form.content || ''}
              onChange={(e)=>setForm(f=>({...f,content:e.target.value}))}
              placeholder="Write your article content..."
            />
          </div>

          {/* Byline Section */}
          <div className="rounded-xl border-2 border-purple-2 p-5 bg-gradient-to-br from-purple-1/40 to-emerald-1/20 space-y-4">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-purple-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-sm font-bold gray-10">Display Byline</p>
            </div>
            
            <input
              className="w-full rounded-lg border-2 border-purple-3 px-4 py-2.5 focus:outline-none focus:border-purple-5 transition-colors bg-light-1 gray-10 font-medium placeholder:gray-6"
              value={form.bylineName || ''}
              onChange={(e)=>setForm(f=>({...f,bylineName:e.target.value}))}
              placeholder="Byline name"
            />
            
            <input
              className="w-full rounded-lg border-2 border-purple-3 px-4 py-2.5 focus:outline-none focus:border-purple-5 transition-colors bg-light-1 gray-10 font-medium placeholder:gray-6"
              value={form.bylineAvatar || ''}
              onChange={(e)=>setForm(f=>({...f,bylineAvatar:e.target.value}))}
              placeholder="Byline avatar URL"
            />
            
            <p className="text-xs gray-7 font-medium">
              Leave blank to use real author's name & avatar.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-purple-3">
            <Button
              type="button"
              disabled={saving}
              onClick={() => save("draft")}
              variant="secondary"
              size="md"
              icon={<Save />}
              className="w-full sm:flex-1"
            >
              Save draft
            </Button>
            <Button
              type="button"
              disabled={saving}
              onClick={() => save("published")}
              variant="success"
              size="md"
              icon={<Eye />}
              className="w-full sm:flex-1"
            >
              Publish
            </Button>
            <Button
              type="button"
              onClick={() => setShowDelete(true)}
              variant="outline"
              size="md"
              icon={<Trash2 />}
              className="w-full sm:w-auto border-red-6 text-red-6 hover:bg-red-6 hover:text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => { setShowDelete(false); del(); }}
      />
    </>
  );
}