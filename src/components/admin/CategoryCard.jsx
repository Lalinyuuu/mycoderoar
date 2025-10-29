const CategoryCard = ({ 
  category, 
  isEditing, 
  editingData, 
  onEdit, 
  onDelete, 
  onSave, 
  onCancel, 
  onDataChange, 
  isUpdating, 
  isDeleting 
}) => {
  if (isEditing) {
    return (
      <div className="bg-light-1 rounded-xl border-2 border-purple-3 p-4 shadow-md hover:shadow-lg hover:border-purple-4 transition-all">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold gray-10 mb-1.5">Category Name</label>
            <input
              type="text"
              value={editingData.name}
              onChange={(e) => onDataChange('name', e.target.value)}
              className="w-full h-10 px-3 py-2 border-2 border-purple-3 rounded-lg text-sm focus:outline-none focus:border-purple-5 gray-10 font-medium"
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSave();
                if (e.key === 'Escape') onCancel();
              }}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-semibold gray-10 mb-1.5">Description (Optional)</label>
            <textarea
              value={editingData.description}
              onChange={(e) => onDataChange('description', e.target.value)}
              placeholder="Add description..."
              rows={2}
              className="w-full px-3 py-2 border-2 border-purple-3 rounded-lg text-sm focus:outline-none focus:border-purple-5 gray-10 font-medium placeholder:text-gray-6"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={onSave}
              disabled={isUpdating}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-5 to-emerald-6 text-white font-bold rounded-lg hover:from-emerald-6 hover:to-emerald-7 disabled:opacity-50 text-sm shadow-md"
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2.5 bg-gray-6 text-white font-bold rounded-lg hover:bg-gray-7 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light-1 rounded-xl border-2 border-purple-3 p-4 shadow-md hover:shadow-lg hover:border-purple-4 transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold gray-10 text-base mb-1">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm gray-7 line-clamp-2">
              {category.description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-1 to-purple-2 text-purple-8 border border-purple-3 shadow-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {category._count?.posts || 0}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-purple-2">
        <button
          onClick={() => onEdit(category)}
          disabled={isUpdating}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-6 to-purple-5 text-white rounded-lg font-bold text-sm hover:from-purple-7 hover:to-purple-6 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit
        </button>
        <button
          onClick={() => onDelete(category)}
          disabled={isDeleting}
          className="p-2.5 bg-pink-1 text-error rounded-lg hover:bg-error hover:text-white transition-all disabled:opacity-50"
          title="Delete"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;
