/**
 * User Posts List Component
 * List of posts by the user
 */

import { useState } from 'react';
import BlogCard from '@/components/cards/BlogCard';
import LoadingPoring from '@/components/loading/LoadingPoring';
import Select from '@/components/ui/select';

const UserPostsList = ({
  posts = [],
  loading = false,
  error = null,
  onLoadMore = null,
  hasMore = false,
  loadingMore = false
}) => {
  const [sortBy, setSortBy] = useState('newest');

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'popular', label: 'Most Popular' }
  ];

  // Ensure posts is always an array
  const safePosts = Array.isArray(posts) ? posts : [];
  
  const sortedPosts = [...safePosts].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'popular':
        return (b.likes + b.comments) - (a.likes + a.comments);
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="scale-150">
          <LoadingPoring fullscreen={false} text="Loading posts..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-red-1 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-9 mb-2">Failed to load posts</h3>
        <p className="text-gray-6 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-6 text-white text-sm font-medium rounded-xl hover:bg-blue-7 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (safePosts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-1 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gray-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-9 mb-2">No posts yet</h3>
        <p className="text-gray-6">This user hasn't published any posts yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-9">Posts</h2>
          <p className="text-sm text-gray-6">{safePosts.length} posts published</p>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-6">Sort by:</span>
          <Select
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
            size="sm"
            options={sortOptions}
          />
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPosts.map((post) => (
          <BlogCard
            key={post.id}
            id={post.id}
            image={post.image || post.imageUrl || post.coverImage}
            category={post.category || post.tags?.[0]}
            title={post.title}
            description={post.description || post.content?.substring(0, 150)}
            author={post.author || post.user}
            date={post.date || post.createdAt}
            likes={post.likes || post.likesCount || post.likeCount || 0}
            comments={post.comments || post.commentsCount || post.commentCount || 0}
            views={post.views || post.viewsCount || post.viewCount || 0}
            tags={post.tags || []}
            isLiked={post.isLiked || post.liked || false}
            isSaved={post.isSaved || post.saved || false}
            variant="default"
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <div className="text-center mt-8">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-6 text-white rounded-xl hover:bg-blue-7 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </>
            ) : (
              'Load More Posts'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserPostsList;
