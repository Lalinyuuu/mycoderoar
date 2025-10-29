/**
 * FollowFeed UI Component
 * Pure UI component that handles rendering and user interactions
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlogCard from '@/components/cards/BlogCard';
import FollowButton from './FollowButton';
import UserSuggestions from './UserSuggestions';
import FeedFilters from './FeedFilters';
import LoadingPoring from '@/components/loading/LoadingPoring';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const FollowFeedUI = ({
  // Data props
  posts = [],
  pagination = null,
  availableTags = [],
  
  // State props
  isLoading = false,
  error = null,
  activeFilter = 'all',
  activeSort = 'newest',
  selectedTags = [],
  
  // Computed props
  isEmpty = false,
  hasActiveFilters = false,
  canLoadMore = false,
  
  // Action props
  onLoadMore = null,
  onRefresh = null,
  onFilterChange = null,
  onSortChange = null,
  onTagFilterChange = null,
  onClearFilters = null,
  onSwitchToAllPosts = null,
  onPostClick = null,
  
  // UI props
  className = '',
  showTitle = true,
  limit = 20
}) => {
  const navigate = useNavigate();

  // Handle post click
  const handlePostClick = (post) => {
    if (onPostClick) {
      onPostClick(post);
    } else {
      navigate(`/post/${post.id}`);
    }
  };

  // Handle switch to all posts
  const handleSwitchToAllPosts = () => {
    if (onSwitchToAllPosts) {
      onSwitchToAllPosts();
    } else {
      navigate('/');
    }
  };

  // Loading state
  if (isLoading && posts.length === 0) {
    return (
      <div className={`follow-feed loading w-full px-4 ${className}`}>
        {showTitle && <FeedHeader />}
        <div className="flex items-start justify-center -mt-50 pb-8">
          <div className="scale-150">
            <LoadingPoring fullscreen={false} text="Loading Your Feed..." />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && posts.length === 0) {
    return (
      <div className={`follow-feed error w-full px-4 ${className}`}>
        {showTitle && <FeedHeader />}
        <ErrorState error={error} onRefresh={onRefresh} />
      </div>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <div className={`follow-feed empty w-full px-4 ${className}`}>
        {showTitle && <FeedHeader />}
        <EmptyState 
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
          onSwitchToAllPosts={handleSwitchToAllPosts}
          onRefresh={onRefresh}
        />
      </div>
    );
  }

  // Main feed content
  return (
    <div className={`follow-feed max-w-[1440px] mx-auto px-4 ${className}`}>
      {showTitle && (
        <FeedHeader 
          postsCount={posts.length}
          onRefresh={onRefresh}
        />
      )}

      {/* Feed Filters - Hidden on mobile, shown on larger screens */}
      <div className="hidden md:block">
        <FeedFilters
          onFilterChange={onFilterChange}
          onSortChange={onSortChange}
          onTagFilterChange={onTagFilterChange}
          currentFilter={activeFilter}
          currentSort={activeSort}
          selectedTags={selectedTags}
          availableTags={availableTags}
        />
      </div>

      {/* Timeline-style feed */}
      <div className="space-y-8">
        {posts.map((post, index) => (
          <ErrorBoundary key={post.id}>
            <TimelinePost 
              post={post} 
              index={index}
              totalPosts={posts.length}
              onClick={() => handlePostClick(post)}
            />
          </ErrorBoundary>
        ))}
      </div>

      {/* Load More Button */}
      {canLoadMore && (
        <LoadMoreButton 
          isLoading={isLoading}
          onLoadMore={onLoadMore}
        />
      )}

      {/* Pagination Info */}
      {pagination && (
        <PaginationInfo 
          currentCount={posts.length}
          total={pagination.total}
        />
      )}
    </div>
  );
};

// Sub-components for better organization

