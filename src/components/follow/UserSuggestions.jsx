// src/components/follow/UserSuggestions.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getUserSuggestions } from '@/api_services/follow';
import FollowButton from './FollowButton';

const UserSuggestions = ({ limit = 5, onUserFollowed = null }) => {
  const navigate = useNavigate();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSuggestions();
  }, [limit]);

  const fetchSuggestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await getUserSuggestions({ limit });
      
      if (result.success) {
        const users = result.data.users || result.data || [];
        setSuggestedUsers(Array.isArray(users) ? users : []);
        
        // Log for debugging
        if (result.isFallback) {
        } else if (result.isEmpty) {
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Failed to fetch suggested users:', error);
      setError('Failed to load suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserFollowed = (userId) => {
    if (onUserFollowed) {
      onUserFollowed(userId);
    }
    toast.success('Started following user!');
  };

  // Hide loading state completely - will show nothing or content when ready
  // This prevents flash of loading state for a feature that's not available
  if (isLoading) {
    return null;
  }

  // Hide component completely if no suggestions available
  // This prevents showing empty state when feature is not available yet
  if (error || suggestedUsers.length === 0) {
    return null;
  }

  return (
    <div className="bg-light-1 rounded-2xl p-6 border border-purple-1 shadow-lg">
      <h3 className="text-xl font-bold gray-9 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 purple-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Suggested Users
      </h3>
      
      <div className="space-y-4">
        {suggestedUsers.map((user) => (
          <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-light-2 transition-colors duration-200">
            <div className="relative">
              <img
                src={user.avatar || '/images/avatar/profile_mockup.png'}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-2"
              />
              {user.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-light-1"></div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold gray-9 truncate">{user.name}</h4>
                {user.isVerified && (
                  <svg className="w-4 h-4 purple-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                )}
              </div>
              <p className="text-sm gray-6 truncate">{user.bio || 'No bio available'}</p>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-xs gray-5">{user.followersCount || 0} followers</span>
                <span className="text-xs gray-5">•</span>
                <span className="text-xs gray-5">{user.postsCount || 0} posts</span>
              </div>
            </div>
            
            <div className="shrink-0">
              <FollowButton
                userId={user.id}
                size="sm"
                onFollowChange={() => handleUserFollowed(user.id)}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-1">
        <button
          onClick={() => navigate('/users')}
          className="w-full text-center purple-6 hover:purple-7 font-medium transition-colors duration-200"
        >
          View All Survivors →
        </button>
      </div>
    </div>
  );
};

export default UserSuggestions;
