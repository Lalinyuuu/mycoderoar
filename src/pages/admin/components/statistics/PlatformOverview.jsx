/**
 * Platform Overview Component
 * Displays overall platform statistics and key metrics
 */

import { 
  Users, 
  FileText, 
  Heart, 
  MessageCircle, 
  Share2, 
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react';
import Button from '@/components/ui/Button';

const PlatformOverview = ({ data, loading, onRefresh }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-6"></div>
      </div>
    );
  }

  // Use real data from API or fallback to mock data
  const stats = data || {
    totalUsers: 0,
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    activeUsers: 0,
    newUsersToday: 0,
    postsToday: 0,
    engagementRate: 0,
    growthRate: 0
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers?.toLocaleString() || '0',
      icon: Users,
      color: 'from-blue-5 to-blue-7',
      bgColor: 'bg-blue-1',
      textColor: 'text-blue-7',
      change: `+${stats.newUsersToday || 0} today`
    },
    {
      title: 'Total Posts',
      value: stats.totalPosts?.toLocaleString() || '0',
      icon: FileText,
      color: 'from-emerald-5 to-emerald-7',
      bgColor: 'bg-emerald-1',
      textColor: 'text-emerald-7',
      change: `+${stats.postsToday || 0} today`
    },
    {
      title: 'Total Likes',
      value: stats.totalLikes?.toLocaleString() || '0',
      icon: Heart,
      color: 'from-red-5 to-red-7',
      bgColor: 'bg-red-1',
      textColor: 'text-red-7',
      change: '+12.5% this week'
    },
    {
      title: 'Total Comments',
      value: stats.totalComments?.toLocaleString() || '0',
      icon: MessageCircle,
      color: 'from-purple-5 to-purple-7',
      bgColor: 'bg-purple-1',
      textColor: 'text-purple-7',
      change: '+8.3% this week'
    },
    {
      title: 'Total Shares',
      value: stats.totalShares?.toLocaleString() || '0',
      icon: Share2,
      color: 'from-orange-5 to-orange-7',
      bgColor: 'bg-orange-1',
      textColor: 'text-orange-7',
      change: '+15.2% this week'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers?.toLocaleString() || '0',
      icon: Activity,
      color: 'from-emerald-5 to-emerald-7',
      bgColor: 'bg-emerald-1',
      textColor: 'text-emerald-7',
      change: 'Online now'
    }
  ];

  const keyMetrics = [
    {
      title: 'Engagement Rate',
      value: `${stats.engagementRate || 0}%`,
      description: 'Average engagement per post',
      trend: '+2.1%',
      trendUp: true
    },
    {
      title: 'Growth Rate',
      value: `${stats.growthRate || 0}%`,
      description: 'Monthly user growth',
      trend: '+0.8%',
      trendUp: true
    },
    {
      title: 'Posts per Day',
      value: '45',
      description: 'Average daily posts',
      trend: '+5.2%',
      trendUp: true
    },
    {
      title: 'User Retention',
      value: '78%',
      description: '7-day retention rate',
      trend: '+3.1%',
      trendUp: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark-1 mb-2">Platform Overview</h2>
          <p className="text-gray-6">Key metrics and performance indicators</p>
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

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
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

      {/* Key Metrics */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1">
        <h3 className="text-xl font-bold text-dark-1 mb-6">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyMetrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-3xl font-bold text-dark-1">{metric.value}</span>
                <span className={`ml-2 text-sm font-medium ${
                  metric.trendUp ? 'text-emerald-6' : 'text-red-6'
                }`}>
                  {metric.trend}
                </span>
              </div>
              <h4 className="font-semibold text-dark-1 mb-1">{metric.title}</h4>
              <p className="text-sm text-gray-6">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1">
          <h3 className="text-lg font-bold text-dark-1 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-7">New users today</span>
              <span className="font-semibold text-emerald-6">+{stats.newUsersToday || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-7">Posts created today</span>
              <span className="font-semibold text-blue-6">+{stats.postsToday || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-7">Likes received today</span>
              <span className="font-semibold text-red-6">+1,234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-7">Comments posted today</span>
              <span className="font-semibold text-purple-6">+567</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1">
          <h3 className="text-lg font-bold text-dark-1 mb-4">Platform Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-7">Server Uptime</span>
                <span className="font-semibold text-emerald-6">99.9%</span>
              </div>
              <div className="w-full bg-gray-2 rounded-full h-2">
                <div className="bg-emerald-5 h-2 rounded-full" style={{ width: '99.9%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-7">Response Time</span>
                <span className="font-semibold text-blue-6">120ms</span>
              </div>
              <div className="w-full bg-gray-2 rounded-full h-2">
                <div className="bg-blue-5 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-7">Error Rate</span>
                <span className="font-semibold text-red-6">0.1%</span>
              </div>
              <div className="w-full bg-gray-2 rounded-full h-2">
                <div className="bg-red-5 h-2 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformOverview;
