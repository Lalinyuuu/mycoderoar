/**
 * FollowFeed Component
 * Main component that connects business logic with UI
 */

import { useFollowFeed } from '@/hooks/useFollowFeed';
import FollowFeedUI from './FollowFeedUI';

const FollowFeed = ({ 
  className = '',
  limit = 20,
  showTitle = true,
  onPostClick = null,
  onSwitchToAllPosts = null
}) => {
  const {
    // Data
    posts,
    pagination,
    availableTags,
    
    // State
    isLoading,
    error,
    activeFilter,
    activeSort,
    selectedTags,
    
    // Computed
    isEmpty,
    hasActiveFilters,
    canLoadMore,
    
    // Actions
    loadMore,
    refresh,
    forceRefresh,
    handleFilterChange,
    handleSortChange,
    handleTagFilterChange,
    clearFilters
  } = useFollowFeed({ limit });

  return (
    <FollowFeedUI
      // Data props
      posts={posts}
      pagination={pagination}
      availableTags={availableTags}
      
      // State props
      isLoading={isLoading}
      error={error}
      activeFilter={activeFilter}
      activeSort={activeSort}
      selectedTags={selectedTags}
      
      // Computed props
      isEmpty={isEmpty}
      hasActiveFilters={hasActiveFilters}
      canLoadMore={canLoadMore}
      
      // Action props
      onLoadMore={loadMore}
      onRefresh={refresh}
      onForceRefresh={forceRefresh}
      onFilterChange={handleFilterChange}
      onSortChange={handleSortChange}
      onTagFilterChange={handleTagFilterChange}
      onClearFilters={clearFilters}
      onSwitchToAllPosts={onSwitchToAllPosts}
      onPostClick={onPostClick}
      
      // UI props
      className={className}
      showTitle={showTitle}
      limit={limit}
    />
  );
};

export default FollowFeed;