const FeedHeader = ({ postsCount = 0, onRefresh = null }) => (
  <div className="mb-8 relative">
    {/* Background decorative elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-purple-1 to-purple-2 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-4 left-8 w-20 h-20 bg-linear-to-br from-purple-1 to-purple-2 rounded-full opacity-30 animate-bounce"></div>
    </div>

    <div className="relative z-10 flex items-center justify-between">
      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-linear-to-br from-purple-5 to-purple-7 rounded-3xl flex items-center justify-center shadow-lg animate-pulse">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          {/* Floating notification dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-linear-to-r from-pink-4 to-pink-5 rounded-full animate-ping"></div>
        </div>
        <div>
          <h2 className="text-2xl md:text-4xl font-bold bg-linear-to-r from-purple-6 via-purple-7 to-pink-6 bg-clip-text text-transparent mb-2 animate-pulse">
            Your Feed ✨
          </h2>
          <p className="text-gray-6 text-lg md:text-xl">Posts from users you follow</p>
          <div className="flex items-center gap-2 md:gap-4 mt-2">
            <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-purple-6">
              <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-medium">Live Updates</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm success">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-success rounded-full animate-pulse"></div>
              <span className="font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3">
        {/* Stats - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-4 bg-white rounded-2xl px-4 py-3 shadow-lg border border-purple-1">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-7">{postsCount}</div>
            <div className="text-xs text-gray-6">Posts</div>
          </div>
          <div className="w-px h-8 bg-gray-2"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-5">Live</div>
            <div className="text-xs text-gray-6">Feed</div>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="group relative p-3 md:p-4 rounded-2xl bg-linear-to-br from-purple-1 to-purple-1 hover:from-purple-1 hover:to-purple-2 transition-all duration-300 hover:scale-105 shadow-lg border border-purple-2"
          title="Refresh feed"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-6 group-hover:text-purple-7 group-hover:rotate-180 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <div className="absolute inset-0 bg-linear-to-br from-purple-2 to-purple-3 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  </div>
);

// Memoized TimelinePost to prevent unnecessary re-renders
const TimelinePost = React.memo(({ post, index, totalPosts, onClick }) => (
  <div className="relative">
    {/* Timeline line */}
    {index < totalPosts - 1 && (
      <div className="absolute left-0 top-20 w-0.5 h-full bg-linear-to-b from-purple-3 to-transparent"></div>
    )}
    
    {/* Post card */}
    <div className="relative z-10 max-w-xl mx-auto">
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
        onClick={onClick}
        variant="timeline"
      />
    </div>
  </div>
), (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.post?.id === nextProps.post?.id &&
    prevProps.index === nextProps.index &&
    prevProps.totalPosts === nextProps.totalPosts &&
    prevProps.onClick === nextProps.onClick
  );
});

const LoadMoreButton = ({ isLoading, onLoadMore }) => (
  <div className="text-center mt-16 relative">
    {/* Decorative line */}
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-8 bg-linear-to-b from-purple-3 to-transparent"></div>
    
    <div className="relative">
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="group relative inline-flex items-center gap-4 bg-linear-to-r from-purple-6 to-purple-7 text-white px-10 py-5 rounded-3xl font-bold text-lg hover:from-purple-7 hover:to-purple-8 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-2xl border-2 border-purple-5"
      >
        {isLoading ? (
          <>
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Loading Amazing Posts...</span>
          </>
        ) : (
          <>
            <svg className="w-6 h-6 group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span>Load More Amazing Posts</span>
            <div className="absolute inset-0 bg-linear-to-r from-purple-7 to-purple-8 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </>
        )}
      </button>
      
      {/* Floating elements around button */}
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-4 rounded-full animate-ping opacity-60"></div>
      <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-pink-4 rounded-full animate-ping opacity-60 animation-delay-1000"></div>
    </div>
  </div>
);

const PaginationInfo = ({ currentCount, total }) => (
  <div className="text-center mt-8">
    <div className="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-purple-1 to-pink-1 rounded-2xl text-sm font-medium text-purple-7 border border-purple-2 shadow-lg">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <span>Showing <span className="font-bold text-purple-8">{currentCount}</span> of <span className="font-bold text-purple-8">{total}</span> amazing posts</span>
      <div className="w-1 h-1 bg-purple-3 rounded-full animate-ping"></div>
    </div>
  </div>
);

const ErrorState = ({ error, onRefresh }) => (
  <div className="text-center py-16">
    <div className="w-20 h-20 bg-error rounded-full flex items-center justify-center mx-auto mb-6">
      <svg className="w-10 h-10 error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-2xl font-bold text-gray-9 mb-3">Failed to load feed</h3>
    <p className="text-gray-6 mb-8 text-lg">{error}</p>
    <button
      onClick={onRefresh}
      className="inline-flex items-center gap-3 bg-linear-to-r from-red-5 to-red-6 text-white px-8 py-4 rounded-2xl font-medium hover:from-red-6 hover:to-red-7 transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Try Again
    </button>
  </div>
);

const EmptyState = ({ hasActiveFilters, onClearFilters, onSwitchToAllPosts, onRefresh }) => {
  if (hasActiveFilters) {
    return <EmptyWithFilters onClearFilters={onClearFilters} onSwitchToAllPosts={onSwitchToAllPosts} />;
  }
  
  return <EmptyNoFollows onSwitchToAllPosts={onSwitchToAllPosts} onRefresh={onRefresh} />;
};

