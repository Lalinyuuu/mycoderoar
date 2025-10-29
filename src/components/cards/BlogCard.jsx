import { useEffect, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useBlogCardState } from '@/hooks';
import { BlogCardTimeline, BlogCardDefault, CommentModal } from '@/components';

const BlogCard = ({
  id,
  image,
  category,
  title,
  description,
  author,
  date,
  likes = 0,
  comments = 0,
  views = 0,
  tags = [],
  isLiked = false,
  isSaved = false,
  variant = 'default',
  onClick
}) => {

  const navigate = useNavigate();
  
  // Scroll reveal animation
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  // Use custom hook for state management
  const {
    isLikedState,
    isSavedState,
    likesCount,
    commentsCount,
    isAnimating,
    showCommentModal,
    setShowCommentModal,
    handleLike,
    handleSave,
    handleComment,
    handleShare,
    handleCommentAdded
  } = useBlogCardState(id, likes, comments, isLiked, isSaved);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showCommentModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showCommentModal]);

  // Handle post navigation - optimized to prevent blocking
  const handlePostNavigation = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Store currentTarget reference before async operations
    const currentTarget = e.currentTarget;
    
    // Prevent multiple clicks
    if (currentTarget.dataset.navigating === 'true') {
      return;
    }
    
    // Set navigating flag immediately
    currentTarget.dataset.navigating = 'true';
    
    // Use requestIdleCallback to defer heavy operations
    const performNavigation = () => {
      try {
        // Store current page info for back navigation
        const currentPage = {
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash,
          timestamp: Date.now()
        };
        
        // Navigate to post with state
        navigate(`/post/${id}`, { 
          state: { 
            post: {
              id,
              image,
              category,
              title,
              description,
              author,
              date,
              likes: likesCount,
              comments: commentsCount,
              views,
              isLiked: isLikedState,
              isSaved: isSavedState
            },
            fromPage: currentPage
          },
          replace: false // Allow back button to work
        });
        
        // Reset after a short delay
        setTimeout(() => {
          if (currentTarget) {
            currentTarget.dataset.navigating = 'false';
          }
        }, 1000);
           } catch (error) {
             if (currentTarget) {
               currentTarget.dataset.navigating = 'false';
             }
           }
    };

    // Use requestIdleCallback if available, otherwise use setTimeout
    if (window.requestIdleCallback) {
      window.requestIdleCallback(performNavigation, { timeout: 100 });
    } else {
      setTimeout(performNavigation, 0);
    }
  }, [navigate, id, image, category, title, description, author, date, likesCount, commentsCount, views, isLikedState, isSavedState]);

  // Prepare props for variants with fallbacks
  const commonProps = {
    id: id || 'unknown',
    image: image || '/images/placeholder.jpg',
    category: category || 'General',
    title: title || 'Draft Post',
    description: description || 'No description available',
    author: author || 'Unknown Author',
    date: date || new Date().toISOString(),
    likes: likes || 0,
    comments: comments || 0,
    views: views || 0,
    tags: tags || [],
    isLiked: isLiked || false,
    isSaved: isSaved || false,
    onClick,
    onPostNavigation: handlePostNavigation,
    onLike: handleLike,
    onSave: handleSave,
    onComment: handleComment,
    onShare: handleShare,
    isLikedState,
    isSavedState,
    likesCount,
    commentsCount,
    isAnimating,
    showCommentModal,
    setShowCommentModal,
    onCommentAdded: handleCommentAdded
  };

  return (
    <>
      <div 
        ref={ref}
        className={`transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {variant === 'timeline' ? (
          <BlogCardTimeline {...commonProps} />
        ) : (
          <BlogCardDefault {...commonProps} />
        )}
      </div>
      
      {/* Comment Modal */}
      {showCommentModal && (
        <CommentModal
          isOpen={showCommentModal}
          postId={id}
          postTitle={title}
          onClose={() => setShowCommentModal(false)}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </>
  );
};

// Memoized component for better performance
const MemoizedBlogCard = memo(BlogCard, (prevProps, nextProps) => {
  // Custom comparison function for better memoization
  return (
    prevProps.id === nextProps.id &&
    prevProps.title === nextProps.title &&
    prevProps.description === nextProps.description &&
    prevProps.likes === nextProps.likes &&
    prevProps.comments === nextProps.comments &&
    prevProps.views === nextProps.views &&
    prevProps.isLiked === nextProps.isLiked &&
    prevProps.isSaved === nextProps.isSaved &&
    prevProps.variant === nextProps.variant
  );
});

MemoizedBlogCard.displayName = 'BlogCard';

export default MemoizedBlogCard;