import React, { useState } from 'react';
import { useComments } from '@/hooks/useComments';
import Portal from '../Portal';
import CommentModalHeader from './CommentModalHeader';
import CommentModalList from './CommentModalList';
import CommentModalForm from './CommentModalForm';

const CommentModal = ({ 
  isOpen, 
  onClose, 
  postId, 
  postTitle, 
  onCommentAdded = null 
}) => {
  const {
    comments,
    loading,
    submitting,
    addNewComment
  } = useComments(postId);

  const handleSubmit = async (content) => {
    const newComment = await addNewComment(content);
    if (newComment && onCommentAdded) {
      onCommentAdded(newComment);
    }
    return newComment;
  };

  const handleReply = async (parentCommentId, content) => {
    return await addNewComment(content, parentCommentId);
  };

  const handleEdit = async (commentId) => {
    // TODO: Implement edit functionality
  };

  const handleDelete = async (commentId) => {
    // TODO: Implement delete functionality
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div 
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ 
          zIndex: 99999,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-2xl bg-light-1 rounded-2xl shadow-2xl border border-gray-2 max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <CommentModalHeader 
            postTitle={postTitle} 
            onClose={onClose} 
          />

          {/* Comments List */}
          <CommentModalList
            comments={comments}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReply={handleReply}
          />

          {/* Comment Input */}
          <div className="border-t border-gray-1 p-6 flex-shrink-0 bg-light-2">
            <CommentModalForm 
              onSubmit={handleSubmit}
              isSubmitting={submitting}
            />
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default CommentModal;