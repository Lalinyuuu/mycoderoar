import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  adminListCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminGetCategoryPosts,
} from "@/services/posts";

export function useAdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      // Check if user has admin role before making API call
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      
      if (user) {
        const parsedUser = JSON.parse(user);
        
        if (parsedUser?.role !== 'admin') {
          toast.error('Access denied. Admin role required.');
          setCategories([]);
          setLoading(false);
          return;
        }
      }
      
      const res = await adminListCategories({ limit: 100 });
      
      // Filter out any null/undefined categories and ensure they have required properties
      const validCategories = (res?.categories || []).filter(cat => 
        cat && typeof cat === 'object' && cat.name && typeof cat.name === 'string'
      );
      setCategories(validCategories);
// เพิ่ม delay เพื่อให้ดู Poring animation นานขึ้น
await new Promise(resolve => setTimeout(resolve, 800));
    } catch (e) {
      toast.error(e?.response?.data?.error || "Load categories failed");
      setCategories([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat && cat.name && cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const createCategory = async (payload) => {
    setCreating(true);
    try {
      const newCategory = await adminCreateCategory(payload);
      
      // Dismiss previous toasts to prevent stacking
      toast.dismiss();
      toast.success("Category created successfully! 🎉");

      // Force immediate state update with new data
      setCategories(prev => [newCategory, ...prev]);
      setRefreshKey(prev => prev + 1);
      return newCategory;
    } catch (error) {
      toast.dismiss();
      toast.error(error?.response?.data?.error || "Create category failed");
      throw error;
    } finally {
      setCreating(false);
    }
  };

  const updateCategory = async (id, payload) => {
    setUpdating(id);
    try {
      // Call API directly without toast.promise wrapper
      const updatedCategory = await adminUpdateCategory(id, payload);
      
      // Dismiss previous toasts to prevent stacking
      toast.dismiss();
      toast.success("Category updated successfully! ✅");

      // Force immediate state update with new data
      
      if (updatedCategory && updatedCategory.id) {
        setCategories(prev => {
          const newCategories = prev.map(cat => cat.id === id ? updatedCategory : cat);
          return newCategories;
        });
        setRefreshKey(prev => prev + 1);
      } else {
        // Fallback: reload from server
        await load();
      }
      return updatedCategory;
    } catch (error) {
      toast.dismiss();
      toast.error(error?.response?.data?.error || "Update category failed");
      throw error;
    } finally {
      setUpdating(null);
    }
  };

  const deleteCategory = async (id) => {
    setDeleteId(id);
    try {
      const result = await adminDeleteCategory(id);
      
      // Dismiss previous toasts to prevent stacking
      toast.dismiss();
      toast.success("Category deleted successfully! 🗑️");

      // Force immediate state update
      setCategories(prev => prev.filter(cat => cat.id !== id));
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      const errorMsg = error?.response?.data?.error || "Delete category failed";
      
      // Dismiss previous toasts to prevent stacking
      toast.dismiss();
      if (error?.response?.data?.postsCount) {
        toast.error(`${errorMsg} (${error.response.data.postsCount} posts using this category)`);
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setDeleteId(null);
    }
  };

  const getCategoryPosts = async (id, params = {}) => {
    try {
      const res = await adminGetCategoryPosts(id, params);
      return res;
    } catch (error) {
      toast.error("Failed to load category posts");
      throw error;
    }
  };

  return {
    // Data
    categories: filteredCategories,
    loading,
    creating,
    updating,
    deleteId,
    refreshKey,

    // Search
    search,
    setSearch,

    // Actions
    load,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryPosts,
  };
}
