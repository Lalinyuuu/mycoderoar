import React from 'react';
import AuthorAside from './AuthorAside';

export default function PostMeta({ post }) {
  // Extract author display data
  const displayName = React.useMemo(() => {
    if (typeof post?.author?.name === 'object') {
      return post.author.name?.name || post.author.name?.displayName || "Unknown";
    }
    return post?.author?.name || "Unknown";
  }, [post?.author?.name]);

  const displayAvatar = React.useMemo(() => {
    if (typeof post?.author?.avatar === 'object') {
      return post.author.avatar?.url || post.author.avatar?.src;
    }
    return post?.author?.avatar;
  }, [post?.author?.avatar]);

  return (
    <div className="hidden lg:block flex-shrink-0 w-80">
      <div className="sticky top-6">
        <AuthorAside author={post.author} />
      </div>
    </div>
  );
}
