import CategoryCard from './CategoryCard';

const CategoryMobileList = ({ 
  categories, 
  loading, 
  search, 
  refreshKey, 
  editingCategory, 
  editingData, 
  onEdit, 
  onDelete, 
  onSave, 
  onCancel, 
  onDataChange, 
  updating, 
  deleteId 
}) => {
  return (
    <div className="md:hidden space-y-3">
      {!loading && categories.length === 0 ? (
        <div className="text-center py-16 bg-light-1 rounded-2xl border-2 border-purple-3">
          <div className="text-5xl mb-3">📂</div>
          <div className="font-bold gray-10 mb-2">No categories found</div>
          <div className="text-sm gray-7 font-medium">
            {search ? 'Try a different search term.' : 'Create your first category to get started.'}
          </div>
        </div>
      ) : !loading ? (
        categories.filter(cat => cat && cat.name).map((cat) => (
          <CategoryCard
            key={`${cat.id}-mobile-${refreshKey}`}
            category={cat}
            isEditing={editingCategory?.id === cat.id}
            editingData={editingData}
            onEdit={onEdit}
            onDelete={onDelete}
            onSave={onSave}
            onCancel={onCancel}
            onDataChange={onDataChange}
            isUpdating={updating === cat.id}
            isDeleting={deleteId === cat.id}
          />
        ))
      ) : null}
    </div>
  );
};

export default CategoryMobileList;
