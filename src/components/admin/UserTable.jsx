import UserTableRow from './UserTableRow';

const UserTable = ({ users, loading, onPromote, onDemote, onDeactivate }) => {
  return (
    <div className="hidden md:block rounded-2xl border-2 border-purple-3 bg-light-1 shadow-xl overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead className="bg-gradient-to-r from-purple-1 to-emerald-1/30 border-b-2 border-purple-3">
          <tr className="text-left text-sm">
            <th className="px-6 py-4 font-bold gray-10 w-48">User</th>
            <th className="px-6 py-4 font-bold gray-10 w-64">Email</th>
            <th className="px-6 py-4 font-bold gray-10 w-24">Role</th>
            <th className="px-6 py-4 font-bold gray-10 w-32"></th>
          </tr>
        </thead>
        <tbody>
          {!loading && users.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center gray-7 font-medium">
                No users found
              </td>
            </tr>
          ) : !loading && Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                onPromote={onPromote}
                onDemote={onDemote}
                onDeactivate={onDeactivate}
              />
            ))
          ) : null}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
