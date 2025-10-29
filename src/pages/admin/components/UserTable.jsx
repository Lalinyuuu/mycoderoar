/**
 * User Table Component
 * Table display for admin users management
 */

import { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  UserX, 
  UserCheck, 
  MoreVertical,
  Search,
  Filter
} from 'lucide-react';
import IconButton from '@/components/ui/IconButton';

const UserTable = ({
  users = [],
  loading = false,
  onPromote,
  onDeactivate,
  onSearch,
  searchTerm = ''
}) => {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: {
        icon: ShieldCheck,
        color: 'bg-red-1 text-red-7 border-red-2',
        label: 'Admin'
      },
      user: {
        icon: UserCheck,
        color: 'bg-blue-1 text-blue-7 border-blue-2',
        label: 'User'
      },
      moderator: {
        icon: Shield,
        color: 'bg-purple-1 text-purple-7 border-purple-2',
        label: 'Moderator'
      }
    };

    const config = roleConfig[role] || roleConfig.user;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="scale-150">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-1 overflow-hidden">
      {/* Search and Filter Header */}
      <div className="p-6 border-b border-gray-1">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-5 focus:border-transparent"
            />
          </div>
          
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-1 text-gray-7 rounded-xl hover:bg-gray-2 transition-colors duration-200">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-0.5">
            <tr>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-6 uppercase tracking-wider cursor-pointer hover:text-gray-8"
                onClick={() => handleSort('name')}
              >
                User
                {sortField === 'name' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-6 uppercase tracking-wider cursor-pointer hover:text-gray-8"
                onClick={() => handleSort('email')}
              >
                Email
                {sortField === 'email' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-6 uppercase tracking-wider cursor-pointer hover:text-gray-8"
                onClick={() => handleSort('role')}
              >
                Role
                {sortField === 'role' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-6 uppercase tracking-wider cursor-pointer hover:text-gray-8"
                onClick={() => handleSort('createdAt')}
              >
                Joined
                {sortField === 'createdAt' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-6 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-1">
            {sortedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-0.5 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-5 to-purple-6 flex items-center justify-center text-white font-semibold">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-9">{user.name}</div>
                      <div className="text-xs text-gray-5">@{user.username}</div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-7">{user.email}</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(user.role)}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-6">
                  {formatDate(user.createdAt)}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    {user.role !== 'admin' && (
                      <IconButton
                        onClick={() => onPromote(user)}
                        icon={<ShieldCheck />}
                        variant="ghost"
                        size="md"
                        tooltip="Promote to Admin"
                        className="text-blue-6 hover:text-blue-7"
                      />
                    )}
                    
                    <IconButton
                      onClick={() => onDeactivate(user)}
                      icon={<UserX />}
                      variant="ghost"
                      size="md"
                      tooltip="Deactivate User"
                      className="text-red-6 hover:text-red-7"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {users.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-1 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-gray-4" />
          </div>
          <h3 className="text-lg font-semibold text-gray-9 mb-2">No users found</h3>
          <p className="text-gray-6">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default UserTable;
