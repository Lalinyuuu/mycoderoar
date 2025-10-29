import { useState, useEffect } from 'react';
import { HeroSection, FollowFeed } from "@/components";
import ArticleSection from "@/feature/posts/containers/ArticleSection";
import { useAuth } from "@/contexts";
import { getFollowStats } from "@/api_services/followStatsService";

export default function HomePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [followingCount, setFollowingCount] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Check following count when user changes
  useEffect(() => {
    const checkFollowingCount = async () => {
      if (!user?.id) {
        setFollowingCount(0);
        setLoadingStats(false);
        return;
      }

      try {
        const result = await getFollowStats(user.id);
        if (result.success && result.data) {
          setFollowingCount(result.data.followingCount || 0);
        } else {
          setFollowingCount(0);
        }
      } catch (error) {
        setFollowingCount(0);
      } finally {
        setLoadingStats(false);
      }
    };

    checkFollowingCount();
  }, [user?.id]);

  // No need to redirect - let FollowFeed handle empty state with suggestions

  return (
    <div className="w-full">
      <HeroSection />
      
      {/* Tab Navigation */}
      {user && (
        <div className="max-w-[1440px] mx-auto px-4 py-4 w-full">
          <div className="flex justify-center mb-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-purple-1">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-out group ${
                    activeTab === 'all'
                      ? 'bg-gradient-to-r from-purple-6 to-purple-5 text-white shadow-lg transform scale-105'
                      : 'text-purple-7 hover:text-purple-8 hover:bg-purple-1'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    All Posts
                  </span>
                  {activeTab === 'all' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-4 to-blue-4 rounded-xl blur opacity-30"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('feed')}
                  className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-out group ${
                    activeTab === 'feed'
                      ? 'bg-gradient-to-r from-purple-6 to-purple-5 text-white shadow-lg transform scale-105'
                      : 'text-purple-7 hover:text-purple-8 hover:bg-purple-1'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Your Feed
                  </span>
                  {activeTab === 'feed' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-4 to-blue-4 rounded-xl blur opacity-30"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {user && activeTab === 'feed' ? (
        <FollowFeed 
          onSwitchToAllPosts={() => setActiveTab('all')}
        />
      ) : (
        <ArticleSection />
      )}
    </div>
  );
}
