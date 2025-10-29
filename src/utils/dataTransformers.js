/**
 * Data Transformation Utilities
 * Functions to normalize and transform data from different API formats
 */

/**
 * Normalize post data from different API formats
 * @param {Object} post - Raw post data
 * @returns {Object} - Normalized post data
 */
export const normalizePost = (post) => {
  if (!post || typeof post !== 'object') {
    return null;
  }
  
  return {
    id: post.id || post._id || 'unknown',
    title: post.title || 'Draft Post',
    description: post.description || post.content?.substring(0, 150) || 'No description available',
    content: post.content || post.body || '',
    image: post.image || post.imageUrl || post.coverImage || '/images/placeholder.jpg',
    imagePublicId: post.imagePublicId || post.image_public_id || null,
    category: post.category || post.tags?.[0] || 'General',
    tags: Array.isArray(post.tags) ? post.tags : [],
    author: normalizeAuthor(post.author || post.user),
    date: post.date || post.createdAt || new Date().toISOString(),
    updatedAt: post.updatedAt || post.updated_at || post.date || post.createdAt,
    likes: post.likes || post.likesCount || post.likeCount || post._count?.likes || 0,
    comments: post.comments || post.commentsCount || post.commentCount || post._count?.comments || 0,
    views: post.views || post.viewsCount || post.viewCount || post._count?.views || 0,
    isLiked: Boolean(post.isLiked || post.liked || false),
    isSaved: Boolean(post.isSaved || post.saved || false),
    status: post.status || 'published',
    slug: post.slug || post.title?.toLowerCase().replace(/\s+/g, '-') || 'untitled'
  };
};

/**
 * Normalize author data from different API formats
 * @param {Object} author - Raw author data
 * @returns {Object} - Normalized author data
 */
export const normalizeAuthor = (author) => {
  if (!author || typeof author !== 'object') {
    return {
      id: 'unknown',
      name: 'Unknown Author',
      username: 'unknown',
      avatar: '/images/avatar/avartar-default.png',
      bio: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0
    };
  }
  
  return {
    id: author.id || author._id || 'unknown',
    name: author.name || author.displayName || 'Unknown Author',
    username: author.username || author.userName || 'unknown',
    avatar: author.avatar || author.avatarUrl || author.profilePicture || '/images/avatar/avartar-default.png',
    bio: author.bio || author.biography || '',
    followersCount: author.followersCount || author.followers_count || 0,
    followingCount: author.followingCount || author.following_count || 0,
    postsCount: author.postsCount || author.posts_count || 0,
    isVerified: Boolean(author.isVerified || author.verified || false),
    joinedAt: author.joinedAt || author.createdAt || author.created_at
  };
};

/**
 * Normalize pagination data from different API formats
 * @param {Object} pagination - Raw pagination data
 * @returns {Object} - Normalized pagination data
 */
