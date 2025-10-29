import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthorDisplay, { AuthorInfo, getAuthorObject } from '@/components/post/shared/AuthorDisplay';
import CommentActions from '@/components/post/shared/CommentActions';
import CommentLikeButton from '@/components/post/CommentLikeButton';
import ReplyInput from '@/components/post/shared/ReplyInput';
import NestedReplyModal from './NestedReplyModal';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

export default function ReplyModalSection({ 
  replies, 
  onEdit, 
  onDelete, 
  onReply 
}) {
  const { user } = useAuth();
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const handleEdit = async (commentId) => {
    if (!editContent.trim()) return;
    
    try {
      setSubmitting(true);
      // TODO: Implement edit comment API call
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      // Handle error silently
    } finally {
      setSubmitting(false);
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

  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <div className="ml-12 mt-3 space-y-2">
      <div className="text-xs text-gray-5 mb-3 font-medium">
        {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
      </div>
      {replies.filter(reply => reply && reply.id && reply.content).map((reply) => (
        <div key={reply.id} className="relative">
          {/* Connection Line */}
          <div className="absolute left-4 top-0 w-px h-6 bg-gray-3"></div>
          <div className="ml-6 bg-gray-2 rounded-lg p-3 border border-gray-3">
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
                    />
                  </div>
                </div>
                {/* Reply Content */}
                {editingId === reply.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      size="sm"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => setEditingId(null)}
                        variant="secondary"
                        size="sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleEdit(reply.id)}
                        disabled={!editContent.trim() || submitting}
                        loading={submitting}
                        size="sm"
                      >
                        {submitting ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-8 leading-relaxed mb-2">
                      {reply?.content || 'No content'}
                    </p>
                    
                    {/* Reply Actions */}
                    <CommentActions
                      comment={reply}
                      onEdit={(id, content) => {
                        setEditingId(id);
                        setEditContent(content);
                      }}
                      onDelete={onDelete}
                      onReply={startReply}
                    />
                  </>
                )}
              </div>
            </div>
            
            {/* Reply to Reply Input */}
            {replyingTo === reply.id && (
              <ReplyInput
                parentComment={reply}
                replyContent={replyContent}
                setReplyContent={setReplyContent}
                onSubmit={handleReply}
                onCancel={cancelReply}
                isSubmitting={replySubmitting}
              />
            )}
            
            {/* Nested Replies (Replies to Replies) */}
            {reply.replies && reply.replies.length > 0 && (
              <NestedReplyModal
                replies={reply.replies}
                onEdit={onEdit}
                onDelete={onDelete}
                onReply={onReply}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
