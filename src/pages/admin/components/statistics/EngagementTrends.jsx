/**
 * Engagement Trends Component
 * Displays engagement trends and analytics over time
 */

import { 
  TrendingUp, 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye,
  Activity,
  BarChart3,
  Calendar
} from 'lucide-react';
import Button from '@/components/ui/Button';

const EngagementTrends = ({ data, loading, onRefresh }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-6"></div>
      </div>
    );
  }

  // Use real data from API or fallback to empty data
  const stats = data || {
    dailyEngagement: [],
    weeklyTrends: [],
    engagementRate: 0,
    avgSessionTime: '0m 0s',
    bounceRate: 0,
    returnVisitors: 0
  };

  const engagementMetrics = [
    {
      title: 'Engagement Rate',
      value: `${stats.engagementRate || 0}%`,
      icon: TrendingUp,
      color: 'from-emerald-5 to-emerald-7',
      bgColor: 'bg-emerald-1',
      textColor: 'text-emerald-7',
      change: '+2.1% this week'
    },
    {
      title: 'Avg. Session Time',
      value: stats.avgSessionTime || '0m 0s',
      icon: Activity,
      color: 'from-blue-5 to-blue-7',
      bgColor: 'bg-blue-1',
      textColor: 'text-blue-7',
      change: '+12% this month'
    },
    {
      title: 'Bounce Rate',
      value: `${stats.bounceRate || 0}%`,
      icon: BarChart3,
      color: 'from-red-5 to-red-7',
      bgColor: 'bg-red-1',
      textColor: 'text-red-7',
      change: '-3.2% this week'
    },
    {
      title: 'Return Visitors',
      value: `${stats.returnVisitors || 0}%`,
      icon: Calendar,
      color: 'from-purple-5 to-purple-7',
      bgColor: 'bg-purple-1',
      textColor: 'text-purple-7',
      change: '+5.4% this month'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark-1 mb-2">Engagement Trends</h2>
          <p className="text-gray-6">User interaction patterns and engagement analytics</p>
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

      {/* Engagement Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {engagementMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${metric.textColor}`} />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-6">{metric.change}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-6 mb-1">{metric.title}</p>
                <p className={`text-3xl font-bold ${metric.textColor}`}>{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Engagement Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1">
        <h3 className="text-lg font-bold text-dark-1 mb-4">Daily Engagement (Last 7 Days)</h3>
        <div className="space-y-4">
          {stats.dailyEngagement?.map((day, index) => {
            const totalEngagement = day.likes + day.comments + day.shares;
            const maxEngagement = Math.max(...stats.dailyEngagement.map(d => d.likes + d.comments + d.shares));
            const percentage = (totalEngagement / maxEngagement) * 100;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-7 font-medium">{day.day}</span>
                  <span className="text-dark-1 font-semibold">{totalEngagement} interactions</span>
                </div>
                <div className="w-full bg-gray-2 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-purple-5 to-purple-6"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-6">
                  <span>👁️ {day.views.toLocaleString()} views</span>
                  <span>❤️ {day.likes.toLocaleString()}</span>
                  <span>💬 {day.comments.toLocaleString()}</span>
                  <span>📤 {day.shares.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1">
          <h3 className="text-lg font-bold text-dark-1 mb-4">Weekly Engagement Trends</h3>
          <div className="space-y-4">
            {stats.weeklyTrends?.map((week, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-7 font-medium">{week.week}</span>
                  <span className="text-dark-1 font-semibold">{week.engagement}% engagement</span>
                </div>
                <div className="w-full bg-gray-2 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-5 to-emerald-6"
                    style={{ width: `${(week.engagement / 20) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-6">
                  <span>📝 {week.posts} posts</span>
                  <span>👥 {week.users} users</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1">
          <h3 className="text-lg font-bold text-dark-1 mb-4">Engagement Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-6" />
                <span className="text-gray-7">Likes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-2 rounded-full h-2">
                  <div className="h-2 rounded-full bg-red-5" style={{ width: '65%' }}></div>
                </div>
                <span className="font-semibold text-dark-1">65%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-purple-6" />
                <span className="text-gray-7">Comments</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-2 rounded-full h-2">
                  <div className="h-2 rounded-full bg-purple-5" style={{ width: '25%' }}></div>
                </div>
                <span className="font-semibold text-dark-1">25%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-orange-6" />
                <span className="text-gray-7">Shares</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-2 rounded-full h-2">
                  <div className="h-2 rounded-full bg-orange-5" style={{ width: '10%' }}></div>
                </div>
                <span className="font-semibold text-dark-1">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Peak Activity Times */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1">
        <h3 className="text-lg font-bold text-dark-1 mb-4">Peak Activity Times</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-1 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-8 h-8 text-blue-7" />
            </div>
            <h4 className="font-bold text-dark-1 mb-1">Most Active Day</h4>
            <p className="text-2xl font-bold text-blue-7 mb-1">Tuesday</p>
            <p className="text-sm text-gray-6">Highest engagement</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-1 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-8 h-8 text-emerald-7" />
            </div>
            <h4 className="font-bold text-dark-1 mb-1">Peak Hour</h4>
            <p className="text-2xl font-bold text-emerald-7 mb-1">2-4 PM</p>
            <p className="text-sm text-gray-6">Most interactions</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-1 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-purple-7" />
            </div>
            <h4 className="font-bold text-dark-1 mb-1">Growth Rate</h4>
            <p className="text-2xl font-bold text-purple-7 mb-1">+8.3%</p>
            <p className="text-sm text-gray-6">Monthly growth</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementTrends;