const EmptyWithFilters = ({ onClearFilters, onSwitchToAllPosts }) => (
  <div className="relative">
    <div className="relative z-10 text-center py-20">
      {/* Filter Icon */}
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-linear-to-br from-purple-1 via-purple-2 to-purple-2 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
          <svg className="w-16 h-16 blue-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
      </div>

      {/* Message */}
      <div className="max-w-2xl mx-auto">
        <h3 className="text-4xl font-bold bg-linear-to-r from-blue-6 via-blue-7 to-purple-6 bg-clip-text text-transparent mb-4">
          No Posts Match Your Filters 🔍
        </h3>
        <p className="text-xl text-gray-7 mb-4 leading-relaxed">
          We couldn't find any posts matching your current filter selection.
        </p>
        <p className="text-lg text-gray-6 mb-8">
          Try adjusting your filters or browse all posts instead!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onClearFilters}
            className="group relative inline-flex items-center gap-3 bg-linear-to-r from-blue-6 to-blue-7 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-7 hover:to-blue-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Clear All Filters
          </button>

          <button
            onClick={onSwitchToAllPosts}
            className="group inline-flex items-center gap-3 bg-white text-purple-7 px-8 py-4 rounded-2xl font-bold border-2 border-purple-2 hover:border-purple-3 hover:bg-purple-1 transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse All Posts
          </button>
        </div>
      </div>
    </div>
  </div>
);

const EmptyNoFollows = ({ onSwitchToAllPosts, onRefresh }) => (
  <div className="relative">
    {/* Background decorative elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-10 left-10 w-32 h-32 bg-linear-to-br from-purple-1 to-purple-2 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-32 right-20 w-24 h-24 bg-linear-to-br from-purple-1 to-purple-2 rounded-full opacity-30 animate-bounce"></div>
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-linear-to-br from-pink-1 to-pink-2 rounded-full opacity-25 animate-pulse"></div>
    </div>

    <div className="relative z-10 text-center py-20">
      {/* Animated Icon */}
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-linear-to-br from-purple-1 via-purple-2 to-purple-3 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-2xl">
          <svg className="w-16 h-16 text-purple-7 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        {/* Floating elements */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-4 rounded-full animate-ping"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-4 rounded-full animate-ping animation-delay-1000"></div>
      </div>

      {/* Engaging Content */}
      <div className="max-w-2xl mx-auto">
        <h3 className="text-4xl font-bold bg-linear-to-r from-purple-6 via-purple-7 to-pink-6 bg-clip-text text-transparent mb-4 animate-pulse">
          Your Ragnarok Feed is Waiting! ⚔️
        </h3>
        <p className="text-xl text-gray-7 mb-8 leading-relaxed">
          Connect with fellow adventurers and discover epic Ragnarok content. 
          <br />
          <span className="text-purple-6 font-semibold">Start following players</span> to see their adventures here!
        </p>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-purple-1">
            <div className="w-12 h-12 bg-linear-to-br from-blue-5 to-blue-7 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-9 mb-2">Discover Adventures</h4>
            <p className="text-gray-6 text-sm">Explore epic Ragnarok stories and find amazing builds</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-purple-1">
            <div className="w-12 h-12 bg-linear-to-br from-emerald-5 to-emerald-6 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-9 mb-2">Follow Adventurers</h4>
            <p className="text-gray-6 text-sm">Connect with fellow players and build your Ragnarok community</p>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onSwitchToAllPosts}
            className="group relative inline-flex items-center gap-3 bg-linear-to-r from-purple-6 to-purple-7 text-white px-8 py-4 rounded-2xl font-bold hover:from-purple-7 hover:to-purple-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Explore Epic Adventures
            <div className="absolute inset-0 bg-linear-to-r from-purple-7 to-purple-8 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>

          <button
            onClick={onSwitchToAllPosts}
            className="group inline-flex items-center gap-3 bg-white text-purple-7 px-8 py-4 rounded-2xl font-bold border-2 border-purple-2 hover:border-purple-3 hover:bg-purple-1 transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Find Survivors to Follow
          </button>
        </div>

        {/* User Suggestions */}
        <div className="mt-12">
          <UserSuggestions 
            limit={5}
            onUserFollowed={(userId) => {
              // Refresh feed when user is followed
              if (onRefresh) onRefresh();
            }}
          />
        </div>

        {/* Fun Stats or Tips */}
        <div className="mt-8 bg-linear-to-r from-purple-1 to-pink-1 rounded-2xl p-6 border border-gray-1">
          <div className="flex items-center justify-center gap-2 mb-3">
            <svg className="w-5 h-5 text-purple-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-purple-7 font-semibold">Pro Tip</span>
          </div>
          <p className="text-gray-7 text-center">
            Follow adventurers who share epic Ragnarok adventures you love. 
            <br />
            The more you follow, the more personalized your Ragnarok feed becomes! ⚔️
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default FollowFeedUI;
