import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification,
  getNotificationCount 
} from '@/services/notifications';

export const useNotifications = (params = {}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const loadNotifications = useCallback(async (newParams = {}) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const mergedParams = { ...params, ...newParams };
      const data = await fetchNotifications(mergedParams);
      
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
      setPagination(data.pagination || pagination);
    } catch (err) {
      // Handle different types of errors
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout - please check your connection and try again');
      } else if (err.response?.status === 500) {
        setError('Server error - please try again later');
      } else if (err.response?.status === 401) {
        setError('Please log in to view notifications');
      } else {
        setError(err.message || 'Failed to load notifications');
      }
    } finally {
      setLoading(false);
    }
  }, [user, params.page, params.limit, params.type]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError(err.message || 'Failed to mark notification as read');
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
    } catch (err) {
      setError(err.message || 'Failed to mark all notifications as read');
    }
  }, []);

  const removeNotification = useCallback(async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      
      // Update local state
      setNotifications(prev => {
        const notification = prev.find(n => n.id === notificationId);
        const wasUnread = notification && !notification.read;
        
        if (wasUnread) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        
        return prev.filter(n => n.id !== notificationId);
      });
    } catch (err) {
      setError(err.message || 'Failed to delete notification');
    }
  }, []);

  const refreshNotifications = useCallback(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Load notifications on mount and when params change
  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user, params.page, params.limit, params.type]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    pagination,
    markAsRead,
    markAllAsRead,
    removeNotification,
    refreshNotifications,
    loadNotifications
  };
};

// Hook for just the notification count (for bell badge)
export const useNotificationCount = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadCount = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await fetchNotifications({ limit: 1 });
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCount();
  }, [loadCount]);

  return { unreadCount, loading, refreshCount: loadCount };
};
