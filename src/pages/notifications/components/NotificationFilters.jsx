/**
 * Notification Filters Component
 * Filter and action controls for notifications
 */

import { 
  Filter,
  Trash2,
  CheckCheck,
  RefreshCw
} from 'lucide-react';
import Button from '@/components/ui/Button';

const NotificationFilters = ({
  filter,
  setFilter,
  unreadCount,
  onMarkAllAsRead,
  onRefresh,
  onClearAll,
  filterOptions = []
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-5 to-blue-7 rounded-xl flex items-center justify-center">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-9">Notifications</h2>
            <p className="text-sm text-gray-6">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              onClick={onMarkAllAsRead}
              variant="primary"
              size="md"
              icon={<CheckCheck className="w-4 h-4" />}
            >
              Mark All Read
            </Button>
          )}
          
          <Button
            onClick={onRefresh}
            variant="secondary"
            size="md"
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-1 rounded-xl p-1">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              filter === option.value
                ? 'bg-white text-blue-7 shadow-sm'
                : 'text-gray-6 hover:text-gray-8 hover:bg-gray-0.5'
            }`}
          >
            {option.label}
            {option.count !== null && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                filter === option.value
                  ? 'bg-blue-1 text-blue-7'
                  : 'bg-gray-2 text-gray-6'
              }`}>
                {option.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Clear all button */}
      <div className="mt-4 pt-4 border-t border-gray-1">
        <Button
          onClick={onClearAll}
          variant="outline"
          size="md"
          icon={<Trash2 className="w-4 h-4" />}
          className="text-red-6 border-red-3 hover:bg-red-1 hover:text-red-7 hover:border-red-4"
        >
          Clear All Notifications
        </Button>
      </div>
    </div>
  );
};

export default NotificationFilters;
