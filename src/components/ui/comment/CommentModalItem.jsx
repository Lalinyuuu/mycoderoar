import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthorDisplay, { AuthorInfo, getAuthorObject } from '@/components/post/shared/AuthorDisplay';
import CommentActions from '@/components/post/shared/CommentActions';
import CommentLikeButton from '@/components/post/CommentLikeButton';
import ReplyInput from '@/components/post/shared/ReplyInput';
import ReplyModalSection from './ReplyModalSection';

export default function CommentModalItem({ 
  comment, 
  onEdit, 
  onDelete, 
  onReply 
}) {
  const { user } = useAuth();
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

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

  const toggleReplies = () => {
    setShowReplies(prev => !prev);
  };

  const startReply = (commentId) => {
    setReplyingTo(commentId);
    setReplyContent('');
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyContent('');
  };

  const author = getAuthorObject(comment);

  return (
    <div className="bg-gray-1 rounded-xl p-4 mb-4 border border-gray-2">
      <div className="flex gap-3">
        {/* Avatar */}
        <AuthorDisplay comment={comment} size="lg" />
        
        {/* Comment Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <AuthorInfo comment={comment} />
            <div className="flex items-center">
              <CommentLikeButton
                commentId={comment.id}
                initialLiked={comment.liked === true}
                initialLikes={comment.likesCount || 0}
              />
            </div>
          </div>
          
          <p className="text-sm text-gray-8 leading-relaxed mb-2">{comment.content}</p>
          
          {/* Comment Actions */}
          <div className="flex items-center gap-3 text-xs text-gray-6">
            <button 
              onClick={() => startReply(comment.id)}
              className="hover:text-purple-6 transition-colors"
            >
              Reply
            </button>
            {comment.replies && comment.replies.length > 0 && (
              <button 
                onClick={toggleReplies}
                className="flex items-center space-x-2 hover:text-purple-6 transition-colors text-sm font-medium"
              >
                <span className="text-purple-6">
                  {showReplies ? '▼' : '▶'}
                </span>
                <span>
                  {showReplies 
                    ? `Hide ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`
                    : `View ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`
                  }
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Reply Input */}
      {replyingTo === comment.id && (
        <ReplyInput
          parentComment={comment}
          replyContent={replyContent}
          setReplyContent={setReplyContent}
          onSubmit={handleReply}
          onCancel={cancelReply}
          isSubmitting={replySubmitting}
        />
      )}
      
      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && showReplies && (
        <ReplyModalSection
          replies={comment.replies}
          onEdit={onEdit}
          onDelete={onDelete}
          onReply={onReply}
        />
      )}
    </div>
  );
}
