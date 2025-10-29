/**
 * Admin Statistics Page
 * Main page component for viewing platform statistics in admin panel
 */

import { useEffect, useState, lazy, Suspense } from 'react';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { getAnalyticsDashboard } from '@/services/statistics';
import Button from '@/components/ui/Button';
import { BarChart3, Users, FileText, TrendingUp } from 'lucide-react';
// Lazy load heavy components
const ExportButton = lazy(() => import('@/components/export/ExportButton'));
const InteractiveChart = lazy(() => import('@/components/charts/InteractiveChart'));
const RealTimeStatus = lazy(() => import('@/components/realtime/RealTimeStatus'));
import useRealTimeUpdates from '@/hooks/useRealTimeUpdates';

// Lazy load Statistics Components
const PlatformOverview = lazy(() => import('./components/statistics/PlatformOverview'));
const UserAnalytics = lazy(() => import('./components/statistics/UserAnalytics'));
const PostPerformance = lazy(() => import('./components/statistics/PostPerformance'));
const EngagementTrends = lazy(() => import('./components/statistics/EngagementTrends'));

export default function AdminStatistics() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [statistics, setStatistics] = useState({
    platform: null,
    users: null,
    posts: null,
    engagement: null
  });

  // Real-time updates
  const { isConnected, lastUpdate, updateCount, startUpdates, stopUpdates, forceUpdate } = useRealTimeUpdates();

  useEffect(() => {
    loadStatistics();
  }, []);

  // Set up real-time updates
  useEffect(() => {
    if (isConnected) {
      startUpdates(loadStatistics);
    }
  }, [isConnected, startUpdates]);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      // Check if user has admin role
      const user = localStorage.getItem('user');
      
      if (user) {
        const parsedUser = JSON.parse(user);
        
        if (parsedUser?.role !== 'admin') {
          toast.error('Access denied. Admin role required.');
          setLoading(false);
          return;
        }
      }

      // Load all statistics using the service
      const dashboardData = await getAnalyticsDashboard();
      
      
      // Always use real data from API - Statistics APIs are now ready!
      
      // Check if we have any data from APIs
      if (!dashboardData || (!dashboardData.platform && !dashboardData.users && !dashboardData.posts && !dashboardData.engagement)) {
        toast.error('No statistics data available. Please check if Statistics APIs are working.');
      }
      
      setStatistics(dashboardData);

      // Add delay for Poring animation
      await new Promise(resolve => setTimeout(resolve, 800));
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Platform Overview', icon: '📊' },
    { id: 'users', label: 'User Analytics', icon: '👥' },
    { id: 'posts', label: 'Post Performance', icon: '📝' },
    { id: 'engagement', label: 'Engagement Trends', icon: '📈' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="scale-150">
          <LoadingSpinner size="lg" className="min-h-screen" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-dark-1 mb-2">Platform Statistics</h1>
              <p className="text-gray-6">Comprehensive analytics and insights for your platform</p>
            </div>
            <div className="flex gap-3">
              <Suspense fallback={<div className="h-10 w-32 bg-gray-3 rounded-lg animate-pulse" />}>
                <ExportButton data={statistics} filename="ragnarok-statistics" />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-white rounded-2xl p-2 shadow-lg border border-gray-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? 'primary' : 'ghost'}
                size="md"
                icon={<span className="text-lg">{tab.icon}</span>}
                className={`flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-6 to-purple-5 text-white shadow-md'
                    : 'text-gray-7 hover:bg-gray-1 hover:text-gray-9'
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Real-time Status */}
        <div className="mb-6">
          <Suspense fallback={<div className="h-16 bg-gray-3 rounded-lg animate-pulse" />}>
            <RealTimeStatus
              isConnected={isConnected}
              lastUpdate={lastUpdate}
              updateCount={updateCount}
              onStart={startUpdates}
              onStop={stopUpdates}
              onForceUpdate={forceUpdate}
            />
          </Suspense>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              <Suspense fallback={<LoadingSpinner size="md" />}>
                <PlatformOverview 
                  data={statistics.platform} 
                  loading={loading}
                  onRefresh={loadStatistics}
                />
              </Suspense>
              {/* Interactive Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense fallback={<div className="h-64 bg-gray-3 rounded-lg animate-pulse" />}>
                  <InteractiveChart
                    type="bar"
                    data={[
                      { label: 'Users', value: statistics.platform?.totalUsers || 0 },
                      { label: 'Posts', value: statistics.platform?.totalPosts || 0 },
                      { label: 'Likes', value: statistics.platform?.totalLikes || 0 },
                      { label: 'Comments', value: statistics.platform?.totalComments || 0 }
                    ]}
                    title="Platform Metrics"
                    colors={['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']}
                  />
                </Suspense>
                <Suspense fallback={<div className="h-64 bg-gray-1 rounded-lg animate-pulse" />}>
                  <InteractiveChart
                    type="doughnut"
                    data={[
                      { label: 'Active Users', value: statistics.platform?.activeUsers || 0 },
                      { label: 'Inactive Users', value: (statistics.platform?.totalUsers || 0) - (statistics.platform?.activeUsers || 0) }
                    ]}
                    title="User Activity"
                    colors={['#10b981', '#ef4444']}
                  />
                </Suspense>
              </div>
            </>
          )}
          
          {activeTab === 'users' && (
            <>
              <Suspense fallback={<LoadingSpinner size="md" />}>
                <UserAnalytics 
                  data={statistics.users} 
                  loading={loading}
                  onRefresh={loadStatistics}
                />
              </Suspense>
              {/* User Growth Chart */}
              {statistics.users?.userGrowth && statistics.users.userGrowth.length > 0 && (
                <Suspense fallback={<div className="h-64 bg-gray-1 rounded-lg animate-pulse" />}>
                  <InteractiveChart
                    type="line"
                    data={statistics.users.userGrowth.map(item => ({
                      label: item.month,
                      value: item.users
                    }))}
                    title="User Growth Trend"
                    colors={['#8b5cf6']}
                  />
                </Suspense>
              )}
            </>
          )}
          
          {activeTab === 'posts' && (
            <>
              <Suspense fallback={<LoadingSpinner size="md" />}>
                <PostPerformance 
                  data={statistics.posts} 
                  loading={loading}
                  onRefresh={loadStatistics}
                />
              </Suspense>
              {/* Post Categories Chart */}
              {statistics.posts?.postCategories && statistics.posts.postCategories.length > 0 && (
                <Suspense fallback={<div className="h-64 bg-gray-3 rounded-lg animate-pulse" />}>
                  <InteractiveChart
                    type="pie"
                    data={statistics.posts.postCategories.map(item => ({
                      label: item.category,
                      value: item.count
                    }))}
                    title="Posts by Category"
                    colors={['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5a2b']}
                  />
                </Suspense>
              )}
            </>
          )}
          
          {activeTab === 'engagement' && (
            <>
              <Suspense fallback={<LoadingSpinner size="md" />}>
                <EngagementTrends 
                  data={statistics.engagement} 
                  loading={loading}
                  onRefresh={loadStatistics}
                />
              </Suspense>
              {/* Engagement Trends Chart */}
              {statistics.engagement?.dailyEngagement && statistics.engagement.dailyEngagement.length > 0 && (
                <Suspense fallback={<div className="h-64 bg-gray-3 rounded-lg animate-pulse" />}>
                  <InteractiveChart
                    type="line"
                    data={statistics.engagement.dailyEngagement.map(item => ({
                      label: item.day,
                      value: item.likes + item.comments + item.shares
                    }))}
                    title="Daily Engagement"
                    colors={['#10b981']}
                  />
                </Suspense>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
