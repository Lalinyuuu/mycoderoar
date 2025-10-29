import UserAvatar from './UserAvatar';
import UserRoleBadge from './UserRoleBadge';
import UserActions from './UserActions';

const UserCard = ({ user, onPromote, onDemote, onDeactivate }) => {
  return (
    <div className="bg-light-1 rounded-xl border-2 border-purple-3 p-4 shadow-md hover:shadow-lg hover:border-purple-4 transition-all">
      {/* Header: Avatar + Name + Role Badge */}
      <div className="flex items-start gap-3 mb-3">
        <UserAvatar user={user} size="md" />
        
        {/* Name + Email */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold gray-10 text-base truncate">
            {user.name}
          </h3>
          <p className="text-sm gray-7 truncate">
            {user.email}
          </p>
        </div>

        {/* Role Badge */}
        <div className="flex-shrink-0">
          <UserRoleBadge role={user.role} variant="mobile" />
        </div>
      </div>

      {/* Actions */}
      <UserActions 
        user={user} 
        onPromote={onPromote} 
        onDemote={onDemote} 
        onDeactivate={onDeactivate} 
        variant="mobile"
      />
    </div>
  );
};

export default UserCard;
