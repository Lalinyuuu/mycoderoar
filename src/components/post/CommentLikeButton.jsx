import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { likeComment, unlikeComment } from '@/api_services/interactions';
import { useAuth } from '@/contexts/AuthContext';

// Heart Icon SVG (Heroicons outline/solid toggle)
const HeartIcon = ({ filled, className = '' }) => (
  filled ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`w-5 h-5 ${className}`}
    >
      <path d="M11.999 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54l-1.45 1.31z" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-5 h-5 ${className}`}
    >
      <path d="M20.84 4.61c-1.17-1.09-2.72-1.61-4.28-1.46-1.44.14-2.79.86-3.78 2.05C11.22 4.01 9.87 3.29 8.43 3.15 6.87 3 5.32 3.52 4.15 4.61c-1.5 1.4-2.18 3.42-1.79 5.38.82 4.05 5.1 7.09 8.88 10.28l.76.65.76-.65c3.78-3.19 8.06-6.23 8.88-10.28.39-1.96-.29-3.98-1.78-5.38z" />
    </svg>
  )
);

/**
 * CommentLikeButton displays a heart icon + like count.
 * It performs optimistic UI updates and falls back if API call fails.
 */
export default function CommentLikeButton({ commentId, initialLiked = false, initialLikes = 0, onChange }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  // Update state when props change (e.g., after page refresh)
  useEffect(() => {
    setLiked(initialLiked);
    setLikesCount(initialLikes);
  }, [initialLiked, initialLikes]);

  const toggleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like comments');
      return;
    }
    if (loading) return;

    // Check if commentId is valid
    if (!commentId || commentId === 'undefined') {
      toast.error('Invalid comment ID');
      return;
    }

    const optimisticLiked = !liked;
    const optimisticCount = likesCount + (optimisticLiked ? 1 : -1);


    // optimistic update
    setLiked(optimisticLiked);
    setLikesCount(optimisticCount);
    setLoading(true);

    const apiFn = optimisticLiked ? likeComment : unlikeComment;
    
    const result = await apiFn(commentId);
    const { success, error } = result;

    if (!success) {
      // revert on error
      setLiked(liked);
      setLikesCount(likesCount);
      toast.error(error || 'Failed to update like');
    } else {
      if (onChange) {
        onChange({ liked: optimisticLiked, likesCount: optimisticCount });
      }
    }

    setLoading(false);
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`group flex items-center space-x-1 text-sm font-medium transition-colors focus:outline-none ${liked ? 'error' : 'gray-5 dark:gray-4 hover:error'}`}
    >
      <HeartIcon filled={liked} className="transition-transform group-active:scale-90" />
      {likesCount > 0 && <span>{likesCount}</span>}
    </button>
  );
}
