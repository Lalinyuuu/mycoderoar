import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Camera } from 'lucide-react';
import api from '@/services/api';
import { toast } from 'sonner';
import AvatarUpload from '@/components/upload/AvatarUpload';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
      });
    }
  }, [user]);

  const validate = () => {
    const err = {};
    if (!formData.name.trim()) err.name = "Name is required";
    if (!formData.username.trim()) err.username = "Username is required";
    else if (formData.username.length < 3) err.username = "Username must be at least 3 characters";
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) err.username = "Username can only contain letters, numbers and underscore";
    
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await api.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update user ใน context และ localStorage
      updateUser(res.data.user);

      toast.success('Profile updated successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update profile';
      setErrors({ username: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto bg-light-1 min-h-screen p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-purple-5">Profile Settings</h1>

      <div className="bg-light-1 rounded-xl shadow-sm border-2 border-purple-3 p-4 md:p-8">
        {/* Avatar Section */}
        <div className="flex items-start gap-3 md:gap-6 mb-8 pb-8 border-b border-light-3">
          <AvatarUpload
            currentAvatar={user.avatar}
            onUploadSuccess={async (result) => {
              
              // Dismiss any existing toasts first
              toast.dismiss();
              
              // Handle avatar removal
              if (result.removed) {
                try {
                  const { data } = await api.put('/api/auth/profile', { avatar: null });
                  updateUser(data.user || { ...user, avatar: null });
                  toast.success('Avatar removed successfully!');
                } catch (e) {
                  updateUser({ ...user, avatar: null });
                  toast.warning('Removed locally. Could not persist to server.');
                }
                return;
              }
              
              // Handle avatar upload
              const newAvatarUrl = result.url || result.imageUrl;
              
              try {
                // Persist avatar to backend, then sync context
                const { data } = await api.put('/api/auth/profile', { avatar: newAvatarUrl });
                updateUser(data.user || { ...user, avatar: newAvatarUrl });
                toast.success('Avatar updated successfully!');
              } catch (e) {
                // Fall back to local update if API fails
                updateUser({ ...user, avatar: newAvatarUrl });
                toast.warning('Saved locally. Could not persist to server.');
              }
            }}
            onUploadError={(error) => {
              toast.error(`Upload failed: ${error.message}`);
            }}
            size="md"
            className="flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-base md:text-xl font-semibold text-dark-1 break-words">{user.name}</h2>
            <p className="text-xs md:text-base text-dark-3 break-words">@{user.username}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-purple-2 text-purple-8 text-xs font-medium rounded-full">
              {user.role}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: '' });
              }}
              label="Name"
              required
              size="lg"
              error={errors.name}
            />
          </div>

          <div>
            <Input
              type="text"
              value={formData.username}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
                setErrors({ ...errors, username: '' });
              }}
              label="Username"
              required
              size="lg"
              error={errors.username}
              helperText="Username must be unique"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold gray-10 mb-2">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              readOnly
              disabled
              className="w-full px-4 py-3 border-2 border-gray-3 rounded-lg bg-light-2 gray-7 cursor-not-allowed font-medium"
            />
            <p className="mt-2 text-sm gray-7">Email cannot be changed</p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            variant="primary"
            size="lg"
            className="w-full"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
}