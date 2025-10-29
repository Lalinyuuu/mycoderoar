import { useCallback } from 'react';

const CategoryForm = ({ 
  isEditing, 
  category, 
  name, 
  description, 
  onNameChange, 
  onDescriptionChange, 
  onSave, 
  onCancel, 
  isSaving, 
  isCreating 
}) => {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') onSave();
    if (e.key === 'Escape') onCancel();
  }, [onSave, onCancel]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold gray-10 mb-2">Category Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter category name"
          className="w-full h-10 rounded-lg border-2 border-purple-3 bg-light-1 px-4 py-2 focus:outline-none focus:border-purple-5 transition-all gray-10 font-medium placeholder:text-gray-6"
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>
      <div>
        <label className="block text-sm font-semibold gray-10 mb-2">Description (Optional)</label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Enter category description"
          rows={3}
          className="w-full rounded-lg border-2 border-purple-3 bg-light-1 px-4 py-2 focus:outline-none focus:border-purple-5 transition-all gray-10 font-medium placeholder:text-gray-6"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={isSaving || !name.trim()}
          className="px-6 py-2 bg-gradient-to-r from-emerald-5 to-emerald-6 text-white font-bold rounded-full hover:from-emerald-6 hover:to-emerald-7 disabled:opacity-50 shadow-md"
        >
          {isSaving ? (isCreating ? 'Creating...' : 'Saving...') : (isCreating ? 'Create' : 'Save')}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gradient-to-r from-gray-6 to-gray-7 text-white font-bold rounded-full hover:from-gray-7 hover:to-gray-8 shadow-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CategoryForm;
