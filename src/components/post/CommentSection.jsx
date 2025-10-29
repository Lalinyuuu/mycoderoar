import React, { useState } from 'react';
import { useComments } from '@/hooks';
import { CommentForm, CommentItem, ReplySection, LoadingPoring, ConfirmModal } from '@/components';

export default function CommentSection({ postId, onCommentAdded, onCommentDeleted, onCommentLikeChange }) {
  const {
    comments,
    loading,
    submitting,
    addNewComment,
    updateComment,
    removeComment
  } = useComments(postId);

  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [showReplies, setShowReplies] = useState({});

  const handleSubmit = async (content) => {
    return await addNewComment(content);
  };

  const handleEdit = async (commentId, newContent) => {
    const success = await updateComment(commentId, newContent);
    if (success) {
      setEditingId(null);
      setEditContent('');
    }
  };

  const handleDelete = async (commentId) => {
    const success = await removeComment(commentId);
    if (success) {
      setConfirmOpen(false);
      setPendingDeleteId(null);
      if (onCommentDeleted) {
        onCommentDeleted(commentId);
      }
    }
  };

  const requestDelete = (commentId) => {
    setPendingDeleteId(commentId);
    setConfirmOpen(true);
  };

  const startEdit = (commentId, content) => {
    setEditingId(commentId);
    setEditContent(content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleReply = async (parentCommentId, content) => {
    return await addNewComment(content, parentCommentId);
  };

  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  if (loading) {
    return <LoadingPoring text="Loading Comments..." />;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold gray-9 dark:text-light-1 mb-4">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <CommentForm 
        onSubmit={handleSubmit}
        submitting={submitting}
        onCommentAdded={onCommentAdded}
      />

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="gray-5 dark:gray-4">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div 
              key={comment.id} 
              className={`${comment.isNew ? 'animate-slide-in-up' : ''}`}
            >
              <CommentItem
                comment={comment}
                onEdit={startEdit}
                onDelete={requestDelete}
                onReply={handleReply}
                onToggleReplies={toggleReplies}
                showReplies={showReplies[comment.id]}
                repliesCount={comment.replies?.length || 0}
                isEditing={editingId === comment.id}
                editContent={editContent}
                setEditContent={setEditContent}
                onSubmitEdit={handleEdit}
                onCancelEdit={cancelEdit}
                onCommentLikeChange={onCommentLikeChange}
              />
              
              {/* Nested Replies */}
              {comment.replies && comment.replies.length > 0 && showReplies[comment.id] && (
                <ReplySection
                  replies={comment.replies}
                  onEdit={startEdit}
                  onDelete={requestDelete}
                  onReply={handleReply}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
        }}
        onConfirm={() => handleDelete(pendingDeleteId)}
        title="Delete comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText={submitting ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
      />
    </div>
  );
}