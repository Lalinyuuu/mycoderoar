/**
 * Category List Component
 * List display for categories with edit/delete actions
 */

import { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Tag,
  Plus
} from 'lucide-react';

const CategoryList = ({
  categories = [],
  loading = false,
  searchTerm = '',
  onSearch,
  onEdit,
  onDelete,
  onCreateNew
}) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCategories = [...categories].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="scale-150">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-1 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-5 to-purple-7 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-9">Categories</h2>
              <p className="text-sm text-gray-6">{categories.length} categories</p>
            </div>
          </div>
          
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-6 text-white rounded-xl hover:bg-purple-7 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            New Category
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-4" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-5 focus:border-transparent"
            />
          </div>
          
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-1 text-gray-7 rounded-xl hover:bg-gray-2 transition-colors duration-200">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="p-6">
        {sortedCategories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-1 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-gray-4" />
            </div>
            <h3 className="text-lg font-semibold text-gray-9 mb-2">No categories found</h3>
            <p className="text-gray-6 mb-4">Create your first category to get started.</p>
            <button
              onClick={onCreateNew}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-6 text-white rounded-xl hover:bg-purple-7 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              Create Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedCategories.map((category) => (
              <div
                key={category.id}
                className="group relative p-4 border border-gray-2 rounded-xl hover:border-purple-3 hover:shadow-md transition-all duration-200"
              >
                {/* Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(category)}
                      className="p-1.5 text-blue-6 hover:bg-blue-1 rounded-lg transition-colors duration-200"
                      title="Edit category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(category)}
                      className="p-1.5 text-red-6 hover:bg-red-1 rounded-lg transition-colors duration-200"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="pr-16">
                  <h3 className="font-semibold text-gray-9 mb-2 line-clamp-1">
                    {category.name}
                  </h3>
                  
                  {category.description && (
                    <p className="text-sm text-gray-6 mb-3 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-5">
                    <span>Created {formatDate(category.createdAt)}</span>
                    {category.postCount && (
                      <span>{category.postCount} posts</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
