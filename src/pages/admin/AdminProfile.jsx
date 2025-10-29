import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api.js';
import AvatarUpload from '@/components/upload/AvatarUpload';

export default function AdminProfile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    avatar: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: updatedUser } = await api.put('/api/auth/profile', formData);
      updateUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-7 via-purple-6 to-purple-5 bg-clip-text text-transparent">
        Profile
      </h2>

      <div className="rounded-2xl border-2 border-purple-3 bg-light-1 shadow-xl p-4 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <AvatarUpload
              currentAvatar={formData.avatar}
              onUploadSuccess={async (result) => {
                // Dismiss any existing toasts first
                toast.dismiss();
                
                // Handle avatar removal
                if (result.removed) {
                  try {
                    const { data } = await api.put('/api/auth/profile', { avatar: null });
                    setFormData(prev => ({ ...prev, avatar: null }));
                    updateUser(data.user || { ...user, avatar: null });
                    toast.success('Avatar removed successfully!');
                  } catch (e) {
                    setFormData(prev => ({ ...prev, avatar: null }));
                    updateUser({ ...user, avatar: null });
                    toast.warning('Removed locally. Could not persist to server.');
                  }
                  return;
                }
                
                // Handle avatar upload
                const newAvatarUrl = result.url || result.imageUrl;
                try {
                  const { data } = await api.put('/api/auth/profile', { avatar: newAvatarUrl });
                  setFormData(prev => ({ ...prev, avatar: newAvatarUrl }));
                  updateUser(data.user || { ...user, avatar: newAvatarUrl });
                  toast.success('Avatar updated successfully!');
                } catch (e) {
                  setFormData(prev => ({ ...prev, avatar: newAvatarUrl }));
                  updateUser({ ...user, avatar: newAvatarUrl });
                  toast.warning('Saved locally. Could not persist to server.');
                }
              }}
              onUploadError={(error) => {
                toast.error(`Upload failed: ${error.message}`);
              }}
              size="lg"
              className="flex-shrink-0"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold gray-10 mb-2">Profile Picture</h3>
              <p className="text-sm gray-7 font-medium">
                Upload a new profile picture. JPG, PNG, GIF, or WebP up to 5MB.
              </p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-bold gray-10 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border-2 border-purple-3 px-4 py-2.5 focus:outline-none focus:border-purple-5 transition-colors bg-light-1 gray-9 font-medium"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-bold gray-10 mb-2">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full rounded-lg border-2 border-purple-3 px-4 py-2.5 focus:outline-none focus:border-purple-5 transition-colors bg-light-1 gray-9 font-medium"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold gray-10 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full rounded-lg border-2 border-purple-2 px-4 py-2.5 bg-purple-1/30 gray-7 cursor-not-allowed font-medium"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-bold gray-10 mb-2">
              Bio (max 120 letters)
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value.slice(0, 120) })}
              rows={4}
              className="w-full rounded-lg border-2 border-purple-3 px-4 py-2.5 focus:outline-none focus:border-purple-5 transition-colors resize-none bg-gradient-to-br from-light-1 to-purple-1/10 gray-10 font-medium placeholder:gray-6"
              placeholder="Tell us about yourself..."
            />
            <div className="text-xs gray-7 mt-1 font-medium">
              {formData.bio.length}/120 characters
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-gradient-to-r from-purple-6 to-purple-5 px-6 py-3 font-bold text-white hover:from-purple-7 hover:to-purple-6 hover:scale-105 disabled:opacity-50 transition-all shadow-md"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}