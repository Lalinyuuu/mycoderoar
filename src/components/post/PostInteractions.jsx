import React, { useMemo } from 'react';
import { toast } from 'sonner';
import LikeButton from './LikeButton';

export default function PostInteractions({ 
  post, 
  userLiked, 
  stats, 
  onLikeChange 
}) {
  // Memoize page URL
  const pageUrl = useMemo(
    () => (typeof window !== "undefined" ? window.location.href : ""),
    []
  );

  // Handle copy link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    toast.success('Link copied to clipboard');
  };

  // Handle social share
  const handleShare = (platform, url) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-1/50 to-emerald-1/30 border-2 border-purple-3 px-6 py-4 backdrop-blur-sm">
        <LikeButton
          postId={post.id}
          initialLiked={userLiked}
          initialLikes={stats.likes}
          onLikeChange={onLikeChange}
        />

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-purple-3 bg-light-1 gray-8 hover:bg-purple-1 hover:border-purple-5 hover:scale-105 transition-all duration-200 font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-semibold">Copy link</span>
        </button>

        {/* Social Share Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Facebook */}
          <button
            onClick={() => {
              const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
              handleShare('facebook', facebookUrl);
            }}
            className="w-11 h-11 rounded-full bg-purple-6 hover:bg-purple-7 hover:scale-110 flex items-center justify-center transition-all duration-200 shadow-md"
            aria-label="Share on Facebook"
          >
            <span className="text-white font-bold text-base">f</span>
          </button>

          {/* LinkedIn */}
          <button
            onClick={() => {
              const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
              handleShare('linkedin', linkedinUrl);
            }}
            className="w-11 h-11 rounded-full bg-gray-9 hover:bg-gray-10 hover:scale-110 flex items-center justify-center transition-all duration-200 shadow-md"
            aria-label="Share on LinkedIn"
          >
            <span className="text-white font-bold text-xs">in</span>
          </button>

          {/* Twitter */}
          <button
            onClick={() => {
              const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(post.title)}`;
              handleShare('twitter', twitterUrl);
            }}
            className="w-11 h-11 rounded-full bg-emerald-6 hover:bg-emerald-7 hover:scale-110 flex items-center justify-center transition-all duration-200 shadow-md"
            aria-label="Share on Twitter"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
