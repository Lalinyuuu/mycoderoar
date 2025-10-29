import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function CommentModalForm({ onSubmit, isSubmitting }) {
  const { user } = useAuth();
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!comment.trim()) {
      return;
    }

    const newComment = await onSubmit(comment);
    if (newComment) {
      setComment('');
    }
  };

  if (!user) {
    return (
      <div className="text-center py-4">
        <p className="gray-6">
          Please <a href="/login" className="purple-6 hover:underline">sign in</a> to leave a comment.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-purple-6 rounded-full flex items-center justify-center text-light-1 font-medium flex-shrink-0">
          {user.avatar ? (
            <img 
              src={user.avatar}
              alt={user.name || 'User'}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span>{(user.name || user.username || 'U').charAt(0).toUpperCase()}</span>
          )}
        </div>
        
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-4 py-2 bg-gray-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-5 gray-9 placeholder-gray-6"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className="px-6 py-2 bg-purple-6 text-light-1 rounded-lg font-medium hover:bg-purple-7 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </form>
  );
}
