/**
 * User Stats Component
 * Statistics display for admin users page
 */

import { 
  Users, 
  Shield, 
  UserCheck, 
  UserX,
  TrendingUp,
  Calendar
} from 'lucide-react';

const UserStats = ({ users = [] }) => {
  const stats = {
    total: users.length,
    admins: users.filter(user => user.role === 'admin').length,
    users: users.filter(user => user.role === 'user').length,
    moderators: users.filter(user => user.role === 'moderator').length,
    active: users.filter(user => user.status !== 'inactive').length,
    inactive: users.filter(user => user.status === 'inactive').length
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.total,
      icon: Users,
      color: 'from-blue-5 to-blue-7',
      bgColor: 'bg-blue-1',
      textColor: 'text-blue-7'
    },
    {
      title: 'Admins',
      value: stats.admins,
      icon: Shield,
      color: 'from-red-5 to-red-7',
      bgColor: 'bg-red-1',
      textColor: 'text-red-7'
    },
    {
      title: 'Regular Users',
      value: stats.users,
      icon: UserCheck,
      color: 'from-emerald-5 to-emerald-7',
      bgColor: 'bg-emerald-1',
      textColor: 'text-emerald-7'
    },
    {
      title: 'Moderators',
      value: stats.moderators,
      icon: UserX,
      color: 'from-purple-5 to-purple-7',
      bgColor: 'bg-purple-1',
      textColor: 'text-purple-7'
    },
    {
      title: 'Active Users',
      value: stats.active,
      icon: TrendingUp,
      color: 'from-emerald-5 to-emerald-7',
      bgColor: 'bg-emerald-1',
      textColor: 'text-emerald-7'
    },
    {
      title: 'Inactive Users',
      value: stats.inactive,
      icon: Calendar,
      color: 'from-gray-5 to-gray-7',
      bgColor: 'bg-gray-1',
      textColor: 'text-gray-7'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-6 mb-1">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserStats;
