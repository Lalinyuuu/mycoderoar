import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthorObject } from './AuthorDisplay';

export default function CommentActions({ 
  comment, 
  onEdit, 
  onDelete, 
  onReply, 
  showReply = true,
  className = '' 
}) {
  const { user } = useAuth();

  const canEdit = (comment) => {
    if (!user) return false;
    
    // Admin can edit any comment
    if (user.role === 'admin') return true;
    
    // Get the author information using the same method as display
    const author = getAuthorObject(comment);
    
    // Check if the current user is the author of this comment
    return author.id === user.id || comment.userId === user.id;
  };

  if (!canEdit(comment) && !showReply) {
    return null;
  }

  return (
    <div className={`flex items-center gap-3 text-xs text-gray-6 dark:text-gray-4 ${className}`}>
      {showReply && (
        <button 
          onClick={() => onReply(comment.id)}
          className="hover:text-purple-6 transition-colors"
        >
          Reply
        </button>
      )}
      {canEdit(comment) && (
        <>
          <button
            type="button"
            onClick={() => onEdit(comment.id, comment.content)}
            className="hover:text-purple-6 transition-colors"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(comment.id)}
            className="hover:text-error transition-colors"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
}
