import CategoryTableRow from './CategoryTableRow';

const CategoryTable = ({ 
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
    <div className="hidden md:block rounded-2xl border-2 border-purple-3 bg-light-1 shadow-xl overflow-hidden">
      <table key={refreshKey} className="w-full">
        <thead className="bg-gradient-to-r from-purple-1 to-emerald-1/30 border-b-2 border-purple-3">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-bold gray-10">Category</th>
            <th className="px-6 py-4 text-left text-sm font-bold gray-10">Posts</th>
            <th className="px-6 py-4 text-right"></th>
          </tr>
        </thead>
        <tbody>
          {!loading && categories.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center gray-7">
                {search ? 'No categories found matching your search.' : 'No categories available.'}
              </td>
            </tr>
          ) : !loading ? (
            categories.filter(cat => cat && cat.name).map((cat) => (
              <CategoryTableRow
                key={`${cat.id}-${refreshKey}`}
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
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
