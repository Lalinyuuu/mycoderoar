/**
 * Interactions API Service
 * Main export file for all interaction-related functionality
 */

// Post Interactions
export {
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  getPostInteractionStatus
} from './postInteractions.js';

// Comment Interactions
export {
  likeComment,
  unlikeComment
} from './commentInteractions.js';

// Analytics and Tracking
export {
  trackView,
  getPostStats,
  getInteractionHistory
} from './analytics.js';

// User Interactions
export {
  getUserPostStatus,
  getSavedPosts,
  getLikedPosts
} from './userInteractions.js';
