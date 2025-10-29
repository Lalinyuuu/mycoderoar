import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthorDisplay, { AuthorInfo, getAuthorObject } from './shared/AuthorDisplay';
import CommentActions from './shared/CommentActions';
import CommentLikeButton from './CommentLikeButton';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

export default function CommentItem({ 
  comment, 
  onEdit, 
  onDelete, 
  onReply, 
  onToggleReplies,
  showReplies,
  repliesCount,
  isEditing,
  editContent,
  setEditContent,
  onSubmitEdit,
  onCommentLikeChange,
  onCancelEdit
}) {
  const { user } = useAuth();
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);

  const handleReply = async (parentCommentId) => {
    if (!user) {
      return;
    }
    
    if (!replyContent.trim()) {
      return;
    }

    try {
      setReplySubmitting(true);
      const newReply = await onReply(parentCommentId, replyContent.trim());
      if (newReply) {
        setReplyContent('');
        setReplyingTo(null);
      }
    } catch (error) {
      // Handle error silently
    } finally {
      setReplySubmitting(false);
    }
  };

  const startReply = (commentId) => {
    setReplyingTo(commentId);
    setReplyContent('');
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyContent('');
  };

  const canEdit = (comment) => {
    if (!user) return false;
    
    // Admin can edit any comment
    if (user.role === 'admin') return true;
    
    // Get the author information using the same method as display
    const author = getAuthorObject(comment);
    
    // Check if the current user is the author of this comment
    return author.id === user.id || comment.userId === user.id;
  };

  return (
    <div className="border-b border-gray-2 dark:border-gray-7 pb-4">
      <div className="flex items-start space-x-3">
        <AuthorDisplay comment={comment} size="lg" />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <AuthorInfo comment={comment} />
            <div className="flex items-center">
              <CommentLikeButton
                commentId={comment.id || comment._id}
                initialLiked={comment.liked === true}
                initialLikes={comment.likesCount || 0}
                onChange={(data) => {
                  // Update comment state when like status changes
                  if (onCommentLikeChange) {
                    onCommentLikeChange(comment.id, data);
                  }
                }}
              />
            </div>
          </div>
          
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                size="sm"
              />
              <div className="flex space-x-2">
                <Button
                  onClick={() => onSubmitEdit(comment.id, editContent)}
                  disabled={!editContent.trim()}
                  variant="primary"
                  size="sm"
                >
                  Save
                </Button>
                <Button
                  onClick={onCancelEdit}
                  variant="secondary"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-8 dark:text-gray-2 whitespace-pre-wrap mb-2">
                {comment.content}
              </p>
              
              {/* Comment interactions */}
              <div className="flex items-center space-x-4 text-sm text-gray-6 dark:text-gray-4">
                <button 
                  onClick={() => startReply(comment.id)}
                  className="hover:text-purple-6 transition-colors"
                >
                  Reply
                </button>
                {repliesCount > 0 && (
                  <button 
                    onClick={() => onToggleReplies(comment.id)}
                    className="flex items-center space-x-2 hover:text-purple-6 transition-colors text-sm font-medium"
                  >
                    <span className="text-purple-6">
                      {showReplies ? '▼' : '▶'}
                    </span>
                    <span>
                      {showReplies 
                        ? `Hide ${repliesCount} ${repliesCount === 1 ? 'reply' : 'replies'}`
                        : `View ${repliesCount} ${repliesCount === 1 ? 'reply' : 'replies'}`
                      }
                    </span>
                  </button>
                )}
              </div>
              
              {canEdit(comment) && (
                <div className="mt-2 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => onEdit(comment.id, comment.content)}
                    className="text-sm purple-6 hover:text-light-1 hover:bg-purple-6 px-2 py-1 rounded transition-colors dark:purple-4"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(comment.id)}
                    className="text-sm error hover:text-light-1 hover:bg-error px-2 py-1 rounded transition-colors dark:error"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Reply Input */}
      {replyingTo === comment.id && (
        <div className="ml-12 mt-3">
          <div className="flex gap-3">
            <AuthorDisplay comment={{ author: user }} size="md" />
            <div className="flex-1">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Reply to ${getAuthorObject(comment).name || 'this comment'}...`}
                rows={2}
                size="sm"
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  onClick={cancelReply}
                  variant="secondary"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleReply(comment.id)}
                  disabled={replySubmitting || !replyContent.trim()}
                  size="sm"
                >
                  {replySubmitting ? 'Replying...' : 'Reply'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

