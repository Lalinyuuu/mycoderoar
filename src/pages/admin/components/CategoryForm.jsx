/**
 * Category Form Component
 * Form for creating and editing categories
 */

import { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

const CategoryForm = ({
  isOpen,
  onClose,
  onSubmit,
  editingCategory = null,
  loading = false
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name || '');
      setDescription(editingCategory.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [editingCategory, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim()
    });
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-9">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h3>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-1 rounded-xl transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
                label="Category Name"
                required
                size="lg"
                disabled={loading}
              />
            </div>

            <div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter category description (optional)"
                rows={3}
                label="Description"
                size="lg"
                disabled={loading}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <Button
                type="button"
                onClick={handleClose}
                variant="secondary"
                size="lg"
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                disabled={!name.trim() || loading}
                loading={loading}
                variant="primary"
                size="lg"
                icon={editingCategory ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                className="flex-1"
              >
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
