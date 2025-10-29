import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthorDisplay, { AuthorInfo, getAuthorObject } from '@/components/post/shared/AuthorDisplay';
import CommentActions from '@/components/post/shared/CommentActions';
import CommentLikeButton from '@/components/post/CommentLikeButton';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

export default function NestedReplyModal({ 
  replies, 
  onEdit, 
  onDelete, 
  onReply 
}) {
  const { user } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
    // TODO: Implement nested reply functionality
  };

  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <div className="ml-11 mt-2 space-y-2">
      {replies.map((nestedReply) => (
        <div key={nestedReply.id} className="bg-gray-3 rounded-lg p-3 border border-gray-4">
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
              {/* Nested Reply Content */}
              {editingId === nestedReply.id ? (
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
                      onClick={() => handleEdit(nestedReply.id)}
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
                  <p className="text-xs text-gray-8 leading-relaxed mb-2">
                    {nestedReply?.content || 'No content'}
                  </p>
                  
                  {/* Nested Reply Actions */}
                  <CommentActions
                    comment={nestedReply}
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
        </div>
      ))}
    </div>
  );
}
