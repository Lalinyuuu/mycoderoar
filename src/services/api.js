// Import centralized API client
import apiClient from '../api/index.js';

// Use centralized API client
const api = apiClient;

export async function adminListPosts(opts = {}) {
  const {
    page = 1,
    limit = 20,
    status,        // 'draft' | 'published' (optional)
    category,      // string (optional)
    q,             // search keyword (optional; ถ้ายังไม่รองรับใน backend ก็ไม่ต้องส่ง)
  } = opts;

  const params = new URLSearchParams({ page, limit });
  if (status) params.append("status", status);
  if (category) params.append("category", category);
  if (q) params.append("q", q);

  const { data } = await api.get(`/api/admin/posts?${params.toString()}`);
  return data; // { posts, pagination: { page, limit, total, totalPages } }
}

export default api;