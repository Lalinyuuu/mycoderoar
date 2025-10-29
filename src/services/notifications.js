import api from './api.js';
import { preUploadCheck } from '../utils/connectionUtils';
import { reportError, addBreadcrumb } from '../utils/sentry';

// Get user notifications with pagination
export const fetchNotifications = async (params = {}, retryCount = 0) => {
  const { page = 1, limit = 20, type } = params;
  
  const queryParams = new URLSearchParams({ page, limit });
  if (type) queryParams.append('type', type);
  
  
  try {
    // Pre-check connection for first attempt only
    if (retryCount === 0) {
      const connectionCheck = await preUploadCheck(import.meta.env.VITE_API_BASE_URL || 'https://blog-api-tau-sand.vercel.app');
      
      if (!connectionCheck.shouldProceed) {
        throw new Error('Connection check failed - Backend server is not responding');
      }
    }
    
    const response = await api.get(`/api/notifications?${queryParams.toString()}`, {
      timeout: 30000
    });
    
    return response.data;
  } catch (error) {
    
    // Add breadcrumb for debugging
    addBreadcrumb('Notification API Error', 'api', 'error');
    
    // Report to Sentry
    reportError(error, {
      api: 'notifications',
      endpoint: '/api/notifications',
      params,
      retryCount
    });
    
    // Retry once for timeout errors
    if (error.code === 'ECONNABORTED' && retryCount === 0) {
      addBreadcrumb('Notification API Retry', 'api', 'info');
      return fetchNotifications(params, 1);
    }
    
    throw error;
  }
};

// Mark a single notification as read
export const markNotificationAsRead = async (notificationId) => {
  const response = await api.put(`/api/notifications/${notificationId}/read`);
  return response.data;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  const response = await api.put('/api/notifications/read-all');
  return response.data;
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/api/notifications/${notificationId}`);
  return response.data;
};

// Get notification count (for bell badge)
export const getNotificationCount = async () => {
  try {
    // Quick connection check
    const connectionCheck = await preUploadCheck(import.meta.env.VITE_API_BASE_URL || 'https://blog-api-tau-sand.vercel.app');
    
    if (!connectionCheck.shouldProceed) {
      return 0;
    }
    
    const response = await api.get('/api/notifications?limit=1', {
      timeout: 15000 // Shorter timeout for count
    });
    return response.data.unreadCount || 0;
  } catch (error) {
    return 0; // Return 0 on error to prevent UI issues
  }
};
