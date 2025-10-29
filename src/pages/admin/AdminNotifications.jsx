import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/services/api.js';
import LoadingPoring from '@/components/loading/LoadingPoring';

export default function AdminNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingNotification, setViewingNotification] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/notifications');
      setNotifications(data.notifications || []);
// เพิ่ม delay เพื่อให้ดู Poring animation นานขึ้น
await new Promise(resolve => setTimeout(resolve, 800));
    } catch (error) {
      if (error.response?.status === 404) {
        setNotifications([]);
      } else {
        setNotifications([]);
      }
// เพิ่ม delay แม้มี error
await new Promise(resolve => setTimeout(resolve, 800));
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      // Update local state instead of reloading
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
    }
  };

  const handleViewNotification = async (notification) => {
    setViewingNotification(notification.id);
    try {
      // Mark as read first
      if (!notification.read) {
        await markAsRead(notification.id);
      }
      
      // Navigate to the post
      if (notification.post?.id) {
        navigate(`/post/${notification.post.id}`);
      } else if (notification.post?.slug) {
        navigate(`/post/${notification.post.slug}`);
      } else {
        toast.error('Cannot navigate to this notification');
      }
    } catch (error) {
      toast.error('Failed to navigate to notification');
    } finally {
      setViewingNotification(null);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

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
      default:
        return '🔔';
    }
  };

  const getNotificationMessage = (notification) => {
    // Extract user info from notification
    const userData = notification.fromUser || 
                     notification.follower || 
                     notification.user ||
                     notification.actor;
    
    const userName = userData?.name || 
                     userData?.username || 
                     userData?.displayName ||
                     'Someone';
    
    // Handle different notification types
    switch (notification.type) {
      case 'follow':
        return `${userName} started following you`;
      
      case 'like':
        const postTitle = notification.post?.title || 'your post';
        return `${userName} liked ${postTitle}`;
      
      case 'comment':
      case 'new_comment':
        const postTitle2 = notification.post?.title || 'your post';
        return `${userName} commented on ${postTitle2}`;
      
      case 'new_article':
        const articleTitle = notification.post?.title || notification.article?.title || 'a new article';
        return `${userName} published ${articleTitle}`;
      
      default:
        return notification.message || 'New notification';
    }
  };

  return (
    <div className="space-y-6">
    {/* Loading Overlay */}
    {loading && <LoadingPoring fullscreen={true} text="Loading Notifications..." />}
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-7 via-purple-6 to-purple-5 bg-clip-text text-transparent">
        Notification
      </h2>

      <div className="rounded-2xl border-2 border-purple-3 bg-light-1 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16">
                <LoadingPoring text="" imgSrc="/images/loading/coderoar-loading.png" />
              </div>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-4">🔔</div>
            <p className="text-lg font-bold gray-10 mb-2">No notifications</p>
            <p className="text-sm gray-7 font-medium">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-6 border-b border-purple-2 hover:bg-purple-1/30 transition-colors ${!notif.read ? 'bg-gradient-to-r from-emerald-1/20 to-purple-1/30' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={notif.fromUser?.avatar || '/images/avatar/avartar-default.png'}
                    alt={notif.fromUser?.name || 'User'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-3"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/avatar/avartar-default.png';
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-purple-5 to-purple-6 rounded-full flex items-center justify-center text-xs shadow-md">
                    {getNotificationIcon(notif.type)}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm gray-8 font-medium">
                    {getNotificationMessage(notif)}
                  </p>
                  <p className="mt-2 text-xs text-emerald-6 font-semibold">
                    {getTimeAgo(notif.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => handleViewNotification(notif)}
                  disabled={viewingNotification === notif.id}
                  className="text-sm font-bold gray-8 hover:text-purple-7 transition-colors px-4 py-2 rounded-full hover:bg-purple-2 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-purple-3 hover:border-purple-5 shadow-sm"
                >
                  {viewingNotification === notif.id ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4">
                        <LoadingPoring text="" imgSrc="/images/loading/coderoar-loading.png" />
                      </div>
                      Loading...
                    </div>
                  ) : 'View'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}