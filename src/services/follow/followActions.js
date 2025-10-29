/**
 * Follow/Unfollow Actions
 * Core follow and unfollow functionality
 */

import api from '../../api/index.js';
import { handleApiError, checkAuth, createAuthHeaders } from '../utils/errorHandler.js';

/**
 * Follow a user
 * @param {string} userId - ID of the user to follow
 * @returns {Promise<Object>} Follow result
 */
export const followUser = async (userId) => {
  try {
    const authCheck = checkAuth();
    if (!authCheck.success) return authCheck;

    const response = await api.post(`/api/follow/${userId}`, {}, {
      headers: createAuthHeaders(authCheck.token)
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, 'Failed to follow user', {
      alreadyFollowing: (message) => {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('already following') || lowerMessage.includes('already followed')) {
          return {
            success: true,
            data: {
              message: 'Already following this user',
              isFollowing: true
            }
          };
        }
        return null;
      }
    });
  }
};

/**
 * Unfollow a user
 * @param {string} userId - ID of the user to unfollow
 * @returns {Promise<Object>} Unfollow result
 */
export const unfollowUser = async (userId) => {
  try {
    const authCheck = checkAuth();
    if (!authCheck.success) return authCheck;

    const response = await api.delete(`/api/follow/${userId}`, {
      headers: createAuthHeaders(authCheck.token)
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, 'Failed to unfollow user', {
      alreadyUnfollowed: (message) => {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('already unfollowed') || 
            lowerMessage.includes('not following')) {
          return {
            success: true,
            data: {
              message: 'Already unfollowed this user',
              isFollowing: false
            }
          };
        }
        return null;
      }
    });
  }
};
