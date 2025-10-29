import React from 'react';
import Button from '@/components/ui/Button';
import { ChevronLeft } from 'lucide-react';

export default function PostHeader({ 
  post, 
  onBack, 
  fromPage 
}) {
  const categoryName = typeof post.category === 'object'
    ? post.category?.name || post.category?.slug || "—"
    : post.category || "—";

  const formattedDate = post.publishedAt || post.createdAt
    ? new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <>
      {/* Back Button */}
      <div className="mb-6">
        <Button
          onClick={onBack}
          variant="outline"
          size="md"
          icon={<ChevronLeft className="w-4 h-4" />}
          className="border-purple-3 text-purple-7 hover:bg-purple-1 hover:border-purple-5"
        >
          Back
        </Button>
      </div>

      {/* Hero Image */}
      {post.image && (
        <div className="flex justify-center mb-4">
          <figure 
            className="relative overflow-hidden bg-gradient-to-br from-purple-1 to-emerald-1 border-2 border-purple-3"
            style={{
              width: '1200px',
              height: '675px',
              borderRadius: '16px',
              opacity: 1
            }}
          >
            <img
              src={post.image}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </figure>
        </div>
      )}

      {/* Post Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm gray-7 mb-4">
        <span className="rounded-full bg-gradient-to-r from-purple-6 to-purple-5 px-4 py-1.5 font-bold text-light-1 shadow-md">
          {categoryName}
        </span>
        <time className="font-medium">{formattedDate}</time>
      </div>
    </>
  );
}
