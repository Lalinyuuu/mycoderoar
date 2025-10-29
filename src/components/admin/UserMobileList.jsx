import UserCard from './UserCard';

const UserMobileList = ({ users, loading, onPromote, onDemote, onDeactivate }) => {
  return (
    <div className="md:hidden space-y-3">
      {!loading && users.length === 0 ? (
        <div className="text-center py-16 bg-light-1 rounded-2xl border-2 border-purple-3">
          <div className="text-5xl mb-3">👥</div>
          <div className="font-bold gray-10 mb-2">No users found</div>
          <div className="text-sm gray-7 font-medium">
            Users will appear here once registered.
          </div>
        </div>
      ) : !loading && Array.isArray(users) && users.length > 0 ? (
        users.map((user) => (
          <UserCard
            key={`${user.id}-mobile`}
            user={user}
            onPromote={onPromote}
            onDemote={onDemote}
            onDeactivate={onDeactivate}
          />
        ))
      ) : null}
    </div>
  );
};

export default UserMobileList;
