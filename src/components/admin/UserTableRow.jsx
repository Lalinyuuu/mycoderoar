import UserAvatar from './UserAvatar';
import UserRoleBadge from './UserRoleBadge';
import UserActions from './UserActions';

const UserTableRow = ({ user, onPromote, onDemote, onDeactivate }) => {
  return (
    <tr className="border-b border-purple-2 hover:bg-purple-1/30 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <UserAvatar user={user} size="sm" />
          <span className="font-bold gray-10">{user.name}</span>
        </div>
      </td>
      <td className="px-6 py-4 gray-8 font-medium">{user.email}</td>
      <td className="px-6 py-4">
        <UserRoleBadge role={user.role} />
      </td>
      <td className="px-6 py-4">
        <UserActions 
          user={user} 
          onPromote={onPromote} 
          onDemote={onDemote} 
          onDeactivate={onDeactivate} 
        />
      </td>
    </tr>
  );
};

export default UserTableRow;
