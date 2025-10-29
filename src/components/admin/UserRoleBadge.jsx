const UserRoleBadge = ({ role, variant = 'default' }) => {
  const isAdmin = role === 'admin';
  
  if (variant === 'mobile') {
    return (
      <span 
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
          isAdmin ? 'text-white' : 'gray-9'
        }`}
        style={{
          background: isAdmin
            ? 'linear-gradient(to right, purple-5, purple-6)'
            : 'linear-gradient(to right, gray-4, gray-5)'
        }}
      >
        {isAdmin ? (
          <>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            ADMIN
          </>
        ) : (
          <>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            USER
          </>
        )}
      </span>
    );
  }

  return (
    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${
      isAdmin 
        ? 'bg-gradient-to-r from-purple-5 to-purple-6 text-light-1' 
        : 'bg-gradient-to-r from-gray-4 to-gray-5 gray-9'
    }`}>
      {role}
    </span>
  );
};

export default UserRoleBadge;
