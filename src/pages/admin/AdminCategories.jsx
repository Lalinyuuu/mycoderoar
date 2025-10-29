import { useState, useCallback } from 'react';
import { useAdminCategories } from '@/hooks/useAdminCategories';
import LoadingPoring from '@/components/loading/LoadingPoring';
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal.jsx';
import CategoryForm from '@/components/admin/CategoryForm';
import CategoryTable from '@/components/admin/CategoryTable';
import CategoryMobileList from '@/components/admin/CategoryMobileList';

export default function AdminCategories() {
  const {
    categories,
    loading,
    creating,
    updating,
    deleteId,
    refreshKey,
    search,
    setSearch,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useAdminCategories();

  const [editingCategory, setEditingCategory] = useState(null);
  const [editingData, setEditingData] = useState({ name: '', description: '' });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Event Handlers
  const handleEditCategory = useCallback((category) => {
    setEditingCategory(category);
    setEditingData({
      name: category.name,
      description: category.description || ''
    });
  }, []);

  const handleDataChange = useCallback((field, value) => {
    setEditingData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSaveCategory = useCallback(async () => {
    if (!editingCategory || !editingData.name.trim()) {
      return;
    }

    if (editingCategory.name === editingData.name.trim() && 
        editingCategory.description === editingData.description.trim()) {
      resetEditing();
      return;
    }

    try {
      await updateCategory(editingCategory.id, {
        name: editingData.name.trim(),
        description: editingData.description.trim(),
      });
      resetEditing();
    } catch (error) {
      // Error handled by hook
    }
  }, [editingCategory, editingData, updateCategory]);

  const handleCreateCategory = useCallback(async () => {
    if (!editingData.name.trim()) {
      return;
    }

    try {
      await createCategory({
        name: editingData.name.trim(),
        description: editingData.description.trim(),
      });
      resetEditing();
      setShowCreateForm(false);
    } catch (error) {
      // Error handled by hook
    }
  }, [editingData, createCategory]);

  const handleDeleteCategory = useCallback((category) => {
    setCategoryToDelete(category);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete.id);
    } catch (e) {
      // Error toast is already handled in the hook
    } finally {
      setCategoryToDelete(null);
    }
  }, [categoryToDelete, deleteCategory]);

  const resetEditing = useCallback(() => {
    setEditingCategory(null);
    setEditingData({ name: '', description: '' });
  }, []);

  const resetCreateForm = useCallback(() => {
    setShowCreateForm(false);
    setEditingData({ name: '', description: '' });
  }, []);

  return (
    <div className="space-y-6">
      {/* Loading Overlay */}
      {loading && <LoadingPoring fullscreen={true} text="Loading Categories..." />}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-7 via-purple-6 to-purple-5 bg-clip-text text-transparent">
          Category management
        </h2>
        <button 
          onClick={() => setShowCreateForm(true)}
          disabled={creating}
          className="bg-gradient-to-r from-purple-6 to-purple-5 text-light-1 hover:from-purple-7 hover:to-purple-6 inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 whitespace-nowrap"
        >
          {creating ? 'Creating...' : '+ Create category'}
        </button>
      </div>

      {/* Create Category Form */}
      {showCreateForm && (
        <div className="rounded-2xl border-2 border-purple-3 bg-gradient-to-br from-light-1 to-purple-1/10 shadow-xl p-6">
          <h3 className="text-lg font-bold gray-10 mb-4">Create New Category</h3>
          <CategoryForm
            isEditing={false}
            category={null}
            name={editingData.name}
            description={editingData.description}
            onNameChange={(value) => handleDataChange('name', value)}
            onDescriptionChange={(value) => handleDataChange('description', value)}
            onSave={handleCreateCategory}
            onCancel={resetCreateForm}
            isSaving={creating}
            isCreating={true}
          />
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 h-10 rounded-lg border-2 border-purple-3 bg-light-1 px-4 py-2 pl-11 focus:outline-none focus:border-purple-5 transition-all gray-10 font-medium placeholder:text-gray-6"
        />
        <svg className="w-5 h-5 absolute left-3 top-2.5 text-purple-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Desktop Table */}
      <CategoryTable
        categories={categories}
        loading={loading}
        search={search}
        refreshKey={refreshKey}
        editingCategory={editingCategory}
        editingData={editingData}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        onSave={handleSaveCategory}
        onCancel={resetEditing}
        onDataChange={handleDataChange}
        updating={updating}
        deleteId={deleteId}
      />

      {/* Mobile List */}
      <CategoryMobileList
        categories={categories}
        loading={loading}
        search={search}
        refreshKey={refreshKey}
        editingCategory={editingCategory}
        editingData={editingData}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        onSave={handleSaveCategory}
        onCancel={resetEditing}
        onDataChange={handleDataChange}
        updating={updating}
        deleteId={deleteId}
      />

      <DeleteConfirmModal
        open={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}