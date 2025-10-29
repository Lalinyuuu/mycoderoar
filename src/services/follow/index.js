/**
 * Follow System API Service
 * Main export file for all follow-related functionality
 */

// Follow Actions
export {
  followUser,
  unfollowUser
} from './followActions.js';

// Follow Status and Statistics
export {
  checkFollowStatus,
  getFollowStats,
  getMyFollowStats
} from './followStatus.js';

// Follow Lists
export {
  getFollowers,
  getFollowing,
  getMutualFollows
} from './followLists.js';

// Follow Feed
export {
  getFollowFeed,
  getFollowSuggestions,
  getTrendingUsers
} from './followFeed.js';
