import { useState } from 'react';
import { toast } from 'sonner';
import api from '@/services/api.js';

export default function AdminResetPassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setShowModal(true);
  };

  const confirmReset = async () => {
    setSaving(true);
    setShowModal(false);

    try {
      await api.put('/api/auth/reset-password', {
        currentPassword,
        newPassword
      });

      toast.success('Password reset successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'Failed to reset password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-7 via-purple-6 to-purple-5 bg-clip-text text-transparent">
        Reset password
      </h2>

      <div className="overflow-hidden rounded-2xl border-2 border-purple-3 bg-light-1 shadow-xl p-4 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          <div>
            <label className="block text-sm font-bold gray-10 mb-2">
              Current password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg border-2 border-purple-3 bg-light-1 px-4 py-2.5 focus:outline-none focus:border-purple-5 transition-colors gray-10 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold gray-10 mb-2">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border-2 border-purple-3 bg-light-1 px-4 py-2.5 focus:outline-none focus:border-purple-5 transition-colors gray-10 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold gray-10 mb-2">
              Confirm new password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border-2 border-purple-3 bg-light-1 px-4 py-2.5 focus:outline-none focus:border-purple-5 transition-colors gray-10 font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-purple-6 to-purple-5 hover:from-purple-7 hover:to-purple-6 rounded-full px-6 py-3 font-bold text-white transition-all disabled:opacity-50 hover:scale-105 shadow-md"
          >
            {saving ? 'Resetting...' : 'Reset password'}
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-emerald-2 to-purple-3/60 rounded-2xl p-6 max-w-md w-full shadow-2xl border-2 border-purple-3">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-purple-7">Reset password</h3>
              <button
                onClick={() => setShowModal(false)}
                className="gray-6 hover:text-purple-8 hover:bg-purple-2 transition-colors rounded-full p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-light-1 font-medium mb-6">
              Do you want to reset your password?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-full border-2 border-purple-3 bg-light-1 px-6 py-2.5 text-sm font-bold gray-8 hover:bg-purple-1 hover:border-purple-5 hover:text-purple-8 transition-all shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 rounded-full bg-gradient-to-r from-purple-6 to-purple-5 px-6 py-2.5 text-sm font-bold text-white hover:from-purple-7 hover:to-purple-6 transition-all shadow-md"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}