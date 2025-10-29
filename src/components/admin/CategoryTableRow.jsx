import CategoryForm from './CategoryForm';

const CategoryTableRow = ({ 
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
      <tr className="border-b border-purple-2 hover:bg-purple-1/30 transition-colors">
        <td className="px-6 py-4 font-semibold gray-10">
          <CategoryForm
            isEditing={true}
            category={category}
            name={editingData.name}
            description={editingData.description}
            onNameChange={(value) => onDataChange('name', value)}
            onDescriptionChange={(value) => onDataChange('description', value)}
            onSave={onSave}
            onCancel={onCancel}
            isSaving={isUpdating}
            isCreating={false}
          />
        </td>
        <td className="px-6 py-4 gray-8 font-medium">
          {category._count?.posts || 0} posts
        </td>
        <td className="px-6 py-4"></td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-purple-2 hover:bg-purple-1/30 transition-colors">
      <td className="px-6 py-4 font-semibold gray-10">
        <div>
          <div className="font-bold gray-10">{category.name}</div>
          {category.description && (
            <div className="text-sm gray-7 mt-1">{category.description}</div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 gray-8 font-medium">
        {category._count?.posts || 0} posts
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => onEdit(category)}
            disabled={isUpdating}
            className="p-2 hover:bg-purple-2 rounded-full transition-colors disabled:opacity-50"
            title="Edit"
          >
            <svg className="w-5 h-5 text-purple-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button 
            onClick={() => onDelete(category)}
            disabled={isDeleting}
            className="p-2 hover:bg-pink-1 rounded-full transition-colors disabled:opacity-50"
            title="Delete"
          >
            <svg className="w-5 h-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CategoryTableRow;