export const normalizePagination = (pagination) => {
  if (!pagination || typeof pagination !== 'object') {
    return {
      currentPage: 1,
      totalPages: 1,
      total: 0,
      page: 1,
      limit: 20,
      hasNext: false,
      hasPrev: false
    };
  }
  
  const currentPage = pagination.currentPage || pagination.page || 1;
  const totalPages = pagination.totalPages || pagination.total_pages || 1;
  const total = pagination.total || pagination.totalCount || 0;
  const limit = pagination.limit || pagination.pageSize || 20;
  
  return {
    currentPage,
    totalPages,
    total,
    page: currentPage,
    limit,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
};

/**
 * Normalize follow data from different API formats
 * @param {Object} followData - Raw follow data
 * @returns {Object} - Normalized follow data
 */
export const normalizeFollowData = (followData) => {
  if (!followData || typeof followData !== 'object') {
    return {
      isFollowing: false,
      followersCount: 0,
      followingCount: 0
    };
  }
  
  return {
    isFollowing: Boolean(
      followData.isFollowing ?? 
      followData.following ?? 
      followData.status ?? 
      (followData.data ? followData.data.isFollowing : undefined) ?? 
      false
    ),
    followersCount: followData.followersCount || followData.followers_count || 0,
    followingCount: followData.followingCount || followData.following_count || 0
  };
};

/**
 * Transform posts array to normalized format
 * @param {Array} posts - Raw posts array
 * @returns {Array} - Normalized posts array
 */
export const transformPosts = (posts) => {
  if (!Array.isArray(posts)) {
    return [];
  }
  
  return posts
    .map(normalizePost)
    .filter(post => post !== null);
};

/**
 * Transform API response to standard format
 * @param {Object} response - Raw API response
 * @param {Object} options - Transformation options
 * @returns {Object} - Standardized response
 */
export const transformApiResponse = (response, options = {}) => {
  const {
    dataPath = 'data',
    postsPath = 'posts',
    paginationPath = 'pagination'
  } = options;
  
  const data = response[dataPath] || response;
  const posts = data[postsPath] || data.data?.posts || data.posts || [];
  const pagination = data[paginationPath] || data.pagination;
  
  return {
    success: true,
    data: {
      posts: transformPosts(posts),
      pagination: normalizePagination(pagination)
    },
    originalResponse: response
  };
};

/**
 * Extract unique tags from posts array
 * @param {Array} posts - Posts array
 * @returns {Array} - Unique tags array
 */
export const extractUniqueTags = (posts) => {
  if (!Array.isArray(posts)) {
    return [];
  }
  
  const allTags = posts.reduce((acc, post) => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => {
        if (typeof tag === 'string' && !acc.includes(tag)) {
          acc.push(tag);
        }
      });
    }
    return acc;
  }, []);
  
  return allTags.sort();
};

/**
 * Filter posts by category
 * @param {Array} posts - Posts array
 * @param {string} category - Category to filter by
 * @returns {Array} - Filtered posts
 */
export const filterPostsByCategory = (posts, category) => {
  if (!Array.isArray(posts) || !category || category === 'All') {
    return posts;
  }
  
  return posts.filter(post => {
    const postCategory = post.category || post.tags?.[0];
    return postCategory === category;
  });
};

/**
 * Sort posts by criteria
 * @param {Array} posts - Posts array
 * @param {string} sortBy - Sort criteria
 * @returns {Array} - Sorted posts
 */
export const sortPosts = (posts, sortBy = 'newest') => {
  if (!Array.isArray(posts)) {
    return [];
  }
  
  const sortedPosts = [...posts];
  
  switch (sortBy) {
    case 'newest':
      return sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    case 'oldest':
      return sortedPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    case 'popular':
      return sortedPosts.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
    
    case 'most_liked':
      return sortedPosts.sort((a, b) => b.likes - a.likes);
    
    case 'most_commented':
      return sortedPosts.sort((a, b) => b.comments - a.comments);
    
    case 'most_viewed':
      return sortedPosts.sort((a, b) => b.views - a.views);
    
    default:
      return sortedPosts;
  }
};

/**
 * Search posts by keyword
 * @param {Array} posts - Posts array
 * @param {string} keyword - Search keyword
 * @returns {Array} - Filtered posts
 */
export const searchPosts = (posts, keyword) => {
  if (!Array.isArray(posts) || !keyword || keyword.trim() === '') {
    return posts;
  }
  
  const searchTerm = keyword.toLowerCase().trim();
  
  return posts.filter(post => {
    const searchableText = [
      post.title,
      post.description,
      post.content,
      post.category,
      ...(post.tags || [])
    ].join(' ').toLowerCase();
    
    return searchableText.includes(searchTerm);
  });
};

/**
 * Group posts by category
 * @param {Array} posts - Posts array
 * @returns {Object} - Posts grouped by category
 */
export const groupPostsByCategory = (posts) => {
  if (!Array.isArray(posts)) {
    return {};
  }
  
  return posts.reduce((groups, post) => {
    const category = post.category || 'General';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(post);
    return groups;
  }, {});
};
