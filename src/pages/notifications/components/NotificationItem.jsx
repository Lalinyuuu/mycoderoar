/**
 * Notification Item Component
 * Individual notification display component
 */

import { Link } from 'react-router-dom';
import { 
  Bell, 
  Check, 
  X, 
  ExternalLink 
} from 'lucide-react';

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onRemove
}) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return '👍';
      case 'comment':
      case 'new_comment':
        return '💬';
      case 'new_article':
        return '📝';
      case 'follow':
        return '👤';
      case 'mention':
        return '🔔';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'like':
        return 'text-pink-6';
      case 'comment':
      case 'new_comment':
        return 'text-blue-6';
      case 'new_article':
        return 'text-purple-6';
      case 'follow':
        return 'text-emerald-6';
      case 'mention':
        return 'text-orange-6';
      default:
        return 'text-gray-6';
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  const handleMarkAsRead = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(notification.id);
  };

  return (
    <div className={`group relative p-4 border-b border-gray-1 hover:bg-gray-0.5 transition-colors duration-200 ${
      notification.read ? 'opacity-60' : 'bg-blue-0.5'
    }`}>
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-6 rounded-full"></div>
      )}

      <div className="flex items-start gap-3 pl-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-1 flex items-center justify-center text-lg ${
          notification.read ? 'opacity-50' : ''
        }`}>
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium text-gray-9 line-clamp-2 ${
                notification.read ? 'opacity-70' : ''
              }`}>
                {notification.message}
              </p>
              
              {notification.data?.postTitle && (
                <p className="text-xs text-gray-6 mt-1 line-clamp-1">
                  "{notification.data.postTitle}"
                </p>
              )}
              
              <p className="text-xs text-gray-5 mt-1">
                {formatTimeAgo(notification.createdAt)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {!notification.read && (
                <button
                  onClick={handleMarkAsRead}
                  className="p-1 rounded-full hover:bg-blue-1 text-blue-6 hover:text-blue-7 transition-colors duration-200"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={handleRemove}
                className="p-1 rounded-full hover:bg-red-1 text-red-6 hover:text-red-7 transition-colors duration-200"
                title="Remove notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          {notification.data?.postId && (
            <div className="mt-2 flex items-center gap-2">
              <Link
                to={`/post/${notification.data.postId}`}
                className="inline-flex items-center gap-1 text-xs text-blue-6 hover:text-blue-7 font-medium transition-colors duration-200"
              >
                <ExternalLink className="w-3 h-3" />
                View Post
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
