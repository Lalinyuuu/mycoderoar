/**
 * Post Utility Functions
 * Helper functions for post-related operations
 */

/**
 * Check if a string is a valid UUID
 * @param {string} str - String to check
 * @returns {boolean} - True if valid UUID
 */
export const isUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

/**
 * Check if a string looks like a slug
 * @param {string} str - String to check
 * @returns {boolean} - True if looks like a slug
 */
export const isSlug = (str) => {
  // Slug pattern: lowercase letters, numbers, hyphens, underscores
  const slugRegex = /^[a-z0-9-_]+$/;
  return slugRegex.test(str) && !isUUID(str);
};

/**
 * Determine the best method to fetch a post based on the identifier
 * @param {string} identifier - Post identifier (ID or slug)
 * @returns {string} - 'id' or 'slug'
 */
export const getPostFetchMethod = (identifier) => {
  if (isUUID(identifier)) {
    return 'id';
  }
  if (isSlug(identifier)) {
    return 'slug';
  }
  // Default to ID for unknown formats
  return 'id';
};

/**
 * Generate a post URL based on the identifier type
 * @param {string} identifier - Post identifier
 * @returns {string} - Post URL
 */
export const getPostUrl = (identifier) => {
  const method = getPostFetchMethod(identifier);
  return `/post/${identifier}`;
};

/**
 * Extract post ID from various data formats
 * @param {Object} post - Post object
 * @returns {string|null} - Post ID
 */
export const extractPostId = (post) => {
  if (!post) return null;
  return post.id || post._id || post.slug || null;
};

/**
 * Extract post slug from various data formats
 * @param {Object} post - Post object
 * @returns {string|null} - Post slug
 */
export const extractPostSlug = (post) => {
  if (!post) return null;
  return post.slug || post.title?.toLowerCase().replace(/\s+/g, '-') || null;
};

/**
 * Normalize post identifier for consistent handling
 * @param {string} identifier - Post identifier
 * @returns {Object} - Normalized identifier info
 */
export const normalizePostIdentifier = (identifier) => {
  return {
    original: identifier,
    type: getPostFetchMethod(identifier),
    isUUID: isUUID(identifier),
    isSlug: isSlug(identifier)
  };
};
