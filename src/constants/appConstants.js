/**
 * Application Constants
 * Centralized constants for the application
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://blog-api-tau-sand.vercel.app',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  LOAD_MORE_THRESHOLD: 5
};

// Loading States
export const LOADING_DELAYS = {
  MINIMUM: 500,
  PORING_ANIMATION: 1700,
  DEBOUNCE: 300,
  THROTTLE: 100
};

// UI Constants
export const UI_CONSTANTS = {
  BREAKPOINTS: {
    MOBILE: 640,
    TABLET: 768,
    DESKTOP: 1024,
    LARGE: 1280
  },
  ANIMATION_DURATION: 300,
  SCROLL_OFFSET: 50
};

// Post Categories
export const POST_CATEGORIES = {
  ALL: 'All',
  GUIDES: 'Guides',
  LORE: 'Lore',
  BEGINNER: 'Beginner',
  CRAFTING: 'Crafting',
  BUILDS: 'Builds',
  PVP: 'PvP',
  MVP: 'MVP',
  EVENTS: 'Events'
};

// Sort Options
export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  POPULAR: 'popular',
  MOST_LIKED: 'most_liked',
  MOST_COMMENTED: 'most_commented',
  MOST_VIEWED: 'most_viewed',
  ENGAGEMENT: 'engagement',
  RECENTLY_UPDATED: 'recently_updated'
};

// Filter Options
export const FILTER_OPTIONS = {
  ALL: 'all',
  RECENT: 'recent',
  TRENDING: 'trending',
  INTERACTIVE: 'interactive',
  MEDIA: 'media',
  GUIDES: 'guides'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  AUTH_ERROR: 'Authentication failed. Please login again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
  LOAD_POSTS_ERROR: 'Failed to load posts',
  LOAD_FEED_ERROR: 'Failed to load feed',
  LOGIN_ERROR: 'Login failed',
  REGISTER_ERROR: 'Registration failed',
  FOLLOW_ERROR: 'Failed to follow user',
  UNFOLLOW_ERROR: 'Failed to unfollow user'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
  FOLLOW_SUCCESS: 'Successfully followed user',
  UNFOLLOW_SUCCESS: 'Successfully unfollowed user',
  POST_CREATED: 'Post created successfully',
  POST_UPDATED: 'Post updated successfully',
  POST_DELETED: 'Post deleted successfully'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  PREFERENCES: 'preferences',
  CACHE: 'cache'
};

// Cache Configuration
export const CACHE_CONFIG = {
  POSTS_TTL: 5 * 60 * 1000, // 5 minutes
  USER_TTL: 10 * 60 * 1000, // 10 minutes
  FEED_TTL: 2 * 60 * 1000, // 2 minutes
  MAX_CACHE_SIZE: 50
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME_REGEX: /^[a-zA-Z0-9_]{3,20}$/,
  PASSWORD_MIN_LENGTH: 6,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 500,
  CONTENT_MAX_LENGTH: 10000
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_FILES: 5
};

// Performance Thresholds
export const PERFORMANCE_THRESHOLDS = {
  SLOW_RENDER: 16, // 16ms for 60fps
  SLOW_API: 2000, // 2 seconds
  LARGE_LIST: 100, // 100 items
  HEAVY_CALCULATION: 10 // 10ms
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_SENTRY: import.meta.env.VITE_ENABLE_SENTRY === 'true',
  ENABLE_DEBUG: import.meta.env.DEV,
  ENABLE_OFFLINE: false,
  ENABLE_PWA: false
};

// Default Values
export const DEFAULTS = {
  AVATAR: '/images/avatar/avartar-default.png',
  PLACEHOLDER_IMAGE: '/images/placeholder.jpg',
  USER_AVATAR: '/images/avatar/avartar-default.png',
  POST_IMAGE: '/images/placeholder.jpg'
};

// API Endpoints - Updated to match API documentation
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    PROFILE: '/api/auth/profile',
    RESET_PASSWORD: '/api/auth/reset-password',
    CHECK_EMAIL: '/api/auth/check-email',
    CHECK_USERNAME: '/api/auth/check-username',
    CHECK_PASSWORD: '/api/auth/check-password'
  },
  POSTS: {
    LIST: '/api/posts',
    GET: '/api/posts/:id',
    GET_BY_SLUG: '/api/posts/slug/:slug',
    RELATED: '/api/posts/:id/related',
    STATS: '/api/posts/:id/stats',
    COMMENTS: '/api/posts/:id/comments',
    LIKE: '/api/posts/:id/like',
    SHARE: '/api/posts/:id/share'
  },
  USERS: {
    PROFILE: '/api/users/:userId',
    POSTS: '/api/users/:userId/posts',
    STATISTICS: '/api/users/:userId/statistics',
    SUGGESTIONS: '/api/users/suggestions'
  },
  FOLLOW: {
    FOLLOW: '/api/follow/:userId',
    UNFOLLOW: '/api/follow/:userId',
    STATUS: '/api/follow/:userId/status',
    FOLLOWERS: '/api/follow/users/:userId/followers',
    FOLLOWING: '/api/follow/users/:userId/following',
    STATS: '/api/follow/users/:userId/follow-stats',
    FEED: '/api/follow/feed'
  },
  COMMENTS: {
    LIST: '/api/comments/posts/:postId/comments',
    CREATE: '/api/comments/posts/:postId/comments',
    UPDATE: '/api/comments/comments/:commentId',
    DELETE: '/api/comments/comments/:commentId',
    USER_COMMENTS: '/api/comments/users/comments'
  },
  INTERACTIONS: {
    LIKE: '/api/interactions/posts/:postId/like',
    SAVE: '/api/interactions/posts/:postId/save',
    SHARE: '/api/interactions/posts/:postId/share',
    VIEW: '/api/interactions/posts/:postId/view',
    STATUS: '/api/interactions/posts/:postId/status',
    SAVED_POSTS: '/api/interactions/saved-posts',
    COMMENT_LIKE: '/api/interactions/comments/:id/like',
    COMMENT_STATUS: '/api/interactions/comments/:id/status'
  },
  CATEGORIES: {
    LIST: '/api/categories',
    GET: '/api/categories/:slug',
    POSTS: '/api/categories/:slug/posts'
  },
  ADMIN: {
    STATS: '/api/admin/stats',
    POSTS: '/api/admin/posts',
    USERS: '/api/admin/users',
    CATEGORIES: '/api/admin/categories'
  },
  UPLOAD: {
    HEALTH: '/api/upload/health',
    AVATAR: '/api/upload/avatar',
    POST: '/api/upload/post',
    DELETE: '/api/upload/:publicId'
  },
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    READ: '/api/notifications/:id/read',
    READ_ALL: '/api/notifications/read-all',
    DELETE: '/api/notifications/:id'
  },
  STATISTICS: {
    POST: '/api/statistics/posts/:postId',
    POSTS_MULTIPLE: '/api/statistics/posts/multiple',
    USER: '/api/statistics/users/:userId',
    PLATFORMS: '/api/statistics/platforms'
  },
  HEALTH: '/health'
};
