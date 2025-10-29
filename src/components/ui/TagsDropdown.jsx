import { useState, useRef, useEffect } from 'react';
import { Tag, X, ChevronDown, Plus } from 'lucide-react';
import { AVAILABLE_TAGS, TAG_CATEGORIES, getTagColor, formatTag } from '../../constants/tags';

const TagsDropdown = ({ 
  selectedTags = [], 
  onTagsChange, 
  placeholder = "Select tags...",
  maxTags = 5,
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customTag, setCustomTag] = useState('');
  const dropdownRef = useRef(null);

  // Filter tags based on search term
  const filteredTags = AVAILABLE_TAGS.filter(tag => 
    tag.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedTags.includes(tag)
  );

  // Handle tag selection
  const handleTagSelect = (tag) => {
    if (selectedTags.includes(tag)) return;
    
    const newTags = [...selectedTags, tag];
    if (newTags.length <= maxTags) {
      onTagsChange(newTags);
    }
    setSearchTerm('');
  };

  // Handle tag removal
  const handleTagRemove = (tagToRemove) => {
    const newTags = selectedTags.filter(tag => tag !== tagToRemove);
    onTagsChange(newTags);
  };

  // Handle custom tag addition
  const handleCustomTagAdd = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      const newTags = [...selectedTags, customTag.trim()];
      if (newTags.length <= maxTags) {
        onTagsChange(newTags);
      }
      setCustomTag('');
    }
  };

  // Handle custom tag key press
  const handleCustomTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomTagAdd();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setCustomTag('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected Tags Display */}
      <div className="min-h-[48px] p-3 border-2 border-purple-3 rounded-lg bg-white flex flex-wrap gap-2 items-center">
        {selectedTags.length > 0 ? (
          selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-gradient-to-r from-purple-5 to-purple-6 text-white shadow-sm"
            >
              {formatTag(tag)}
              <button
                type="button"
                onClick={() => handleTagRemove(tag)}
                className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))
        ) : (
          <span className="gray-5 text-sm">{placeholder}</span>
        )}
        
        {/* Add Tag Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium purple-6 hover:bg-purple-1 rounded-lg transition-colors whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Tag</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-purple-3 rounded-lg shadow-xl z-50 max-h-[400px] overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-2">
            <input
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-5 focus:border-transparent"
            />
          </div>

          {/* Tag Categories */}
          <div className="max-h-72 overflow-y-auto">
            {/* Popular Tags */}
            <div className="p-3">
              <div className="text-xs font-bold gray-7 mb-2 uppercase tracking-wide">Popular Tags</div>
              <div className="flex flex-wrap gap-2">
                {TAG_CATEGORIES.GAME_CATEGORIES.filter(tag => 
                  tag.toLowerCase().includes(searchTerm.toLowerCase()) &&
                  !selectedTags.includes(tag)
                ).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagSelect(tag)}
                    className="px-3 py-1.5 text-sm font-medium rounded-full bg-gray-1 text-gray-8 hover:bg-purple-1 hover:text-purple-6 border border-gray-3 hover:border-purple-3 transition-all cursor-pointer"
                  >
                    {formatTag(tag)}
                  </button>
                ))}
              </div>
            </div>

            {/* All Available Tags */}
            {filteredTags.length > 0 && (
              <div className="p-3 border-t border-gray-2">
                <div className="text-xs font-bold gray-7 mb-2 uppercase tracking-wide">All Tags</div>
                <div className="flex flex-wrap gap-2">
                  {filteredTags.slice(0, 20).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagSelect(tag)}
                      className="px-3 py-1.5 text-sm font-medium rounded-full bg-gray-1 text-gray-8 hover:bg-purple-1 hover:text-purple-6 border border-gray-3 hover:border-purple-3 transition-all cursor-pointer"
                    >
                      {formatTag(tag)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Tag Input */}
            <div className="p-3 border-t border-gray-2 bg-gradient-to-br from-light-1 to-purple-1/10">
              <div className="text-xs font-bold gray-7 mb-2 uppercase tracking-wide">Custom Tag</div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter custom tag..."
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyPress={handleCustomTagKeyPress}
                  className="flex-1 px-3 py-2 text-sm border-2 border-purple-3 rounded-lg focus:outline-none focus:border-purple-5 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleCustomTagAdd}
                  disabled={!customTag.trim() || selectedTags.includes(customTag.trim())}
                  className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-purple-6 to-purple-5 text-white rounded-lg hover:from-purple-7 hover:to-purple-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Max Tags Warning */}
          {selectedTags.length >= maxTags && (
            <div className="p-2 bg-yellow-1 border-t border-yellow-2">
              <p className="text-xs yellow-8">
                Maximum {maxTags} tags allowed. Remove a tag to add more.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagsDropdown;
