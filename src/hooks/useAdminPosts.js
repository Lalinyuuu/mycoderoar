import { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminListPosts, adminDeletePost } from "@/services/posts";
import { usePostsStore } from "@/stores/postsStore";

export function useAdminPosts() {
  const { posts, setPosts, removePost } = usePostsStore();
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminListPosts({ limit: 100 });
      const normalizedPosts = (res?.posts || []).map(p => ({
        ...p,
        id: String(p.id)
      }));
      setPosts(normalizedPosts);
    } catch (e) {
      toast.error(e?.response?.data?.error || "Load posts failed");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Only load if posts array is empty (initial load)
  useEffect(() => {
    if (posts.length === 0) {
      load();
    } else {
      setLoading(false);
    }
  }, []); // Empty dependency array to run only once on mount

  const askDelete = (id) => setDeleteId(id);

  const confirmDelete = async () => {
    const id = deleteId;
    setDeleteId(null);
    if (!id) return;

    try {
      await toast.promise(adminDeletePost(id), {
        loading: "Deleting...",
        success: "Deleted",
        error: (e) => e?.response?.data?.error || "Delete failed",
      });
      removePost(String(id));
    } catch {}
  };

  const filteredPosts = posts.filter(post => {
    const matchSearch = search === "" || 
      post.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "" || post.status === statusFilter;
    const matchCategory = categoryFilter === "" || post.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });


  const categories = [...new Set(posts.map(p => p.category).filter(Boolean))];

  return {
    // Data
    posts: filteredPosts,
    categories,
    loading,
    deleteId,
    
    // Filters
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    
    // Actions
    askDelete,
    confirmDelete,
    setDeleteId,
    refresh: load, // Expose load function for manual refresh
  };
}