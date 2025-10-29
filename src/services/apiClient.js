/**
 * Centralized API Client
 * Single source of truth for all API communications
 */

import axios from 'axios';

// Base configuration
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:3000';


// Create centralized axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    'Content-Type': 'application/json' 
  },
  timeout: 60000, // Increased to 60 seconds for uploads
});

// Request interceptor - Add JWT token automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        ...error,
        message: 'Network error. Please check your connection.',
        isNetworkError: true
      });
    }

    // Handle other HTTP errors
    const status = error.response.status;
    const message = error.response.data?.message || error.message;
    
    return Promise.reject({
      ...error,
      message,
      status,
      isApiError: true
    });
  }
);

export default apiClient;
