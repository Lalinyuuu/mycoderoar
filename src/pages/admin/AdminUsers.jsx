import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { adminListUsers, adminUpdateUserRole, adminDeleteUser } from '@/services/adminUsers';
import LoadingPoring from '@/components/loading/LoadingPoring';
import ConfirmModal from '@/components/ui/ConfirmModal.jsx';
import UserTable from '@/components/admin/UserTable';
import UserMobileList from '@/components/admin/UserMobileList';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Check if user has admin role before making API call
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      
      if (user) {
        const parsedUser = JSON.parse(user);
        
        if (parsedUser?.role !== 'admin') {
          toast.error('Access denied. Admin role required.');
          setUsers([]);
          setLoading(false);
          return;
        }
      }
      
      const response = await adminListUsers({ limit: 100 });
      
      // Extract users data from response structure
      let usersData = [];
      if (response?.success && response?.data) {
        usersData = response.data.users || response.data || [];
      } else if (response?.users) {
        usersData = response.users;
      } else if (Array.isArray(response)) {
        usersData = response;
      }
      
      setUsers(usersData);
// เพิ่ม delay เพื่อให้ดู Poring animation นานขึ้น
await new Promise(resolve => setTimeout(resolve, 800));
    } catch (error) {
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const onPromote = async (user) => {
    
    setModalConfig({
      title: 'Promote to Admin',
      description: `Are you sure you want to promote ${user.name} to admin? They will have full access to the admin panel.`,
      confirmText: 'Promote',
      isDestructive: false,
      onConfirm: async () => {
        try {
          await adminUpdateUserRole(user.id, { role: 'admin' });
          toast.success(`⚔️ Promoted ${user.name} to admin! ✨`);
          loadUsers();
          setModalConfig(null);
        } catch (error) {
          toast.error('💀 Failed to promote user ⚡');
        }
      }
    });
  };

  const onDeactivate = async (user) => {
    
    setModalConfig({
      title: 'Deactivate User',
      description: `Are you sure you want to deactivate ${user.name}? This action cannot be undone.`,
      confirmText: 'Deactivate',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await adminDeleteUser(user.id);
          toast.success(`⚔️ Deactivated ${user.name} ✨`);
          loadUsers();
          setModalConfig(null);
        } catch (error) {
          toast.error('💀 Failed to deactivate user ⚡');
        }
      }
    });
  };

  const onDemote = async (user) => {
    
    try {
      await adminUpdateUserRole(user.id, { role: 'user' });
      toast.success(`⚔️ Demoted ${user.name} to user ✨`);
      loadUsers();
    } catch (error) {
      toast.error('💀 Failed to demote user ⚡');
    }
  };

  return (
    <>
      <div className="space-y-6">
      {/* Loading Overlay */}
      {loading && <LoadingPoring fullscreen={true} text="Loading Users..." />}
        <h2 className="text-xl sm:text-2xl font-bold text-purple-5">
          Users
        </h2>

        {/* Desktop Table */}
        <UserTable
          users={users}
          loading={loading}
          onPromote={onPromote}
          onDemote={onDemote}
          onDeactivate={onDeactivate}
        />

        {/* Mobile List */}
        <UserMobileList
          users={users}
          loading={loading}
          onPromote={onPromote}
          onDemote={onDemote}
          onDeactivate={onDeactivate}
        />
      </div>

      {modalConfig && (
        <ConfirmModal
          open={true}
          onClose={() => setModalConfig(null)}
          title={modalConfig.title}
          description={modalConfig.description}
          confirmText={modalConfig.confirmText}
          isDestructive={modalConfig.isDestructive}
          onConfirm={modalConfig.onConfirm}
        />
      )}
    </>
  );
}