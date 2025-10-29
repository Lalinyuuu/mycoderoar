/**
 * Interactions API Service
 * Main service that exports all interaction-related functions
 */

// Import all interaction services
export * from './likeService';
export * from './commentService';
export * from './saveService';
export * from './shareService';
export * from '../services/interactions/userInteractions';
export * from '../services/interactions/analytics';

// Re-export commonly used functions for backward compatibility
export {
  likePost,
  unlikePost,
  checkLikeStatus,
  getPostLikesCount
} from './likeService';

export {
  getPostComments,
  addComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment
} from './commentService';

export {
  savePost,
  unsavePost,
  checkSaveStatus,
  getSavedPosts
} from './saveService';

export {
  sharePost,
  getPostShareCount,
  trackPostView,
  getPostStats
} from './shareService';

export {
  getUserPostStatus,
  getLikedPosts
} from '../services/interactions/userInteractions';

export {
  trackView,
  getInteractionHistory
} from '../services/interactions/analytics';

export {
  trackShare
} from '../services/posts';