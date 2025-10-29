import api from "./api.js";

// Public Posts API
export async function getPosts({ page = 1, limit = 12, keyword, category } = {}) {
  const params = { page, limit, status: 'published' }; // Only show published posts
  if (keyword) {
    params.keyword = keyword;
    params.search = keyword; // Try both parameter names
  }
  if (category && category !== 'All') {
    params.category = category;
  }
  const { data } = await api.get(`/api/posts`, { params });
  return data;
}

export async function getPostById(id) {
  try {
    const response = await api.get(`/api/posts/${id}`);
    return response.data.post || response.data;
  } catch (error) {
    throw error;
  }
}

export async function getPostBySlug(slug) {
  try {
    const { data } = await api.get(`/api/posts/slug/${slug}`);
    return data;
  } catch (error) {
    throw error;
  }
}

// Public Categories API
export async function getCategories(params = {}) {
  const { data } = await api.get("/api/categories", { params });
  return data;
}

// Admin Posts API
export async function adminCreatePost(payload) {
  const { data } = await api.post(`/api/admin/posts`, payload);
  return data;
}

export async function adminListPosts(params = {}) {
  const { data } = await api.get(`/api/admin/posts`, { params });
  return data;
}

export async function adminGetPost(id) {
  const { data } = await api.get(`/api/admin/posts/${id}`);
  return data;
}

export async function adminUpdatePost(id, payload) {
  const { data } = await api.put(`/api/admin/posts/${id}`, payload);
  return data;
}

export async function adminDeletePost(id) {
  const { data } = await api.delete(`/api/admin/posts/${id}`);
  return data;
}

// Admin Categories API
export async function adminListCategories(params = {}) {
  const { data } = await api.get("/api/admin/categories", { params });
  return data;
}

export async function adminGetCategory(id) {
  const { data } = await api.get(`/api/admin/categories/${id}`);
  return data;
}

export async function adminCreateCategory(payload) {
  const { data } = await api.post("/api/admin/categories", payload);
  return data;
}

export async function adminUpdateCategory(id, payload) {
  const { data } = await api.put(`/api/admin/categories/${id}`, payload);
  return data;
}

export async function adminDeleteCategory(id) {
  const { data } = await api.delete(`/api/admin/categories/${id}`);
  return data;
}

export async function adminGetCategoryPosts(id, params = {}) {
  const { data } = await api.get(`/api/admin/categories/${id}/posts`, { params });
  return data;
}

// ===== INTERACTION FEATURES =====

// Like System
export async function likePost(postId) {
  try {
    const { data } = await api.post(`/api/posts/${postId}/like`, {});
    return data;
  } catch (error) {
    throw error;
  }
}

export async function unlikePost(postId) {
  try {
    const { data } = await api.delete(`/api/posts/${postId}/like`);
    return data;
  } catch (error) {
    throw error;
  }
}


// Comment System
export async function getPostComments(postId) {
  try {
    const { data } = await api.get(`/api/posts/${postId}/comments`);
    return data;
  } catch (error) {
    return { success: false, data: { comments: [] } };
  }
}

export async function addComment(postId, content) {
  try {
    // Try primary endpoint first
    const { data } = await api.post(`/api/posts/${postId}/comments`, { content });
    return data;
  } catch (error) {
    // Try alternative endpoint if primary fails
    try {
      const { data } = await api.post(`/api/comments/posts/${postId}/comments`, { content });
      return data;
    } catch (altError) {
      throw error; // Throw original error
    }
  }
}

export async function editComment(postId, commentId, content) {
  try {
    // Edit comment
    
    // Use the correct endpoint for editing comments/replies
    const { data } = await api.put(`/api/comments/comments/${commentId}`, { content }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteComment(postId, commentId) {
  try {
    // Delete comment
    
    // Use the correct endpoint for deleting comments/replies
    const { data } = await api.delete(`/api/comments/comments/${commentId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return data;
  } catch (error) {
    throw error;
  }
}

// Share System
export async function trackShare(postId, platform) {
  const { data } = await api.post(`/api/posts/${postId}/share`, { platform });
  return data;
}

// Stats
export async function getPostStats(postId) {
  const { data } = await api.get(`/api/posts/${postId}/stats`);
  return data;
}

// Related Posts
export async function getRelatedPosts(postId, limit = 3) {
  try {
    // Try to get related posts from API
    const { data } = await api.get(`/api/posts/${postId}/related`, { 
      params: { limit } 
    });
    return data;
  } catch (error) {
    
    // Fallback: Get current post first
    try {
      const currentPost = await getPostById(postId);
      
      // Then get posts from same category
      const params = { 
        page: 1, 
        limit: limit + 1, // Get one extra to exclude current post
        status: 'published'
      };
      
      if (currentPost.category) {
        params.category = currentPost.category;
      }
      
      const result = await getPosts(params);
      
      // Filter out current post and limit results
      const relatedPosts = (result.posts || [])
        .filter(post => post.id !== postId)
        .slice(0, limit);
      
      return {
        success: true,
        data: relatedPosts,
        posts: relatedPosts
      };
    } catch (fallbackError) {
      return {
        success: true,
        data: [],
        posts: []
      };
    }
  }
}