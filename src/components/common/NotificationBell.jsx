import { useState, useEffect } from "react";
import { Bell, Check, X, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useNotifications } from "@/hooks/useNotifications.js";

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    removeNotification 
  } = useNotifications({ limit: 10 });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && !event.target.closest('.notification-dropdown')) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!user) {
    return (
      <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-purple-3 text-purple-6">
        <Bell className="h-5 w-5" />
      </button>
    );
  }

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
        return '🔔';
      default:
        return '🔔';
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationMessage = (notification) => {
    // Handle different notification types
    switch (notification.type) {
      case 'follow':
        // Extract follower info from notification
        const followerData = notification.follower || 
                           notification.fromUser || 
                           notification.user ||
                           notification.actor ||
                           notification.from;
        
        const followerName = followerData?.name || 
                           followerData?.username || 
                           followerData?.displayName ||
                           followerData?.fullName ||
                           notification.followerName ||
                           notification.fromUserName ||
                           notification.actorName ||
                           notification.fromName ||
                           'Someone';
        
        return `${followerName} started following you`;
      
      case 'like':
        const likerData = notification.liker || 
                         notification.fromUser || 
                         notification.user ||
                         notification.actor;
        
        const likerName = likerData?.name || 
                         likerData?.username || 
                         likerData?.displayName ||
                         likerData?.fullName ||
                         notification.likerName ||
                         notification.fromUserName ||
                         'Someone';
        
        const postTitle = notification.post?.title || notification.article?.title || 'your post';
        return `${likerName} liked ${postTitle}`;
      
      case 'comment':
      case 'new_comment':
        const commenterData = notification.commenter || 
                             notification.fromUser || 
                             notification.user ||
                             notification.actor;
        
        const commenterName = commenterData?.name || 
                             commenterData?.username || 
                             commenterData?.displayName ||
                             commenterData?.fullName ||
                             notification.commenterName ||
                             notification.fromUserName ||
                             'Someone';
        
        const postTitle2 = notification.post?.title || notification.article?.title || 'your post';
        return `${commenterName} commented on ${postTitle2}`;
      
      case 'new_article':
        const authorData = notification.author || 
                          notification.fromUser || 
                          notification.user ||
                          notification.actor;
        
        const authorName = authorData?.name || 
                          authorData?.username || 
                          authorData?.displayName ||
                          authorData?.fullName ||
                          notification.authorName ||
                          notification.fromUserName ||
                          'Someone';
        
        const articleTitle = notification.article?.title || notification.post?.title || 'a new article';
        return `${authorName} published ${articleTitle}`;
      
      default:
        // Fallback to message field or default
        return notification.message || 'New notification';
    }
  };

  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case 'like':
      case 'comment':
      case 'new_comment':
        // Navigate to the post
        if (notification.post?.slug) {
          return `/post/${notification.post.slug}`;
        }
        if (notification.post?.id) {
          return `/post/${notification.post.id}`;
        }
        break;
      
      case 'new_article':
        // Navigate to the new article
        if (notification.article?.slug) {
          return `/post/${notification.article.slug}`;
        }
        if (notification.article?.id) {
          return `/post/${notification.article.id}`;
        }
        break;
      
      // ไม่ให้ follow notification กดได้
      case 'follow':
      default:
        return null;
    }
    return null;
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    // Navigate to the relevant content
    const link = getNotificationLink(notification);
    if (link) {
      navigate(link);
    }
    
    setOpen(false);
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    await markAllAsRead();
  };

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    await removeNotification(notificationId);
  };

  return (
    <div className="relative notification-dropdown">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-purple-3 bg-light-1 text-purple-6 hover:bg-purple-1 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-light-1 bg-error rounded-full min-w-[18px] h-[18px] animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] rounded-xl border border-purple-2 bg-light-1 shadow-xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-purple-2">
            <h3 className="font-semibold text-dark-1">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-sm text-purple-6 hover:text-purple-7 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 sm:max-h-[28rem] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-dark-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-6 mx-auto"></div>
                <p className="mt-2 text-sm">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-dark-3">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const hasLink = getNotificationLink(notification);
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 sm:gap-4 p-4 hover:bg-purple-1 border-b border-purple-2 last:border-b-0 transition-colors ${
                      !notification.read ? 'bg-purple-1' : ''
                    } ${hasLink ? 'cursor-pointer' : 'cursor-default'}`}
                    onClick={() => hasLink && handleNotificationClick(notification)}
                  >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    <span className="text-lg">
                      {getNotificationIcon(notification.type)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-dark-1 leading-relaxed">
                      {getNotificationMessage(notification)}
                    </p>
                    <p className="text-xs text-dark-3 mt-1">
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                    
                    {/* Clickable indicator */}
                    {hasLink && (
                      <div className="mt-2">
                        <span className="text-xs text-purple-6 font-medium flex items-center gap-1">
                          Click to view
                          <ExternalLink className="h-3 w-3" />
                        </span>
                      </div>
                    )}
                    
                    {/* Post link if available */}
                    {notification.post && (
                      <div className="mt-2">
                        <Link
                          to={`/post/${notification.post.slug}`}
                          className="text-xs text-purple-6 hover:text-purple-7 font-medium flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {notification.post.title}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex items-center gap-1">
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="p-1 text-dark-3 hover:text-success transition-colors"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDeleteNotification(e, notification.id)}
                      className="p-1 text-dark-3 hover:text-error transition-colors"
                      title="Delete"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-purple-2 bg-purple-1">
              <Link
                to="/notifications"
                className="block w-full text-center text-sm text-purple-6 hover:text-purple-7 font-medium"
                onClick={() => setOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}