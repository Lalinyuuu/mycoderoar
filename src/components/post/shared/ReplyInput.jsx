import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import AuthorDisplay, { getAuthorObject } from './AuthorDisplay';

export default function ReplyInput({ 
  parentComment, 
  replyContent, 
  setReplyContent, 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  placeholder = null,
  className = '' 
}) {
  const { user } = useAuth();
  const author = getAuthorObject(parentComment);

  const handleSubmit = () => {
    if (replyContent.trim()) {
      onSubmit(parentComment.id);
    }
  };

  return (
    <div className={`bg-gray-1 dark:bg-gray-8 rounded-lg p-3 border border-gray-2 dark:border-gray-7 ${className}`}>
      <div className="flex gap-3">
        <AuthorDisplay comment={{ author: user }} size="md" />
        <div className="flex-1">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={placeholder || `Reply to ${author.name || 'this comment'}...`}
            rows={2}
            size="sm"
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button
              onClick={onCancel}
              variant="secondary"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !replyContent.trim()}
              size="sm"
            >
              {isSubmitting ? 'Replying...' : 'Reply'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

