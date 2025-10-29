import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { checkFollowStatus } from '@/api_services/follow';

const FollowContext = createContext(null);

export function FollowProvider({ children }) {
  const { user } = useAuth();
  const [followStatuses, setFollowStatuses] = useState({});
  const [loading, setLoading] = useState({});

  // Load follow statuses from localStorage on mount
  useEffect(() => {
    if (user?.id) {
      const savedStatuses = localStorage.getItem(`followStatuses_${user.id}`);
      if (savedStatuses) {
        try {
          const parsed = JSON.parse(savedStatuses);
          setFollowStatuses(parsed);
        } catch (error) {
          // Clear corrupted data
          localStorage.removeItem(`followStatuses_${user.id}`);
        }
      } else {
      }
    }
  }, [user?.id]);

  // Clear follow statuses when user logs out
  useEffect(() => {
    if (!user) {
      setFollowStatuses({});
      setLoading({});
    }
  }, [user]);

  const checkFollowStatusForUser = useCallback(async (userId) => {
    
    if (!user || !userId || user.id === userId) {
      return false;
    }

    // Return cached status immediately if available
    if (followStatuses[userId] !== undefined) {
      return followStatuses[userId];
    }

    // Check if already loading
    if (loading[userId]) {
      return false;
    }

    try {
      setLoading(prev => ({ ...prev, [userId]: true }));
      
      // Try to get from API
      const result = await checkFollowStatus(userId);
      
      if (result.success) {
        const isFollowing = result.data.isFollowing || false;
        setFollowStatuses(prev => ({ ...prev, [userId]: isFollowing }));
        
        // Save to localStorage
        if (user?.id) {
          setFollowStatuses(prev => {
            const newStatuses = { ...prev, [userId]: isFollowing };
            localStorage.setItem(`followStatuses_${user.id}`, JSON.stringify(newStatuses));
            return newStatuses;
          });
        }
        
        return isFollowing;
      }
    } catch (error) {
      // If API fails, try to use cached status from localStorage
      if (followStatuses[userId] !== undefined) {
        return followStatuses[userId];
      }
    } finally {
      setLoading(prev => ({ ...prev, [userId]: false }));
    }

    // Default to false if no cached status and API fails
    return false;
  }, [user, followStatuses, loading]);

  const updateFollowStatus = useCallback((userId, isFollowing) => {
    setFollowStatuses(prev => {
      const newStatuses = { ...prev, [userId]: isFollowing };
      
      // Save to localStorage
      if (user?.id) {
        const key = `followStatuses_${user.id}`;
        const value = JSON.stringify(newStatuses);
        localStorage.setItem(key, value);
      }
      
      return newStatuses;
    });
  }, [user]);

  const getFollowStatus = useCallback((userId) => {
    const status = followStatuses[userId] || false;
    return status;
  }, [followStatuses]);

  const isLoading = useCallback((userId) => {
    return loading[userId] || false;
  }, [loading]);

  const clearFollowStatuses = useCallback(() => {
    setFollowStatuses({});
    setLoading({});
    
    // Clear from localStorage
    if (user?.id) {
      localStorage.removeItem(`followStatuses_${user.id}`);
    }
  }, [user]);

  return (
    <FollowContext.Provider
      value={{
        followStatuses,
        checkFollowStatusForUser,
        updateFollowStatus,
        getFollowStatus,
        isLoading,
        clearFollowStatuses
      }}
    >
      {children}
    </FollowContext.Provider>
  );
}

export function useFollow() {
  const context = useContext(FollowContext);
  if (!context) {
    throw new Error('useFollow must be used within a FollowProvider');
  }
  return context;
}

export default FollowContext;
