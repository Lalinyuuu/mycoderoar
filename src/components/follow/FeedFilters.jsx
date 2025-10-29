// src/components/follow/FeedFilters.jsx
import { useState } from 'react';

const FeedFilters = ({ 
  onFilterChange = null, 
  onSortChange = null,
  onTagFilterChange = null,
  currentFilter = 'all',
  currentSort = 'newest',
  selectedTags = [],
  availableTags = []
}) => {
  const [activeFilter, setActiveFilter] = useState(currentFilter);
  const [activeSort, setActiveSort] = useState(currentSort);
  const [tagSearch, setTagSearch] = useState('');

  // Popular tags (only show if they exist in availableTags)
  const popularTagsList = ['guide', 'beginner', 'pvp', 'build', 'meta', 'f2p', 'boss', 'events'];
  const popularTags = popularTagsList.filter(tag => availableTags.includes(tag));
  
  // Filtered tags based on search
  const filteredTags = tagSearch
    ? availableTags.filter(tag => 
        tag.toLowerCase().includes(tagSearch.toLowerCase())
      )
    : [];

  const filters = [
    { id: 'all', label: 'All Posts', icon: '📝' },
    { id: 'guides', label: 'How-To Guides', icon: '📚' },
  ];

  const sortOptions = [
    { id: 'newest', label: 'Latest Posts', icon: '🕒' },
    { id: 'engagement', label: 'Most Engaging', icon: '💫' },
  ];

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    if (onFilterChange) {
      onFilterChange(filterId);
    }
  };

  const handleSortChange = (sortId) => {
    setActiveSort(sortId);
    if (onSortChange) {
      onSortChange(sortId);
    }
  };

  const handleTagToggle = (tag) => {
    if (onTagFilterChange) {
      const newTags = selectedTags.includes(tag) 
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag];
      onTagFilterChange(newTags);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Section */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-9 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter by Category
          </h3>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterChange(filter.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter.id
                    ? 'bg-purple-6 text-light-1 shadow-lg'
                    : 'bg-gray-3 gray-8 hover:bg-purple-1 hover:purple-7 border border-gray-3'
                }`}
              >
                <span className="text-base">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Section */}
        <div className="lg:w-80">
          <h3 className="text-lg font-semibold text-gray-9 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            Sort by
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSortChange(option.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSort === option.id
                    ? 'bg-purple-6 text-white shadow-lg'
                    : 'bg-gray-3 text-gray-8 hover:bg-purple-1 hover:text-purple-7'
                }`}
              >
                <span className="text-sm">{option.icon}</span>
                <span className="truncate">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tag Filter Section */}
      {availableTags.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-1">
          <h3 className="text-lg font-semibold text-gray-9 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Filter by Tags
          </h3>
          
          {/* Search Tags */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search tags... (e.g. pvp, guide, beginner)"
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 border-2 border-gray-3 rounded-lg 
                focus:outline-none focus:border-purple-5 transition-all 
                text-sm gray-10 placeholder:text-gray-5"
            />
            <svg 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Popular Tags (shown when no search) */}
          {!tagSearch && (
            <div className="mb-3">
              <p className="text-xs text-gray-6 mb-2 font-medium">🔥 Popular Tags:</p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-purple-6 text-white shadow-lg'
                        : 'bg-purple-1 text-purple-7 hover:bg-purple-2 border border-purple-3'
                    }`}
                  >
                    <span className="text-xs">#</span>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filtered Tags (shown when searching) */}
          {tagSearch && (
            <div className="flex flex-wrap gap-2">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-purple-6 text-white shadow-lg'
                        : 'bg-gray-1 text-gray-7 hover:bg-purple-1 hover:text-purple-7'
                    }`}
                  >
                    <span className="text-xs">#</span>
                    {tag}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-5 italic">No tags found for "{tagSearch}"</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      <div className="mt-6 pt-4 border-t border-gray-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-6">Active filters:</span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-1 text-purple-7 text-xs rounded-full">
                {filters.find(f => f.id === activeFilter)?.icon}
                {filters.find(f => f.id === activeFilter)?.label}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-1 text-purple-7 text-xs rounded-full">
                {sortOptions.find(s => s.id === activeSort)?.icon}
                {sortOptions.find(s => s.id === activeSort)?.label}
              </span>
              {selectedTags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-1 text-emerald-7 text-xs rounded-full">
                  <span>#</span>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => {
              setActiveFilter('all');
              setActiveSort('newest');
              setTagSearch('');
              if (onFilterChange) onFilterChange('all');
              if (onSortChange) onSortChange('newest');
              if (onTagFilterChange) onTagFilterChange([]);
            }}
            className="text-sm text-gray-5 hover:text-purple-6 transition-colors duration-200"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedFilters;
