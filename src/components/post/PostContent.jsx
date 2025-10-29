import React from 'react';
import MarkdownArticle from './MarkdownArticle';

export default function PostContent({ post }) {
  return (
    <div className="flex-1 min-w-0">
      <h1 className="text-4xl font-extrabold leading-tight bg-gradient-to-r from-purple-7 via-purple-5 to-emerald-6 bg-clip-text text-transparent mb-3">
        {post.title}
      </h1>

      {/* Post Description */}
      {post.description && (
        <p className="text-lg gray-7 leading-relaxed mb-4">{post.description}</p>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full bg-gradient-to-r from-purple-5 to-purple-6 text-white shadow-sm hover:from-purple-6 hover:to-purple-7 transition-all"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Post Content */}
      <div className="mt-6">
        {post.content ? (
          <MarkdownArticle>{post.content}</MarkdownArticle>
        ) : (
          <div className="prose prose-neutral max-w-none">
            <div className="text-center py-12">
              <p className="text-gray-6 text-lg">No content available for this post.</p>
              <p className="text-gray-5 text-sm mt-2">
                This post only has a description, no full content.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
