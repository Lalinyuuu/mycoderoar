/**
 * User Profile Page
 * Main page component for viewing user profiles
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import LoadingPoring from '@/components/loading/LoadingPoring';
import { getUserById, getUserPosts } from '@/services/users';
import { checkFollowStatus, followUser, unfollowUser } from '@/api_services/follow';
import UserProfileHeader from './components/UserProfileHeader';
import UserPostsList from './components/UserPostsList';
import Button from '@/components/ui/Button';

export default function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      Promise.all([
        fetchUserProfile(),
        fetchUserPosts(),
        fetchFollowStatus()
      ]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const result = await getUserById(userId);
      
      if (result.success) {
        const userData = result.data?.user || result.data?.data || result.data;
        
        setProfileUser({
          id: userData?.id,
          name: userData?.name,
          username: userData?.username,
          email: userData?.email,
          avatar: userData?.avatar,
          bio: userData?.bio,
          role: userData?.role,
          createdAt: userData?.createdAt,
          followersCount: userData?.followersCount || 0,
          followingCount: userData?.followingCount || 0
        });
      } else {
        setError(result.error || 'Failed to load user profile');
      }
    } catch (error) {
      setError('Failed to load user profile');
    }
  };

  const fetchUserPosts = async () => {
    try {
      const result = await getUserPosts(userId);
      
      if (result.success) {
        const posts = result.data?.posts || result.data || [];
        setUserPosts(posts);
      } else {
        setUserPosts([]);
      }
    } catch (error) {
      setUserPosts([]);
    }
  };

  const fetchFollowStatus = async () => {
    if (!currentUser || currentUser.id === userId) return;
    
    try {
      const result = await checkFollowStatus(userId);
      if (result.success) {
        setIsFollowing(result.data.isFollowing);
      }
    } catch (error) {
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error('Please sign in to follow users');
      return;
    }

    setFollowLoading(true);
    try {
      const result = await followUser(userId);
      if (result.success) {
        setIsFollowing(true);
        toast.success('Successfully followed user!');
        // Update followers count
        setProfileUser(prev => ({
          ...prev,
          followersCount: (prev.followersCount || 0) + 1
        }));
      } else {
        toast.error(result.error || 'Failed to follow user');
      }
    } catch (error) {
      toast.error('Failed to follow user');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setFollowLoading(true);
    try {
      const result = await unfollowUser(userId);
      if (result.success) {
        setIsFollowing(false);
        toast.success('Successfully unfollowed user!');
        // Update followers count
        setProfileUser(prev => ({
          ...prev,
          followersCount: Math.max(0, (prev.followersCount || 0) - 1)
        }));
      } else {
        toast.error(result.error || 'Failed to unfollow user');
      }
    } catch (error) {
      toast.error('Failed to unfollow user');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleLoadMore = () => {
    // Implement pagination if needed
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="scale-150">
          <LoadingPoring fullscreen={false} text="Loading profile..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-1 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Profile Not Found</h1>
          <p className="text-gray-6 mb-8">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-6 text-white rounded-xl hover:bg-blue-7 transition-colors duration-200"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">User Not Found</h1>
          <p className="text-gray-6 mb-8">The user you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-6 text-white rounded-xl hover:bg-blue-7 transition-colors duration-200"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <UserProfileHeader
          user={profileUser}
          currentUser={currentUser}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          isFollowing={isFollowing}
          followLoading={followLoading}
        />

        {/* User Posts */}
        <UserPostsList
          posts={userPosts}
          loading={false}
          error={null}
          onLoadMore={handleLoadMore}
          hasMore={false}
          loadingMore={false}
        />
      </div>
    </div>
  );
}