/**
 * User Analytics Component
 * Displays user-related statistics and analytics
 */

import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  TrendingUp,
  Calendar,
  Activity,
  Award
} from 'lucide-react';
import Button from '@/components/ui/Button';

const UserAnalytics = ({ data, loading, onRefresh }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-6"></div>
      </div>
    );
  }

  // Use real data from API or fallback to sample data
  const stats = data || {
    totalUsers: 0,
    newUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    userGrowth: [],
    topUsers: []
  };

  // Use real data from API or generate sample data for display
  const displayTopUsers = stats.topUsers || [];
  
  // If no top users data, show a message but don't show error
  const hasTopUsersData = displayTopUsers.length > 0;

  const userStats = [
    {
      title: 'Total Users',
      value: stats.totalUsers?.toLocaleString() || '0',
      icon: Users,
      color: 'from-blue-5 to-blue-7',
      bgColor: 'bg-blue-1',
      textColor: 'text-blue-7',
      change: `+${stats.newUsers || 0} this month`
    },
    {
      title: 'Active Users',
      value: stats.activeUsers?.toLocaleString() || '0',
      icon: UserCheck,
      color: 'from-emerald-5 to-emerald-7',
      bgColor: 'bg-emerald-1',
      textColor: 'text-emerald-7',
      change: 'Online now'
    },
    {
      title: 'New Users',
      value: stats.newUsers?.toLocaleString() || '0',
      icon: UserPlus,
      color: 'from-purple-5 to-purple-7',
      bgColor: 'bg-purple-1',
      textColor: 'text-purple-7',
      change: 'This month'
    },
    {
      title: 'Inactive Users',
      value: stats.inactiveUsers?.toLocaleString() || '0',
      icon: UserX,
      color: 'from-red-5 to-red-7',
      bgColor: 'bg-red-1',
      textColor: 'text-red-7',
      change: 'Need attention'
    }
  ];

  const userTypes = [
    { type: 'Regular Users', count: stats.regularUsers || 0, percentage: 99.6, color: 'bg-blue-5' },
    { type: 'Admin Users', count: stats.adminUsers || 0, percentage: 0.4, color: 'bg-purple-5' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark-1 mb-2">User Analytics</h2>
          <p className="text-gray-6">User statistics and behavior insights</p>
        </div>
        <Button
          onClick={onRefresh}
          variant="primary"
          size="md"
          icon={<Activity className="w-4 h-4" />}
        >
          Refresh Data
        </Button>
      </div>

      {/* User Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-6">{stat.change}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-6 mb-1">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1">
          <h3 className="text-lg font-bold text-dark-1 mb-4">User Distribution</h3>
          <div className="space-y-4">
            {userTypes.map((userType, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-7">{userType.type}</span>
                  <span className="font-semibold text-dark-1">
                    {userType.count.toLocaleString()} ({userType.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-2 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${userType.color}`}
                    style={{ width: `${userType.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1">
          <h3 className="text-lg font-bold text-dark-1 mb-4">User Growth Trend</h3>
          <div className="space-y-3">
            {stats.userGrowth?.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-7">{month.month}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-2 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-5 to-purple-6 h-2 rounded-full"
                      style={{ width: `${(month.users / 1300) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-dark-1 w-16 text-right">
                    {month.users.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Users */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1">
        <h3 className="text-lg font-bold text-dark-1 mb-4">Top Active Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-2">
                <th className="text-left py-3 px-4 font-semibold text-gray-7">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-7">Posts</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-7">Likes</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-7">Followers</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-7">Activity</th>
              </tr>
            </thead>
            <tbody>
              {displayTopUsers.length > 0 ? (
                displayTopUsers.map((user, index) => (
                  <tr key={index} className="border-b border-gray-1 hover:bg-gray-0.5">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-5 to-purple-6 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-medium text-dark-1">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-7">{user.posts}</td>
                    <td className="py-3 px-4 text-gray-7">{user.likes.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-7">{user.followers.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-1 text-green-7 rounded-full text-xs font-medium">
                        <Activity className="w-3 h-3" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 px-4 text-center text-gray-6">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-8 h-8 text-gray-4" />
                      <span>No user data available from API</span>
                      <span className="text-sm text-gray-5">Check if Statistics APIs are working</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1 text-center">
          <div className="w-16 h-16 bg-blue-1 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-blue-7" />
          </div>
          <h4 className="font-bold text-dark-1 mb-2">Avg. Session Time</h4>
          <p className="text-3xl font-bold text-blue-7 mb-1">4m 32s</p>
          <p className="text-sm text-gray-6">+12% from last month</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1 text-center">
          <div className="w-16 h-16 bg-green-1 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-green-7" />
          </div>
          <h4 className="font-bold text-dark-1 mb-2">Retention Rate</h4>
          <p className="text-3xl font-bold text-green-7 mb-1">78%</p>
          <p className="text-sm text-gray-6">7-day retention</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1 text-center">
          <div className="w-16 h-16 bg-purple-1 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-purple-7" />
          </div>
          <h4 className="font-bold text-dark-1 mb-2">Daily Active</h4>
          <p className="text-3xl font-bold text-purple-7 mb-1">456</p>
          <p className="text-sm text-gray-6">Users today</p>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;
