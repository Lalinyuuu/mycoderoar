import React, { useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { usePostData } from "@/hooks";
import { CommentSection, ReadingProgressBar, RelatedPosts, PostHeader, PostContent, PostInteractions, PostMeta } from "@/components";

export default function ViewPostPage() {
  const { postId } = useParams();
  const nav = useNavigate();
  const { state } = useLocation();
  const fromPage = state?.fromPage;

  const {
    post,
    stats,
    userLiked,
    loading,
    handleLikeChange,
    handleCommentAdded,
    handleCommentDeleted
  } = usePostData(postId, state);

  // Handle back button
  const handleBack = useCallback(() => {
    if (fromPage) {
      nav(fromPage.pathname + fromPage.search + fromPage.hash);
    } else {
      nav(-1);
    }
  }, [fromPage, nav]);

  if (!post) {
    return (
      <div className="mx-auto max-w-[1440px] p-6 gray-10">
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-6">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ReadingProgressBar />

      <article className="mx-auto max-w-[1440px] px-4 py-10 gray-10">
        {/* Post Header */}
        <PostHeader 
          post={post} 
          onBack={handleBack} 
          fromPage={fromPage} 
        />

        {/* Main Content Layout */}
        <div className="mt-2 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Left Column - Main Content */}
          <div className="flex-1 min-w-0">
            {/* Post Content */}
            <PostContent post={post} />

            {/* Interaction Bar */}
            <PostInteractions
              post={post}
              userLiked={userLiked}
              stats={stats}
              onLikeChange={handleLikeChange}
            />

            {/* Comments Section */}
            <div className="mt-8">
              <CommentSection
                postId={post.id}
                onCommentAdded={handleCommentAdded}
                onCommentDeleted={handleCommentDeleted}
                onCommentLikeChange={(commentId, data) => {
                  // You can add additional logic here if needed
                }}
              />
            </div>
          </div>

          {/* Right Column - Post Meta */}
          <PostMeta post={post} />
        </div>

        {/* Related Posts */}
        <RelatedPosts postId={post.id} limit={3} />
      </article>
    </>
  );
}
