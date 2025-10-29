import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getFollowers, getFollowing } from '@/api_services/follow';
import FollowButton from './FollowButton';

const FollowList = ({ 
  type = 'followers', // 'followers' or 'following'
  className = '',
  limit = 20
}) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (userId) {
      fetchUsers();
    }
  }, [userId, currentPage, type]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = type === 'followers' 
        ? await getFollowers(userId, { page: currentPage, limit })
        : await getFollowing(userId, { page: currentPage, limit });
      
      if (result.success) {
        setUsers(result.data.users || []);
        setPagination(result.data.pagination);
      } else {
        setError(result.error || `Failed to load ${type}`);
        toast.error(result.error || `Failed to load ${type}`);
      }
    } catch (error) {
      setError(`Failed to load ${type}`);
      toast.error(`Failed to load ${type}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (pagination && currentPage < pagination.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleUserClick = (user) => {
    navigate(`/users/${user.id}`);
  };

  const handleFollowChange = (userId, isFollowing) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, isFollowing }
          : user
      )
    );
  };

  if (isLoading && users.length === 0) {
    return (
      <div className={`follow-list loading ${className}`}>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border rounded-lg animate-pulse">
              <div className="w-12 h-12 bg-gray-2 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-2 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-1 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-8 bg-gray-2 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className={`follow-list error ${className}`}>
        <div className="text-center py-12">
          <div className="error mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-9 mb-2">Failed to load {type}</h3>
          <p className="text-gray-6 mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="bg-purple-6 text-white px-6 py-2 rounded-full hover:bg-purple-7 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className={`follow-list empty ${className}`}>
        <div className="text-center py-12">
          <div className="gray-4 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-9 mb-2">
            No {type} yet
          </h3>
          <p className="text-gray-6">
            {type === 'followers' 
              ? 'This user doesn\'t have any followers yet.'
              : 'This user is not following anyone yet.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`follow-list ${className}`}>
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-4 p-4 border border-gray-2 rounded-lg hover:border-purple-3 hover:shadow-md transition-all cursor-pointer"
            onClick={() => handleUserClick(user)}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-2"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-purple-2 border-2 border-purple-4 flex items-center justify-center">
                  <span className="text-purple-7 font-bold text-lg">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-9 truncate">
                {user.name}
              </h3>
              <p className="text-sm text-gray-6 truncate">
                @{user.username}
              </p>
              {user.bio && (
                <p className="text-sm text-gray-6 mt-1 line-clamp-2">
                  {user.bio}
                </p>
              )}
            </div>

            {/* Follow Button */}
            <div className="flex-shrink-0">
              <FollowButton
                userId={user.id}
                initialIsFollowing={user.isFollowing}
                onFollowChange={(isFollowing) => handleFollowChange(user.id, isFollowing)}
                size="sm"
                showIcon={false}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {pagination && currentPage < pagination.totalPages && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="bg-purple-6 text-white px-8 py-3 rounded-full hover:bg-purple-7 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* Pagination Info */}
      {pagination && (
        <div className="text-center mt-4 text-sm text-gray-6">
          Showing {users.length} of {pagination.total} {type}
        </div>
      )}
    </div>
  );
};

export default FollowList;
