import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { normalizeAuthor, formatLongDate, toISO, truncateText, getCategoryColor, formatViewCount } from '../../utils/blogCardHelpers';
import { followUser, unfollowUser } from '@/api_services/follow';
import { useFollow } from '@/contexts/FollowContext';
import { useImageWithFallback } from '../../hooks/useImageWithFallback';
import BlogCardActions from './BlogCardActions';

const BlogCardTimeline = ({
  id,
  image,
  category,
  title,
  description,
  author,
  date,
  likes,
  comments,
  views,
  isLiked,
  isSaved,
  tags = [],
  onClick,
  onPostNavigation,
  onLike,
  onSave,
  onComment,
  onShare,
  isLikedState,
  isSavedState,
  likesCount,
  commentsCount,
  isAnimating,
  showCommentModal,
  setShowCommentModal,
  onCommentAdded
}) => {
  const [showAllTags, setShowAllTags] = useState(false);
  const { src, onError } = useImageWithFallback(image);
  const a = normalizeAuthor(author);
  const displayDate = formatLongDate(date);
  const dateISO = toISO(date);
  const truncatedDescription = truncateText(description, 120);
  
  // Handle category as object or string
  const categoryName = typeof category === 'object' 
    ? (category?.name || category?.slug || null) 
    : (category || null);

  // ดึง author ID จากข้อมูล author
  const authorId = a.id || author?.id;

  // Use FollowContext for follow status
  const { 
    checkFollowStatusForUser, 
    updateFollowStatus, 
    getFollowStatus, 
    isLoading: isCheckingStatusFn 
  } = useFollow();
  
  const isCheckingFollow = isCheckingStatusFn ? isCheckingStatusFn(authorId) : false;
  const cachedFollowStatus = getFollowStatus(authorId);
  const [isFollowing, setIsFollowing] = useState(cachedFollowStatus !== undefined ? cachedFollowStatus : false);
  const [isSubmittingFollow, setIsSubmittingFollow] = useState(false);

  // Check follow status on mount - debounced to prevent excessive API calls
  useEffect(() => {
    if (!authorId) return;

    const checkStatus = async () => {
      try {
        const result = await checkFollowStatusForUser(authorId);
        if (result !== undefined) {
          setIsFollowing(result);
          updateFollowStatus(authorId, result);
        }
           } catch (error) {
             // Silently handle errors to prevent UI blocking
           }
    };

    // Debounce the check to prevent excessive API calls
    const timeoutId = setTimeout(checkStatus, 100);
    return () => clearTimeout(timeoutId);
  }, [authorId, checkFollowStatusForUser, updateFollowStatus]);

  const handleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authorId) {
      toast.error('Author information not available');
      return;
    }

    setIsSubmittingFollow(true);

    try {
      let result;
      if (isFollowing) {
        result = await unfollowUser(authorId);
      } else {
        result = await followUser(authorId);
      }

      if (result.success) {
        const newFollowStatus = !isFollowing;
        setIsFollowing(newFollowStatus);
        
        // Update global follow status
        updateFollowStatus(authorId, newFollowStatus);
        
        // Show success message
        toast.success(newFollowStatus ? 'Followed successfully' : 'Unfollowed successfully');
        
        // If unfollowed, check if we're in FollowFeed context and trigger refresh
        if (!newFollowStatus) {
          const followFeedElement = document.querySelector('.follow-feed');
          const isPostPage = window.location.pathname.includes('/post/');
          const isUserPage = window.location.pathname.includes('/users/');
          const isInFollowFeed = followFeedElement && !isPostPage && !isUserPage;
          
          
          if (isInFollowFeed) {
            // Trigger refresh by reloading the page
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        }
      } else {
        toast.error(result.error || 'Failed to update follow status');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmittingFollow(false);
    }
  };

  return (
    <article className="h-full bg-white rounded-2xl border border-gray-2 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-purple-3 transition-all duration-300 group w-full mx-auto max-w-xl sm:max-w-2xl lg:max-w-3xl card-hover-glow">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="relative group/avatar">
              <img
                src={a.avatar || "/images/avatar/avartar-default.png"}
                alt={a.name}
                className="w-10 h-10 rounded-full object-cover transition-transform group-hover/avatar:scale-110 cursor-pointer"
                onError={(e) => {
                  e.target.src = "/images/avatar/avartar-default.png";
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white transition-transform group-hover/avatar:scale-125"></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-9">{a.name}</h3>
              <div className="flex items-center gap-2">
                {categoryName && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all hover:scale-110 cursor-pointer ${getCategoryColor(categoryName)}`}>
                    {categoryName}
                  </span>
                )}
                <time className="text-xs text-gray-6" dateTime={dateISO}>
                  {displayDate}
                </time>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleFollow}
            disabled={isSubmittingFollow || isCheckingFollow}
            className={`px-4 py-2 rounded-xl border-2 transition-all duration-200 font-medium hover:scale-105 active:scale-95 ${
              isFollowing
                ? 'bg-purple-6 border-purple-6 text-white hover:bg-purple-7 hover:border-purple-7'
                : 'bg-purple-1 border-purple-3 text-purple-7 hover:bg-purple-2 hover:border-purple-4'
            } ${isSubmittingFollow || isCheckingFollow ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmittingFollow ? '...' : isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* Image */}
        {src && src !== '' && src !== 'undefined' && src !== 'null' && (
          <div onClick={onPostNavigation} className="block cursor-pointer">
            <div className="relative w-full aspect-4/3 overflow-hidden">
                      <img
                        src={src}
                        alt={title}
                        loading="lazy"
                        className="w-full h-full object-contain object-center"
                        onError={onError}
                      />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-4 pb-2 flex-1">
          <h2 
            onClick={onPostNavigation}
            className="text-xl font-bold text-gray-9 mb-2 cursor-pointer hover:text-purple-7 transition-colors duration-200 line-clamp-2"
          >
            {title}
          </h2>
          <p className="text-gray-8 text-sm leading-relaxed mb-3 line-clamp-3">
            {truncatedDescription}
          </p>
          
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(showAllTags ? tags : tags.slice(0, 3)).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-purple-1 text-purple-7 border border-purple-3 hover:bg-purple-2 transition-colors"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && !showAllTags && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowAllTags(true);
                  }}
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-medium rounded-full bg-purple-1 text-purple-7 border border-purple-3 hover:bg-purple-2 hover:border-purple-4 hover:scale-110 transition-all cursor-pointer active:scale-95 shadow-sm hover:shadow-md"
                >
                  +{tags.length - 3} more
                </button>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-4 text-sm text-gray-6">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{likesCount} likes</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{commentsCount} comments</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{formatViewCount(views)} views</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {categoryName && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(categoryName)}`}>
                {categoryName}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-4 pb-4">
          <BlogCardActions
            isLikedState={isLikedState}
            isSavedState={isSavedState}
            isAnimating={isAnimating}
            onLike={onLike}
            onComment={onComment}
            onShare={onShare}
            onSave={onSave}
            showLabels={true}
          />
        </div>
      </div>
    </article>
  );
};

export default BlogCardTimeline;