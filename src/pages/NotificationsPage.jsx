/**
 * Notifications Page
 * Main page component for managing user notifications
 */

import { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import NotificationFilters from './notifications/components/NotificationFilters';
import NotificationList from './notifications/components/NotificationList';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  
  const {
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
  } = useNotifications({ 
    page, 
    limit: 20, 
    type: filter === 'all' ? undefined : filter 
  });

  const filterOptions = [
    { value: 'all', label: 'All', count: null },
    { value: 'new_article', label: 'Articles', count: null },
    { value: 'comment', label: 'Comments', count: null },
    { value: 'like', label: 'Likes', count: null }
  ];

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
    }
  };

  const handleRemove = async (notificationId) => {
    try {
      await removeNotification(notificationId);
    } catch (error) {
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshNotifications();
    } catch (error) {
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
      try {
        // This would need to be implemented in the hook
      } catch (error) {
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Please sign in</h1>
          <p className="text-gray-6">You need to be signed in to view notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <NotificationFilters
          filter={filter}
          setFilter={setFilter}
          unreadCount={unreadCount}
          onMarkAllAsRead={handleMarkAllAsRead}
          onRefresh={handleRefresh}
          onClearAll={handleClearAll}
          filterOptions={filterOptions}
        />

        <NotificationList
          notifications={notifications}
          loading={loading}
          error={error}
          onMarkAsRead={handleMarkAsRead}
          onRemove={handleRemove}
        />

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white text-gray-7 rounded-xl border border-gray-2 hover:bg-gray-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-sm text-gray-6">
                Page {page} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => setPage(prev => Math.min(pagination.totalPages, prev + 1))}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 bg-white text-gray-7 rounded-xl border border-gray-2 hover:bg-gray-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}