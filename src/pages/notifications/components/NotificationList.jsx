/**
 * Notification List Component
 * List container for notifications with empty states
 */

import NotificationItem from './NotificationItem';
import LoadingPoring from '@/components/loading/LoadingPoring';
import Button from '@/components/ui/Button';

const NotificationList = ({
  notifications = [],
  loading = false,
  error = null,
  onMarkAsRead,
  onRemove
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="scale-150">
          <LoadingPoring fullscreen={false} text="Loading notifications..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-red-1 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-9 mb-2">Failed to load notifications</h3>
        <p className="text-gray-6 mb-4">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="primary"
          size="md"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-1 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gray-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-9 mb-2">No notifications yet</h3>
        <p className="text-gray-6">You're all caught up! New notifications will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-1 overflow-hidden">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default NotificationList;
