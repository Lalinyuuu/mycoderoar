const UserActions = ({ user, onPromote, onDemote, onDeactivate, variant = 'default' }) => {
  if (variant === 'mobile') {
    return (
      <div className="flex items-center gap-2 pt-3 border-t border-purple-2">
        {user.role === 'admin' ? (
          <button
            onClick={() => onDemote(user)}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 border-2 border-gray-5 gray-8 rounded-lg font-bold text-sm hover:bg-gray-4 hover:border-gray-6 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Demote
          </button>
        ) : (
          <button
            onClick={() => onPromote(user)}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-light-1 rounded-lg font-bold text-sm transition-all shadow-md hover:shadow-lg hover:brightness-110 bg-gradient-to-r from-emerald-5 to-emerald-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Promote
          </button>
        )}
        <button
          onClick={() => onDeactivate(user)}
          className="px-4 py-2.5 border-2 border-error text-error rounded-lg font-bold text-sm hover:bg-pink-1 transition-all flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          Deactivate
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {user.role === 'admin' ? (
        <button
          onClick={() => onDemote(user)}
          className="px-3 py-1.5 rounded-full border-2 border-gray-5 text-xs font-bold gray-8 hover:bg-gray-4 hover:border-gray-6 transition-all shadow-sm whitespace-nowrap"
        >
          Demote
        </button>
      ) : (
        <button
          onClick={() => onPromote(user)}
          className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-5 to-emerald-6 text-xs font-bold text-white hover:from-emerald-6 hover:to-emerald-7 transition-all shadow-md whitespace-nowrap"
        >
          Promote
        </button>
      )}
      <button
        onClick={() => onDeactivate(user)}
        className="px-3 py-1.5 rounded-full border-2 border-error text-xs font-bold text-error hover:bg-pink-1 transition-all shadow-sm whitespace-nowrap"
      >
        Deactivate
      </button>
    </div>
  );
};

export default UserActions;
