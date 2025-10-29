import { useState, useEffect } from 'react';
import { getFollowStats } from '@/api_services/follow';
import { useNavigate } from 'react-router-dom';
import { useFollow } from '@/contexts/FollowContext';

const FollowStats = ({ 
  userId, 
  showLabels = true,
  className = '',
  onStatsChange = null
}) => {
  const navigate = useNavigate();
  const { updateFollowStatus } = useFollow();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchStats();
    }
  }, [userId]);

  // Listen for follow status changes and refresh stats
  useEffect(() => {
    const handleFollowStatusChange = (event) => {
      const { userId: changedUserId, isFollowing } = event.detail;
      // Only refresh if the changed user is the one we're displaying stats for
      if (changedUserId === userId) {
        // Add a small delay to allow backend to update
        setTimeout(() => {
          fetchStats();
        }, 500);
      } else {
      }
    };

    window.addEventListener('followStatusChanged', handleFollowStatusChange);
    
    return () => {
      window.removeEventListener('followStatusChanged', handleFollowStatusChange);
    };
  }, [userId]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await getFollowStats(userId);
      
      if (result.success) {
        // The actual stats data is in result.data.data due to nested structure
        const statsData = result.data.data || result.data;
        setStats(statsData);
        
        // Update follow status in context if available
        if (statsData.isFollowing !== undefined) {
          updateFollowStatus(userId, statsData.isFollowing);
        }
        
        if (onStatsChange) {
          onStatsChange(statsData);
        }
      } else {
        setError(result.error || 'Failed to load follow stats');
      }
    } catch (error) {
      setError('Failed to load follow stats');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowersClick = () => {
    navigate(`/users/${userId}/followers`);
  };

  const handleFollowingClick = () => {
    navigate(`/users/${userId}/following`);
  };

  if (isLoading) {
    return (
      <div className={`follow-stats loading ${className}`}>
        <div className="flex items-center gap-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-2 rounded w-16"></div>
            <div className="h-3 bg-gray-1 rounded w-12 mt-1"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-2 rounded w-16"></div>
            <div className="h-3 bg-gray-1 rounded w-12 mt-1"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`follow-stats error ${className}`}>
        <div className="text-sm error">
          {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className={`follow-stats ${className}`}>
      <div className="flex items-center gap-6">
        {/* Followers */}
        <div 
          className="text-center cursor-pointer hover:text-purple-6 transition-colors"
          onClick={handleFollowersClick}
        >
          <div className="text-xl font-bold text-gray-9">
            {stats.followersCount || 0}
          </div>
          {showLabels && (
            <div className="text-sm text-gray-6">
              {stats.followersCount === 1 ? 'Follower' : 'Followers'}
            </div>
          )}
        </div>

        {/* Following */}
        <div 
          className="text-center cursor-pointer hover:text-purple-6 transition-colors"
          onClick={handleFollowingClick}
        >
          <div className="text-xl font-bold text-gray-9">
            {stats.followingCount || 0}
          </div>
          {showLabels && (
            <div className="text-sm text-gray-6">
              Following
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowStats;
