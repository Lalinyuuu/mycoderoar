/**
 * Follow System API Service
 * Main service that exports all follow-related functions
 */

// Import all follow services
export * from './followUserService';
export * from './followListService';
export * from './followStatsService';
export * from './followFeedService';

// Re-export commonly used functions for backward compatibility
export {
  followUser,
  unfollowUser,
  checkFollowStatus
} from './followUserService';

export {
  getFollowers,
  getFollowing,
  getMutualFollowers
} from './followListService';

export {
  getFollowStats,
  getFollowCounts
} from './followStatsService';

export {
  getFollowFeed,
  getUserSuggestions,
  getTrendingUsers
} from './followFeedService';