const UserAvatar = ({ user, size = 'md' }) => {
  // Get initials for avatar
  const initials = user.name
    ?.split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg'
  };

  return (
    <div 
      className={`flex-shrink-0 rounded-full flex items-center justify-center font-bold text-white shadow-md overflow-hidden ${sizeClasses[size]}`}
      style={{
        background: user.avatar ? 'transparent' : (
          user.role === 'admin' 
            ? 'linear-gradient(to bottom right, purple-5, purple-6)' 
            : 'linear-gradient(to bottom right, gray-5, gray-6)'
        )
      }}
    >
      {user.avatar ? (
        <img 
          src={user.avatar} 
          alt={user.name}
          className="w-full h-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
};

export default UserAvatar;
