import React from 'react';
import CommentModalItem from './CommentModalItem';

export default function CommentModalList({ 
  comments, 
  loading, 
  onEdit, 
  onDelete, 
  onReply 
}) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-6 mx-auto"></div>
        <p className="mt-2 gray-6">Loading comments...</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="gray-5">No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-1 p-6 space-y-4">
      {comments.map(comment => (
        <CommentModalItem
          key={comment.id}
          comment={comment}
          onEdit={onEdit}
          onDelete={onDelete}
          onReply={onReply}
        />
      ))}
    </div>
  );
}