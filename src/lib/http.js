export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const apiFetch = (path, init = {}) =>
  fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    ...init,
  });