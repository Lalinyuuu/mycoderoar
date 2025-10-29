import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useFollow } from '@/contexts/FollowContext';
import { followUser, unfollowUser } from '@/api_services/follow';
import Button from '@/components/ui/Button';

const FollowButton = ({ 
  userId, 
  initialIsFollowing = false,
  onFollowChange = null,
  className = '',
  size = 'default',
  showIcon = true,
  disabled = false
}) => {
  const { user } = useAuth();
  const { 
    checkFollowStatusForUser, 
    updateFollowStatus, 
    getFollowStatus, 
    isLoading: isCheckingStatusFn 
  } = useFollow();
  
  const isCheckingStatus = isCheckingStatusFn ? isCheckingStatusFn(userId) : false;
  
  // Get cached follow status from context
  const cachedFollowStatus = getFollowStatus(userId);
  const [isFollowing, setIsFollowing] = useState(cachedFollowStatus !== undefined ? cachedFollowStatus : initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const lastClickTime = useRef(0);

  // Don't show follow button if user is viewing their own profile
  const isOwnProfile = user?.id === userId;

  // Update local state when cached status changes
  useEffect(() => {
    if (cachedFollowStatus !== undefined) {
      setIsFollowing(cachedFollowStatus);
    }
  }, [cachedFollowStatus]);

  useEffect(() => {
    // Only check from server if we don't have cached status
    if (userId && user?.id && !isOwnProfile && cachedFollowStatus === undefined) {
      checkInitialFollowStatus();
    }
  }, [userId, user?.id, isOwnProfile, cachedFollowStatus]);

  const checkInitialFollowStatus = async () => {
    try {
      const status = await checkFollowStatusForUser(userId);
      setIsFollowing(status);
      updateFollowStatus(userId, status);
    } catch (error) {
      // Fallback to cached status if API fails
      if (cachedFollowStatus !== undefined) {
        setIsFollowing(cachedFollowStatus);
      }
    }
  };

  const handleFollowToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    
    if (!user) {
      toast.error('Please login to follow users');
      return;
    }

    if (isOwnProfile) {
      toast.error('You cannot follow yourself');
      return;
    }

    // Prevent rapid clicking (debounce)
    const now = Date.now();
    if (now - lastClickTime.current < 1000) {
      return;
    }
    lastClickTime.current = now;

    setIsLoading(true);

    try {
      const result = isFollowing 
        ? await unfollowUser(userId)
        : await followUser(userId);
      
      
      if (result.success) {
        // Use the follow status from API response if available, otherwise toggle
        const newFollowStatus = result.data?.isFollowing !== undefined 
          ? result.data.isFollowing 
          : !isFollowing;
        
        setIsFollowing(newFollowStatus);
        
        // Update global follow status
        updateFollowStatus(userId, newFollowStatus);
        
        // Call callback if provided
        if (onFollowChange) {
          onFollowChange(newFollowStatus);
        }

        // Trigger a custom event for other components to listen to
        window.dispatchEvent(new CustomEvent('followStatusChanged', {
          detail: { userId, isFollowing: newFollowStatus }
        }));

        // Show success message
        if (result.data?.message) {
          // Don't show toast for "Already following" cases
        } else {
          toast.success(newFollowStatus ? 'Successfully followed!' : 'Successfully unfollowed!');
        }
      } else {
        toast.error(result.error || 'Failed to update follow status');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if it's user's own profile
  if (isOwnProfile) {
    return null;
  }

  // Don't render if not logged in
  if (!user) {
    return null;
  }

  return (
    <Button
      onClick={handleFollowToggle}
      disabled={disabled || isLoading || isCheckingStatus}
      size={size}
      variant={isFollowing ? "secondary" : "primary"}
      className={`follow-button ${className}`}
    >
      {isLoading ? (
        <>
          {showIcon && (
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          <span>{isFollowing ? 'Unfollowing...' : 'Following...'}</span>
        </>
      ) : (
        <>
          {showIcon && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isFollowing ? (
                // Following icon (check)
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                // Follow icon (plus)
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              )}
            </svg>
          )}
          <span>{isFollowing ? 'Following' : 'Follow'}</span>
        </>
      )}
    </Button>
  );
};

export default FollowButton;
