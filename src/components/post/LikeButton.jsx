import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { likePost, unlikePost } from '@/api_services/likeService'; // ✅ Use likeService API

export default function LikeButton({ 
  postId, 
  initialLiked = false, 
  initialLikes = 0,
  onLikeChange
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update state when props change
  useEffect(() => {
    setLiked(initialLiked);
    setLikesCount(initialLikes);
  }, [postId, initialLiked, initialLikes]);

  const handleLike = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setLoading(true);
    
    // Trigger animation
    setIsAnimating(true);
    // Use requestAnimationFrame for smooth animation
    requestAnimationFrame(() => {
      setIsAnimating(false);
    });
    
    // Optimistic update
    const newLiked = !liked;
    const newCount = newLiked ? likesCount + 1 : likesCount - 1;
    setLiked(newLiked);
    setLikesCount(newCount);
    onLikeChange?.(newLiked, newCount);

    try {
      if (liked) {
        // User wants to unlike
        const result = await unlikePost(postId);
        if (result.success) {
          toast.success('Unliked');
        } else {
          // Revert on error
          setLiked(true);
          setLikesCount(likesCount);
          onLikeChange?.(true, likesCount);
          toast.error(result.error || 'Failed to unlike');
        }
      } else {
        // User wants to like
        const result = await likePost(postId);
        if (result.success) {
          toast.success('Liked');
        } else {
          // Revert on error
          setLiked(false);
          setLikesCount(likesCount);
          onLikeChange?.(false, likesCount);
          toast.error(result.error || 'Failed to like');
        }
      }
    } catch (error) {
      // Revert on error
      setLiked(!newLiked);
      setLikesCount(likesCount);
      onLikeChange?.(!newLiked, likesCount);
      toast.error('Failed to update like status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all duration-200 font-medium ${
          liked
            ? 'bg-purple-6 border-purple-7 text-white hover:bg-purple-7 hover:border-purple-8 shadow-md'
            : 'bg-white border-gray-3 text-gray-6 hover:bg-purple-1 hover:border-purple-4 hover:text-purple-6'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <svg 
          className={`w-5 h-5 transition-all ${liked ? 'fill-current' : ''} ${isAnimating ? 'animate-heart-pop' : ''}`} 
          fill={liked ? 'currentColor' : 'none'} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span className={`text-sm font-semibold ${isAnimating ? 'animate-pulse' : ''}`}>
          {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
        </span>
      </button>

      {/* Login/Signup Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-dark-1/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-light-1 dark:bg-gray-9 rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200">
            {/* Close button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 gray-6 hover:gray-9 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-6 to-pink-5 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-light-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold gray-10 dark:text-light-1 mb-2">
                Show Some Love
              </h3>
              <p className="gray-6 dark:gray-4 text-sm">
                Sign in to like posts and support content creators
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  navigate('/login');
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-6 to-purple-5 text-light-1 rounded-xl font-semibold hover:from-purple-7 hover:to-purple-6 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  navigate('/signup');
                }}
                className="w-full px-6 py-3 bg-light-1 dark:bg-gray-8 text-purple-6 dark:text-purple-4 border-2 border-purple-3 rounded-xl font-semibold hover:bg-purple-1 dark:hover:bg-gray-7 transition-all"
              >
                Create Account
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs gray-5 dark:gray-5">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}