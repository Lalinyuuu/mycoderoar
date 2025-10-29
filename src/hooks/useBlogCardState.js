import { useState, useEffect } from 'react';
import { PostService } from '@/services';
import { getUserPostStatus, likePost, unlikePost, savePost, unsavePost, addComment, trackView, trackShare } from '@/api_services/interactions';
import { getAllCachedData, saveToCache } from '../utils/postCache';

export function useBlogCardState(postId, initialLikes, initialComments, initialIsLiked, initialIsSaved) {
  const cachedData = getAllCachedData(postId, {
    liked: initialIsLiked,
    saved: initialIsSaved,
    likes: initialLikes,
    comments: initialComments
  });

  const [isLikedState, setIsLikedState] = useState(cachedData.liked);
  const [isSavedState, setIsSavedState] = useState(cachedData.saved);
  const [likesCount, setLikesCount] = useState(cachedData.likes);
  const [commentsCount, setCommentsCount] = useState(cachedData.comments);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);

  // Load user interaction status on mount - debounced to prevent excessive API calls
  useEffect(() => {
    const loadUserStatus = async () => {
      try {
        const result = await getUserPostStatus(postId);
        
        if (result.success && result.data) {
          const status = result.data;
          
          setIsLikedState(status.liked || false);
          setIsSavedState(status.saved || false);
          setLikesCount(status.likesCount || initialLikes);
          setCommentsCount(status.commentsCount || initialComments);
          
          saveToCache(postId, 'liked', status.liked || false);
          saveToCache(postId, 'saved', status.saved || false);
          saveToCache(postId, 'likes', status.likesCount || initialLikes);
          saveToCache(postId, 'comments', status.commentsCount || initialComments);
        }
           } catch (error) {
             // Handle error silently to prevent UI blocking
           }
    };

    // Debounce the API call to prevent excessive requests
    const timeoutId = setTimeout(loadUserStatus, 200);
    return () => clearTimeout(timeoutId);
  }, [postId, initialLikes, initialComments]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAnimating) return;
    
    
    setIsAnimating(true);
    const wasLiked = isLikedState;
    const newLikedState = !wasLiked;
    const newLikesCount = wasLiked ? likesCount - 1 : likesCount + 1;
    
    
    // Optimistic update UI immediately
    setIsLikedState(newLikedState);
    setLikesCount(newLikesCount);
    saveToCache(postId, 'liked', newLikedState);
    saveToCache(postId, 'likes', newLikesCount);
    
    try {
      
      // Call the appropriate function based on current state
      const result = wasLiked ? await unlikePost(postId) : await likePost(postId);
      
      
      if (result.success && result.data) {
        // Use API response data
        const finalLiked = result.data.liked !== undefined ? result.data.liked : newLikedState;
        const finalCount = result.data.likesCount !== undefined ? result.data.likesCount : newLikesCount;
        
        
        setIsLikedState(finalLiked);
        setLikesCount(finalCount);
        saveToCache(postId, 'liked', finalLiked);
        saveToCache(postId, 'likes', finalCount);
      } else {
        // Revert on failure
        setIsLikedState(wasLiked);
        setLikesCount(likesCount);
        saveToCache(postId, 'liked', wasLiked);
        saveToCache(postId, 'likes', likesCount);
      }
    } catch (error) {
      // Revert on error
      setIsLikedState(wasLiked);
      setLikesCount(likesCount);
      saveToCache(postId, 'liked', wasLiked);
      saveToCache(postId, 'likes', likesCount);
    } finally {
      // Remove setTimeout to prevent hanging
      setIsAnimating(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const wasSaved = isSavedState;
    const newSavedState = !wasSaved;
    
    // Optimistic update UI immediately
    setIsSavedState(newSavedState);
    saveToCache(postId, 'saved', newSavedState);
    
    try {
      const result = await savePost(postId, wasSaved);
      
      if (result.success && result.data) {
        setIsSavedState(result.data.saved !== undefined ? result.data.saved : newSavedState);
        saveToCache(postId, 'saved', result.data.saved !== undefined ? result.data.saved : newSavedState);
      } else {
        // Revert on failure
        setIsSavedState(wasSaved);
        saveToCache(postId, 'saved', wasSaved);
      }
    } catch (error) {
      // Revert on error
      setIsSavedState(wasSaved);
      saveToCache(postId, 'saved', wasSaved);
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCommentModal(true);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleCommentAdded = async (commentContent) => {
    try {
      const result = await addComment(postId, commentContent);
      
      if (result.success) {
        const newCommentCount = commentsCount + 1;
        setCommentsCount(newCommentCount);
        saveToCache(postId, 'comments', newCommentCount);
      }
    } catch (error) {
    }
  };

  return {
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
  };
}