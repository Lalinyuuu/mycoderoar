import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getPostComments, editComment, deleteComment } from '@/services/posts';
import { addComment } from '@/api_services/interactions';

export function useComments(postId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await getPostComments(postId);
      
      if (response.success && response.data && response.data.comments) {
        setComments(response.data.comments);
      } else if (response.success && response.comments) {
        // Fallback for old API structure
        setComments(response.comments || []);
      } else if (response && Array.isArray(response)) {
        // Fallback for direct array response
        setComments(response || []);
      } else {
        setComments([]);
      }
    } catch (error) {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const addNewComment = async (content, parentCommentId = null) => {
    try {
      setSubmitting(true);
      const response = await addComment(postId, content.trim(), parentCommentId);
      
      if (response.success) {
        const newComment = response.data?.comment || response.comment || response.data?.comments?.[0];
        
        if (newComment && newComment.id) {
          if (parentCommentId) {
            // Add as reply
            setComments(prev => {
              const updatedComments = prev.map(comment => {
                // Check if parentCommentId is a main comment
                if (comment.id === parentCommentId) {
                  return {
                    ...comment,
                    replies: [...(comment.replies || []), newComment],
                    repliesCount: (comment.repliesCount || 0) + 1
                  };
                }
                
                // Check if parentCommentId is a reply (nested reply case)
                if (comment.replies && Array.isArray(comment.replies)) {
                  const updatedReplies = comment.replies.map(reply => {
                    if (reply.id === parentCommentId) {
                      return {
                        ...reply,
                        replies: [...(reply.replies || []), newComment],
                        repliesCount: (reply.repliesCount || 0) + 1
                      };
                    }
                    return reply;
                  });
                  
                  if (JSON.stringify(updatedReplies) !== JSON.stringify(comment.replies)) {
                    return {
                      ...comment,
                      replies: updatedReplies
                    };
                  }
                }
                
                return comment;
              });
              return updatedComments;
            });
          } else {
            // Add as main comment
            setComments(prev => [{...newComment, isNew: true}, ...prev]);
            
            // Remove animation flag after animation completes
            setTimeout(() => {
              setComments(prev => prev.map(c => ({...c, isNew: false})));
            }, 600);
          }
          
          toast.success(parentCommentId ? 'Reply added successfully' : 'Comment added successfully');
          return newComment;
        } else {
          toast.error('Invalid comment data received');
          return null;
        }
      } else {
        toast.error(response.error || 'Failed to add comment');
        return null;
      }
    } catch (error) {
      toast.error('Failed to add comment. Please try again.');
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const updateComment = async (commentId, newContent) => {
    try {
      setSubmitting(true);
      const response = await editComment(postId, commentId, newContent);
      
      // Update the comment in the state
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId ? { ...comment, content: newContent } : comment
        )
      );
      
      toast.success('Comment updated successfully');
      return true;
    } catch (error) {
      toast.error('Failed to update comment');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const removeComment = async (commentId) => {
    try {
      setSubmitting(true);
      await deleteComment(postId, commentId);
      
      // Update comments state to remove the deleted comment/reply
      setComments(prev => {
        // First, try to find and remove from main comments
        const mainCommentIndex = prev.findIndex(comment => comment.id === commentId);
        if (mainCommentIndex !== -1) {
          const updatedComments = [...prev];
          updatedComments.splice(mainCommentIndex, 1);
          return updatedComments;
        }
        
        // If not found in main comments, search in replies
        return prev.map(comment => {
          if (comment.replies && comment.replies.length > 0) {
            // Check if the deleted comment is a direct reply
            const replyIndex = comment.replies.findIndex(reply => reply.id === commentId);
            if (replyIndex !== -1) {
              return {
                ...comment,
                replies: comment.replies.filter(reply => reply.id !== commentId),
                repliesCount: Math.max(0, (comment.repliesCount || 0) - 1)
              };
            }
            
            // Check if the deleted comment is a nested reply (reply to reply)
            const updatedReplies = comment.replies.map(reply => {
              if (reply.replies && reply.replies.length > 0) {
                const nestedReplyIndex = reply.replies.findIndex(nestedReply => nestedReply.id === commentId);
                if (nestedReplyIndex !== -1) {
                  return {
                    ...reply,
                    replies: reply.replies.filter(nestedReply => nestedReply.id !== commentId),
                    repliesCount: Math.max(0, (reply.repliesCount || 0) - 1)
                  };
                }
              }
              return reply;
            });
            
            if (JSON.stringify(updatedReplies) !== JSON.stringify(comment.replies)) {
              return {
                ...comment,
                replies: updatedReplies
              };
            }
          }
          return comment;
        });
      });
      
      toast.success('Comment deleted successfully');
      return true;
    } catch (error) {
      toast.error('Failed to delete comment');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (postId) {
      loadComments();
    }
  }, [postId]);

  return {
    comments,
    loading,
    submitting,
    loadComments,
    addNewComment,
    updateComment,
    removeComment
  };
}
