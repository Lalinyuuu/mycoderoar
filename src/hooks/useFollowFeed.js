/**
 * Custom hook for Follow Feed functionality
 * Separates business logic from UI components
 */

import { useState, useEffect, useCallback } from 'react';
import { getFollowFeed } from '@/api_services/followFeedService';
import { extractPostsData, extractPaginationData, debounce } from '@/utils/apiHelpers';
import { handleError } from '@/utils/errorHandling';
import { extractUniqueTags } from '@/utils/dataTransformers';

const DEFAULT_LIMIT = 20;
const LOADING_DELAY = 1700; // For Poring animation

export const useFollowFeed = (options = {}) => {
  const {
    limit = DEFAULT_LIMIT,
    onError = null,
    onSuccess = null
  } = options;

  // State management
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSort, setActiveSort] = useState('newest');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // Main fetch function - memoized to prevent infinite loops
  const fetchFeed = useCallback(async (params = {}) => {
    // Prevent multiple simultaneous requests
    if (isLoading) return;
    
    
    try {
      setIsLoading(true);
      setError(null);
      
      const fetchParams = {
        page: currentPage,
        limit,
        filter: activeFilter,
        sort: activeSort,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        ...params
      };

      // Add timeout protection
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Follow feed timeout')), 10000)
      );
      
      const result = await Promise.race([getFollowFeed(fetchParams), timeoutPromise]);
      
      if (result.success) {
        const postsData = extractPostsData(result);
        const paginationData = extractPaginationData(result);
        
        setPosts(postsData);
        setPagination(paginationData);
        
        // Extract unique tags from posts
        const uniqueTags = extractUniqueTags(postsData);
        setAvailableTags(uniqueTags);
        
        if (onSuccess) {
          onSuccess(postsData, paginationData);
        }
      } else {
        const errorMessage = result.error || 'Failed to load feed';
        setError(errorMessage);
        
        if (onError) {
          onError(errorMessage);
        } else {
          handleError(new Error(errorMessage), {
            fallbackMessage: 'Failed to load feed'
          });
        }
      }
    } catch (error) {
      const errorMessage = 'Failed to load feed';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      } else {
        handleError(error, {
          fallbackMessage: errorMessage
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, activeFilter, activeSort, selectedTags, onSuccess, onError]);

  // Debounced fetch function
  const debouncedFetch = useCallback(
    debounce(async (params) => {
      await fetchFeed(params);
    }, 300),
    [fetchFeed]
  );

  // Load more posts
  const loadMore = useCallback(() => {
    if (pagination && currentPage < pagination.totalPages && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  }, [pagination, currentPage, isLoading]);

  // Refresh feed
  const refresh = useCallback(() => {
    setCurrentPage(1);
    setPosts([]);
    fetchFeed({ page: 1 });
  }, [fetchFeed]);

  // Force refresh feed (useful after follow actions)
  const forceRefresh = useCallback(() => {
    setCurrentPage(1);
    setPosts([]);
    setError(null);
    fetchFeed({ page: 1 });
  }, [fetchFeed]);

  // Handle filter change
  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    setPosts([]);
    setSelectedTags([]);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((sort) => {
    setActiveSort(sort);
    setCurrentPage(1);
    setPosts([]);
  }, []);

  // Handle tag filter change
  const handleTagFilterChange = useCallback((tags) => {
    setSelectedTags(tags);
    setCurrentPage(1);
    setPosts([]);
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setActiveFilter('all');
    setActiveSort('newest');
    setSelectedTags([]);
    setCurrentPage(1);
    setPosts([]);
  }, []);

  // Check if there are active filters
  const hasActiveFilters = activeFilter !== 'all' || activeSort !== 'newest' || selectedTags.length > 0;
  

  // Check if feed is empty
  const isEmpty = posts.length === 0 && !isLoading && !error;
  

  // Check if can load more
  const canLoadMore = pagination && currentPage < pagination.totalPages && !isLoading;

  // Effect to fetch data when dependencies change
  useEffect(() => {
    // Check if user is authenticated before fetching
    const token = localStorage.getItem('token');
    if (!token) {
      setPosts([]);
      setPagination(null);
      setError('Please sign in to see your personalized feed');
      return;
    }
    
    // Fetch data when dependencies change
    fetchFeed();
  }, [currentPage, activeFilter, activeSort, selectedTags, limit, fetchFeed]);

  return {
    // Data
    posts,
    pagination,
    availableTags,
    
    // State
    isLoading,
    error,
    currentPage,
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
    clearFilters,
    
    // Direct state setters (for advanced usage)
    setPosts,
    setError,
    setCurrentPage
  };
};
