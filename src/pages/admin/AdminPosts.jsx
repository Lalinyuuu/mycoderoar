import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { useAdminPosts } from "@/hooks";
import { usePostsStore } from "@/stores/postsStore";
import { DeleteConfirmModal, ErrorBoundary, LoadingPoring, Button, IconButton, Select } from "@/components";

export default function AdminPosts() {
  const {
    posts,
    categories,
    loading,
    deleteId,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    askDelete,
    confirmDelete,
    setDeleteId,
    refresh,
  } = useAdminPosts();

  // Subscribe to posts store changes for real-time updates
  const storePosts = usePostsStore((state) => state.posts);

  // Sync storePosts with posts when store changes
  useEffect(() => {
    if (storePosts.length > 0) {
      // Update the hook's posts with store posts for real-time updates
      refresh();
    }
  }, [storePosts.length]); // Trigger when store posts count changes

  // Refresh data when window regains focus (useful for detecting changes from other tabs)
  useEffect(() => {
    const handleFocus = () => {
      refresh();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []); // Remove refresh from dependency to prevent infinite loop

  // Function to get category color
  const getCategoryColor = (category) => {
    if (!category) return null;
    
    const colors = {
      'Beginner': 'bg-gradient-to-r from-emerald-5/20 to-emerald-6/20 text-emerald-8 border-emerald-4',
      'Crafting': 'bg-gradient-to-r from-yellow-4/20 to-yellow-5/20 yellow-7 border-yellow-4',
      'PvP': 'bg-gradient-to-r from-error/20 to-error/20 error border-error',
      'Events': 'bg-gradient-to-r from-pink-4/20 to-pink-5/20 pink-7 border-pink-4',
      'Builds': 'bg-gradient-to-r from-purple-5/20 to-purple-6/20 text-purple-8 border-purple-4',
      'MVP': 'bg-gradient-to-r from-yellow-4/20 to-yellow-5/20 yellow-7 border-yellow-4',
      'Guides': 'bg-gradient-to-r from-blue-4/20 to-blue-5/20 blue-7 border-blue-4',
      'Lore': 'bg-gradient-to-r from-purple-4/20 to-purple-5/20 purple-6 border-purple-4',
    };
    
    // If category is defined, return it
    if (colors[category]) {
      return colors[category];
    }
    
    // Auto-generate color for new categories based on hash
    const colorPalette = [
      'bg-gradient-to-r from-emerald-4/20 to-emerald-5/20 emerald-7 border-emerald-4',
      'bg-gradient-to-r from-blue-4/20 to-blue-5/20 blue-7 border-blue-4',
      'bg-gradient-to-r from-purple-4/20 to-purple-5/20 purple-7 border-purple-4',
      'bg-gradient-to-r from-pink-4/20 to-pink-5/20 pink-7 border-pink-4',
      'bg-gradient-to-r from-yellow-4/20 to-yellow-5/20 yellow-7 border-yellow-4',
      'bg-gradient-to-r from-emerald-5/20 to-emerald-6/20 emerald-8 border-emerald-5',
      'bg-gradient-to-r from-blue-5/20 to-blue-6/20 blue-8 border-blue-5',
      'bg-gradient-to-r from-gray-4/20 to-gray-5/20 gray-6 border-gray-5',
    ];
    
    // Simple hash function to consistently assign colors
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colorPalette.length;
    
    return colorPalette[index];
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
      {/* Loading Overlay */}
      {loading && <LoadingPoring fullscreen={true} text="Loading Articles..." />}
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-purple-5">
          Article management
        </h2>
        <Link
          to="/admin/create-post"
          className="w-full sm:w-auto text-center bg-gradient-to-r from-purple-6 to-purple-5 text-white hover:from-purple-7 hover:to-purple-6 hover:scale-105 rounded-full px-6 py-2.5 font-bold transition-all shadow-md whitespace-nowrap"
        >
          + Create article
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 md:gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border-2 border-purple-3 bg-light-1 px-4 py-2.5 pl-11 focus:outline-none focus:border-purple-5 transition-colors gray-10 font-medium placeholder:gray-6"
          />
          <svg className="w-5 h-5 absolute left-3 top-3 text-purple-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="All Status"
          size="md"
          options={[
            { value: '', label: 'All Status' },
            { value: 'published', label: 'Published' },
            { value: 'draft', label: 'Draft' }
          ]}
        />

        <Select
          value={categoryFilter}
          onChange={setCategoryFilter}
          placeholder="All Categories"
          size="md"
          options={[
            { value: '', label: 'All Categories' },
            ...categories.map(cat => ({ value: cat, label: cat }))
          ]}
        />
      </div>

      {/* Desktop Table - hidden on mobile */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border-2 border-purple-3 bg-light-1 shadow-xl">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-purple-1 to-emerald-1/30 border-b-2 border-purple-3">
            <tr className="text-left text-sm">
              <th className="px-6 py-4 font-bold gray-10">Article title</th>
              <th className="px-6 py-4 font-bold gray-10">Category</th>
              <th className="px-6 py-4 font-bold gray-10">Status</th>
              <th className="px-6 py-4 font-bold gray-10"></th>
            </tr>
          </thead>
          <tbody>
            {!loading && posts.length === 0 ? (
              <tr>
                <td className="px-6 py-16 text-center" colSpan={4}>
                  <div className="text-5xl mb-3">📝</div>
                  <div className="font-bold gray-10 mb-2">No posts found</div>
                  <div className="text-sm gray-7 font-medium">
                    Create your first article to get started.
                  </div>
                </td>
              </tr>
            ) : !loading ? (
              posts.map((p) => (
                <tr key={p.id} className="border-b border-purple-2 hover:bg-purple-1/30 transition-colors">
                  <td className="px-6 py-4 font-bold gray-10">
                    {p.title?.trim() || 'Untitled Post'}
                  </td>
                  <td className="px-6 py-4">
                    {p.category ? (
                      <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${getCategoryColor(p.category)}`}>
                        {p.category}
                      </span>
                    ) : (
                      <span className="gray-6 font-medium">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm " +
                        (p.status === "published"
                          ? "bg-emerald-5 text-white"
                          : "bg-gradient-to-r from-gray-4 to-gray-5 gray-9")
                      }
                    >
                      <span className={
                        "w-2 h-2 rounded-full " +
                        (p.status === "published" ? "bg-white animate-pulse" : "bg-gray-7")
                      }></span>
                      {p.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        to={`/admin/posts/${p.id}`}
                        className="p-2 hover:bg-purple-2 rounded-lg transition-colors group"
                        title="Edit"
                      >
                        <svg className="w-5 h-5 gray-7 group-hover:text-purple-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => askDelete(p.id)}
                        className="p-2 hover:bg-pink-1 rounded-lg transition-colors group"
                        title="Delete"
                      >
                        <svg className="w-5 h-5 gray-7 group-hover:text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout - shown on mobile only */}
      <div className="md:hidden space-y-3">
        {!loading && posts.length === 0 ? (
          <div className="text-center py-16 bg-light-1 rounded-2xl border-2 border-purple-3">
            <div className="text-5xl mb-3">📝</div>
            <div className="font-bold gray-10 mb-2">No posts found</div>
            <div className="text-sm gray-7 font-medium">
              Create your first article to get started.
            </div>
          </div>
        ) : !loading ? (
          posts.map((p) => (
            <div 
              key={p.id} 
              className="bg-light-1 rounded-xl border-2 border-purple-3 p-4 shadow-md hover:shadow-lg hover:border-purple-4 transition-all"
            >
              {/* Header: Title + Status */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-bold gray-10 text-base flex-1 line-clamp-2">
                  {p.title?.trim() || 'Untitled Post'}
                </h3>
                <span
                  className={
                    "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold shadow-sm whitespace-nowrap " +
                    (p.status === "published"
                      ? "bg-gradient-to-r from-emerald-5 to-emerald-6 text-white"
                      : "bg-gradient-to-r from-gray-4 to-gray-5 gray-9")
                  }
                >
                  <span className={
                    "w-1.5 h-1.5 rounded-full " +
                    (p.status === "published" ? "bg-white animate-pulse" : "bg-gray-7")
                  }></span>
                  {p.status === "published" ? "Published" : "Draft"}
                </span>
              </div>

              {/* Category */}
              <div className="mb-4">
                {p.category ? (
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${getCategoryColor(p.category)}`}>
                    {p.category}
                  </span>
                ) : (
                  <span className="gray-6 font-medium text-sm">No category</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-purple-2">
                <Link
                  to={`/admin/posts/${p.id}`}
                  className="flex-1"
                >
                  <Button
                    variant="primary"
                    size="md"
                    icon={<Edit />}
                    className="w-full"
                  >
                    Edit
                  </Button>
                </Link>
                <IconButton
                  onClick={() => askDelete(p.id)}
                  icon={<Trash2 />}
                  variant="danger"
                  size="md"
                  tooltip="Delete post"
                />
              </div>
            </div>
          ))
        ) : null}
      </div>

      <DeleteConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
      </div>
    </ErrorBoundary>
  );
}