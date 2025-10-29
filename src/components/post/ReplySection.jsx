import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthorDisplay, { AuthorInfo, getAuthorObject } from './shared/AuthorDisplay';
import CommentActions from './shared/CommentActions';
import CommentLikeButton from './CommentLikeButton';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

export default function ReplySection({ 
  replies, 
  onEdit, 
  onDelete, 
  onReply 
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

  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <div className="ml-12 mt-3 space-y-2">
      <div className="text-xs text-gray-5 mb-3 font-medium">
        {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
      </div>
      {replies.filter(reply => reply && (reply.id || reply._id)).map((reply) => (
        <div key={reply.id || reply._id} className="relative">
          {/* Connection Line */}
          <div className="absolute left-4 top-0 w-px h-6 bg-gray-3 dark:bg-gray-6"></div>
          <div className="ml-6 bg-gray-1 dark:bg-gray-8 rounded-lg p-3 border border-gray-2 dark:border-gray-7">
            <div className="flex gap-3">
              <AuthorDisplay comment={reply} size="md" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <AuthorInfo comment={reply} timeFormat="both" />
                  <div className="flex items-center">
                    <CommentLikeButton
                      commentId={reply?.id}
                      initialLiked={reply?.liked === true}
                      initialLikes={reply?.likesCount || 0}
                      onChange={(data) => {
                        // Update reply state when like status changes
                        if (onCommentLikeChange) {
                          onCommentLikeChange(reply.id, data);
                        }
                      }}
                    />
                  </div>
                </div>
                
                <p className="text-sm text-gray-8 dark:text-gray-2 leading-relaxed mb-2">
                  {reply?.content || 'No content'}
                </p>
                
                {/* Reply Actions */}
                <CommentActions
                  comment={reply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onReply={startReply}
                />
              </div>
            </div>
            
            {/* Reply to Reply Input */}
            {replyingTo === reply.id && (
              <div className="ml-11 mt-3 bg-gray-2 dark:bg-gray-7 rounded-lg p-3 border border-gray-3 dark:border-gray-6">
                <div className="flex gap-3">
                  <AuthorDisplay comment={{ author: user }} size="md" />
                  <div className="flex-1">
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={`Reply to ${getAuthorObject(reply).name || 'this comment'}...`}
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
                        onClick={() => handleReply(reply.id)}
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
            
            {/* Nested Replies (Replies to Replies) */}
            {reply.replies && Array.isArray(reply.replies) && reply.replies.length > 0 && (
              <div className="ml-11 mt-2 space-y-2">
                {reply.replies.map((nestedReply) => (
                  <div key={nestedReply.id} className="bg-gray-2 dark:bg-gray-7 rounded-lg p-3 border border-gray-3 dark:border-gray-6">
                    <div className="flex gap-3">
                      <AuthorDisplay comment={nestedReply} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <AuthorInfo comment={nestedReply} timeFormat="smart" />
                          <div className="flex items-center">
                            <CommentLikeButton
                              commentId={nestedReply?.id}
                              initialLiked={nestedReply?.liked === true}
                              initialLikes={nestedReply?.likesCount || 0}
                            />
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-8 dark:text-gray-2 leading-relaxed mb-2">
                          {nestedReply?.content || 'No content'}
                        </p>
                        
                        {/* Nested Reply Actions */}
                        <CommentActions
                          comment={nestedReply}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onReply={startReply}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
