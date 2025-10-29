/**
 * Post Performance Component
 * Displays post-related statistics and performance metrics
 */

import { 
  FileText, 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye,
  TrendingUp,
  Calendar,
  Award,
  BarChart3
} from 'lucide-react';
import Button from '@/components/ui/Button';

const PostPerformance = ({ data, loading, onRefresh }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-6"></div>
      </div>
    );
  }

  // Use real data from API or fallback to empty data
  const stats = data || {
    totalPosts: 0,
    postsToday: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    totalViews: 0,
    avgEngagement: 0,
    topPosts: [],
    postCategories: []
  };

  // Debug logging

  // Use only real data from API
  const displayTopPosts = stats.topPosts || [];
  const displayPostCategories = stats.postCategories || [];

  const postStats = [
    {
      title: 'Total Posts',
      value: stats.totalPosts?.toLocaleString() || '0',
      icon: FileText,
      color: 'from-blue-5 to-blue-7',
      bgColor: 'bg-blue-1',
      textColor: 'text-blue-7',
      change: `+${stats.postsToday || 0} today`
    },
    {
      title: 'Total Views',
      value: stats.totalViews?.toLocaleString() || '0',
      icon: Eye,
      color: 'from-emerald-5 to-emerald-7',
      bgColor: 'bg-emerald-1',
      textColor: 'text-emerald-7',
      change: '+15.2% this week'
    },
    {
      title: 'Total Likes',
      value: stats.totalLikes?.toLocaleString() || '0',
      icon: Heart,
      color: 'from-red-5 to-red-7',
      bgColor: 'bg-red-1',
      textColor: 'text-red-7',
      change: '+8.3% this week'
    },
    {
      title: 'Total Comments',
      value: stats.totalComments?.toLocaleString() || '0',
      icon: MessageCircle,
      color: 'from-purple-5 to-purple-7',
      bgColor: 'bg-purple-1',
      textColor: 'text-purple-7',
      change: '+12.1% this week'
    },
    {
      title: 'Total Shares',
      value: stats.totalShares?.toLocaleString() || '0',
      icon: Share2,
      color: 'from-orange-5 to-orange-7',
      bgColor: 'bg-orange-1',
      textColor: 'text-orange-7',
      change: '+6.7% this week'
    },
    {
      title: 'Avg. Engagement',
      value: `${stats.avgEngagement || 0}%`,
      icon: TrendingUp,
      color: 'from-emerald-5 to-emerald-7',
      bgColor: 'bg-emerald-1',
      textColor: 'text-emerald-7',
      change: '+2.1% this month'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark-1 mb-2">Post Performance</h2>
          <p className="text-gray-6">Content statistics and engagement metrics</p>
        </div>
        <Button
          onClick={onRefresh}
          variant="primary"
          size="md"
          icon={<BarChart3 className="w-4 h-4" />}
        >
          Refresh Data
        </Button>
      </div>

      {/* Post Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {postStats.map((stat, index) => {
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

      {/* Top Performing Posts */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1">
        <h3 className="text-lg font-bold text-dark-1 mb-4">Top Performing Posts</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-2">
                <th className="text-left py-3 px-4 font-semibold text-gray-7">Post Title</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-7">Views</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-7">Likes</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-7">Comments</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-7">Shares</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-7">Engagement</th>
              </tr>
            </thead>
            <tbody>
              {displayTopPosts.length > 0 ? (
                displayTopPosts.map((post, index) => {
                  const engagement = ((post.likes + post.comments + post.shares) / post.views * 100).toFixed(1);
                  return (
                    <tr key={index} className="border-b border-gray-1 hover:bg-gray-0.5">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-5 to-purple-6 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                            {index + 1}
                          </div>
                          <span className="font-medium text-dark-1 max-w-xs truncate">{post.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-7">{post.views.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-7">{post.likes.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-7">{post.comments.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-7">{post.shares.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-1 text-emerald-7 rounded-full text-xs font-medium">
                          {engagement}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 px-4 text-center text-gray-6">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-8 h-8 text-gray-4" />
                      <span>No post data available from API</span>
                      <span className="text-sm text-gray-5">Check if Statistics APIs are working</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post Categories Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1">
          <h3 className="text-lg font-bold text-dark-1 mb-4">Posts by Category</h3>
          <div className="space-y-4">
            {displayPostCategories?.map((category, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-7">{category.category}</span>
                  <span className="font-semibold text-dark-1">
                    {category.count.toLocaleString()} ({category.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-2 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-purple-5 to-purple-6"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1">
          <h3 className="text-lg font-bold text-dark-1 mb-4">Engagement Trends</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-7">Average likes per post</span>
              <span className="font-semibold text-red-6">4.6</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-7">Average comments per post</span>
              <span className="font-semibold text-purple-6">0.9</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-7">Average shares per post</span>
              <span className="font-semibold text-orange-6">0.3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-7">Average views per post</span>
              <span className="font-semibold text-blue-6">13.4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1 text-center">
          <div className="w-16 h-16 bg-blue-1 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-blue-7" />
          </div>
          <h4 className="font-bold text-dark-1 mb-2">Best Performing Day</h4>
          <p className="text-3xl font-bold text-blue-7 mb-1">Tuesday</p>
          <p className="text-sm text-gray-6">Highest engagement</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1 text-center">
          <div className="w-16 h-16 bg-emerald-1 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-emerald-7" />
          </div>
          <h4 className="font-bold text-dark-1 mb-2">Peak Hour</h4>
          <p className="text-3xl font-bold text-emerald-7 mb-1">2-4 PM</p>
          <p className="text-sm text-gray-6">Most active time</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1 text-center">
          <div className="w-16 h-16 bg-purple-1 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-purple-7" />
          </div>
          <h4 className="font-bold text-dark-1 mb-2">Posts Today</h4>
          <p className="text-3xl font-bold text-purple-7 mb-1">{stats.postsToday || 0}</p>
          <p className="text-sm text-gray-6">New content</p>
        </div>
      </div>
    </div>
  );
};

export default PostPerformance;
