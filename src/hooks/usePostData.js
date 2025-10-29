import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPostStats, getPostById, getPostBySlug } from '@/services/posts';
import { trackView } from '@/api_services/interactions';
import { getPostFetchMethod, normalizePostIdentifier } from '@/utils/postUtils';

export function usePostData(postId, state) {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [stats, setStats] = useState({ likes: 0, comments: 0, shares: 0 });
  const [userLiked, setUserLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load post whenever postId changes
  useEffect(() => {
    let alive = true;

    const loadPost = async () => {
      try {
        setLoading(true);

        // Show state.post immediately for faster UX
        if (state?.post && String(state.post.id) === String(postId)) {
          setPost(state.post);
        } else {
          setPost(null);
        }

        // Always fetch from API to get complete data with content
        // Determine the best method to fetch the post
        let data;
        const identifierInfo = normalizePostIdentifier(postId);
        const fetchMethod = getPostFetchMethod(postId);
        
        if (fetchMethod === 'id') {
          // postId is a UUID, fetch by ID
          try {
            data = await getPostById(postId);
          } catch (error) {
            throw error;
          }
        } else {
          // postId is likely a slug, try slug first, then fallback to ID
          try {
            data = await getPostBySlug(postId);
          } catch (error) {
            try {
              data = await getPostById(postId);
            } catch (idError) {
              throw error; // Throw original slug error
            }
          }
        }

        if (!alive) return;

        if (data) {
          setPost(data);
          
          // Extract user interaction data from post response
          if (data.userInteraction) {
            setUserLiked(data.userInteraction.hasLiked || false);
          }
          
          // Extract stats from post data
          if (data._count) {
            setStats({
              likes: data._count.likes || 0,
              comments: data._count.comments || 0,
              shares: data._count.shares || 0
            });
          }
        } else {
          navigate("/not-found");
        }
      } catch (error) {
        if (!alive) return;
        navigate("/not-found");
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    loadPost();

    return () => {
      alive = false;
    };
  }, [postId, navigate, state]);

  // Load post stats and interaction data
  useEffect(() => {
    if (!post || !post.id) return;

    const loadStats = async () => {
      try {
        // Track view
        trackView(post.id).catch(() => {
          // Non-critical, ignore
        });

        // Only fetch stats if not already set from post data
        if (!post._count) {
          const statsResult = await getPostStats(post.id);
          const likesCount = statsResult?.likesCount || statsResult?.likes || 0;
          const commentsCount = statsResult?.commentsCount || statsResult?.comments || 0;
          const sharesCount = statsResult?.sharesCount || statsResult?.shares || 0;

          setStats({
            likes: likesCount,
            comments: commentsCount,
            shares: sharesCount
          });
          
          // Only set userLiked if not already set from userInteraction
          if (post.userInteraction === undefined) {
            setUserLiked(statsResult?.userLiked || false);
          }
        }
      } catch (error) {
        // Fallback: try to get stats only
        try {
          const data = await getPostStats(post.id);
          setStats({
            likes: data?.likesCount || data?.likes || 0,
            comments: data?.commentsCount || data?.comments || 0,
            shares: data?.sharesCount || data?.shares || 0
          });
          
          // Only set userLiked if not already set from userInteraction
          if (post.userInteraction === undefined) {
            setUserLiked(data?.userLiked || false);
          }
        } catch {
          // Final fallback: use defaults
          setStats({ likes: 0, comments: 0, shares: 0 });
          if (post.userInteraction === undefined) {
            setUserLiked(false);
          }
        }
      }
    };

    loadStats();
  }, [post]);

  // Handle like change
  const handleLikeChange = useCallback((liked, likesCount) => {
    setUserLiked(liked);
    setStats(prev => ({ ...prev, likes: likesCount }));
  }, []);

  // Handle comment added/deleted
  const handleCommentAdded = useCallback(() => {
    setStats(prev => ({ ...prev, comments: prev.comments + 1 }));
  }, []);

  const handleCommentDeleted = useCallback(() => {
    setStats(prev => ({ ...prev, comments: Math.max(0, prev.comments - 1) }));
  }, []);

  return {
    post,
    stats,
    userLiked,
    loading,
    handleLikeChange,
    handleCommentAdded,
    handleCommentDeleted
  };
}
