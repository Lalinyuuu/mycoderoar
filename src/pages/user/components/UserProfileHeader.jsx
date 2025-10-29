/**
 * User Profile Header Component
 * Header section with user info and follow actions
 */

import { useState } from 'react';
import FollowButton from '@/components/follow/FollowButton';
import FollowStats from '@/components/follow/FollowStats';

const UserProfileHeader = ({
  user,
  currentUser,
  onFollow,
  onUnfollow,
  isFollowing = false,
  followLoading = false
}) => {
  const [imageError, setImageError] = useState(false);

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: {
        color: 'bg-red-1 text-red-7 border-red-2',
        label: 'Admin'
      },
      moderator: {
        color: 'bg-purple-1 text-purple-7 border-purple-2',
        label: 'Moderator'
      },
      user: {
        color: 'bg-blue-1 text-blue-7 border-blue-2',
        label: 'User'
      }
    };

    const config = roleConfig[role] || roleConfig.user;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-1 p-8 mb-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar and Basic Info */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-5 to-purple-6 flex items-center justify-center">
              {!imageError && user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            
            {/* Online indicator */}
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-5 border-2 border-white rounded-full"></div>
          </div>

          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-9">{user.name}</h1>
              {getRoleBadge(user.role)}
            </div>
            
            <p className="text-gray-6 mb-2">@{user.username}</p>
            
            {user.bio && (
              <p className="text-gray-7 mb-3 max-w-md">{user.bio}</p>
            )}
            
            <p className="text-sm text-gray-5">
              Joined {formatJoinDate(user.createdAt)}
            </p>
          </div>
        </div>

        {/* Follow Actions and Stats */}
        <div className="flex flex-col md:items-end gap-4 ml-auto">
          {/* Follow Button */}
          {currentUser && currentUser.id !== user.id && (
            <FollowButton
              userId={user.id}
              isFollowing={isFollowing}
              onFollow={onFollow}
              onUnfollow={onUnfollow}
              loading={followLoading}
              size="sm"
              className="!bg-purple-6 !text-white hover:!bg-purple-7"
            />
          )}

          {/* Follow Stats */}
          <FollowStats
            userId={user.id}
            followersCount={user.followersCount || 0}
            followingCount={user.followingCount || 0}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
