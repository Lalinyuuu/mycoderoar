import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import LoginModal from './shared/LoginModal';

export default function CommentForm({ onSubmit, submitting, onCommentAdded }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    if (!content.trim() || submitting) return;

    const newComment = await onSubmit(content.trim());
    if (newComment) {
      setContent('');
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-start space-x-3">
          {/* User Avatar */}
          <div className="w-10 h-10 bg-purple-6 rounded-full flex items-center justify-center text-light-1 font-medium">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User'}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span>{user ? (user.name || user.username || 'U').charAt(0).toUpperCase() : '👤'}</span>
            )}
          </div>
          
          {/* Comment Input */}
          <div className="flex-1 space-y-3">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onClick={() => !user && setShowLoginModal(true)}
              onFocus={() => !user && setShowLoginModal(true)}
              placeholder={user ? "Write a comment..." : "Sign in to comment..."}
              rows={3}
              disabled={submitting || !user}
              size="md"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!user || !content.trim() || submitting}
                loading={submitting}
                variant="primary"
                size="md"
              >
                {submitting ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
        </div>
      </form>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
}
