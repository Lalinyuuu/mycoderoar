import React from 'react';

/**
 * Normalizes various possible API shapes for a comment's author
 */
export const getAuthorObject = (comment) => {
  if (!comment) return {};

  const authorFromKnownKeys = comment.author || comment.user || comment.owner || {};

  const nameFromFallbacks =
    authorFromKnownKeys.name ||
    authorFromKnownKeys.displayName ||
    comment.authorName ||
    comment.userName ||
    comment.username ||
    comment.name ||
    '';

  const avatarFromFallbacks =
    authorFromKnownKeys.avatar ||
    authorFromKnownKeys.photo ||
    authorFromKnownKeys.image ||
    comment.authorAvatar ||
    comment.userAvatar ||
    comment.avatar ||
    null;

  const idFromFallbacks =
    authorFromKnownKeys.id ||
    authorFromKnownKeys._id ||
    comment.userId ||
    comment.authorId ||
    comment.ownerId ||
    undefined;

  return { id: idFromFallbacks, name: nameFromFallbacks, avatar: avatarFromFallbacks };
};

export default function AuthorDisplay({ 
  comment, 
  size = 'md', 
  showBadge = true,
  className = '' 
}) {
  const author = getAuthorObject(comment);
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-xs', 
    lg: 'w-10 h-10 text-sm'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gray-3 dark:bg-gray-6 rounded-full flex items-center justify-center flex-shrink-0 ${className}`}>
      {author.avatar ? (
        <img
          src={author.avatar}
          alt={author.name || 'User'}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <span className={`font-medium text-gray-6 dark:gray-3`}>
          {(author.name || 'U')?.charAt(0)?.toUpperCase() || 'U'}
        </span>
      )}
    </div>
  );
}

export function AuthorInfo({ 
  comment, 
  showBadge = true, 
  showTime = true,
  timeFormat = 'both',
  className = '' 
}) {
  const author = getAuthorObject(comment);
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-semibold text-gray-9 dark:text-white text-sm">
        {author.name || 'Anonymous'}
      </span>
      {showBadge && comment.author?.badge && (
        <span className="px-2 py-1 text-xs font-medium text-white bg-purple-6 rounded-full">
          {typeof comment.author.badge === 'object' 
            ? comment.author.badge.name || comment.author.badge.slug 
            : comment.author.badge
          }
        </span>
      )}
      {showTime && comment.createdAt && (
        <span className="text-xs text-gray-6 dark:text-gray-4">
          {timeFormat === 'both' 
            ? `${formatSmartTime(comment.createdAt, 'en-US')} · ${formatDateTime(comment.createdAt, 'en-US')}`
            : timeFormat === 'smart' 
            ? formatSmartTime(comment.createdAt, 'en-US')
            : formatDateTime(comment.createdAt, 'en-US')
          }
        </span>
      )}
    </div>
  );
}

// Import the date utilities
import { formatSmartTime, formatDateTime } from '@/utils/date.js';
