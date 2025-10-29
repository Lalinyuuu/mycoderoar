import { useNavigate } from "react-router-dom";
import usePostsFeed from "@/hooks/usePostsFeed.jsx";
import BlogCard from "@/components/cards/BlogCard.jsx";
import SearchBar from "@/components/forms/SearchBar.jsx";      
import CategoryFilter from "@/components/filters/CategoryFilter.jsx";
import LoadingPoring from "@/components/loading/LoadingPoring";



export default function ArticleSection() {
  const {
    posts,
    category,
    typing,
    isLoading,
    errorMsg,
    hasMore,
    setCategory,
    setTyping,
    loadMore,
  } = usePostsFeed();

  const navigate = useNavigate();


  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full max-w-[1440px] mx-auto">
        {/* Header - simplified, clean, no overlapping sparkles */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-8 rounded-full bg-gradient-to-r from-purple-5 to-purple-6"></span>
            <span className="h-1 w-6 rounded-full bg-gradient-to-r from-purple-5 to-purple-6"></span>
            <span className="h-1 w-4 rounded-full bg-gradient-to-r from-purple-5 to-purple-6"></span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold purple-7 tracking-tight">
            Latest Articles
          </h1>
          <p className="mt-1 gray-6 text-sm">
            Discover the latest guides, strategies, and insights for your Ragnarok Online adventure
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6 w-full">
          <div className="flex-shrink-0 w-full lg:w-80">
            <SearchBar typing={typing} setTyping={setTyping} />
          </div>
          <div className="w-full lg:flex-1 lg:min-w-0 lg:flex lg:justify-end">
            <CategoryFilter category={category} setCategory={setCategory} />
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-7">
          {isLoading && posts.length === 0 ? (
            <div className="flex items-start justify-center -mt-50 pb-8">
              <div className="scale-150">
                <LoadingPoring fullscreen={false} text="Loading All Posts..." />
              </div>
            </div>
          ) : errorMsg ? (
            <div className="text-center py-8">
              <span className="text-error text-lg">{errorMsg}</span>
              <p className="text-gray-6 mt-2">Please check your connection and try again</p>
            </div>
          ) : (
            <span>
              Showing <b className="text-gray-9">{posts.length}</b> posts
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!isLoading && posts.length === 0 && !errorMsg && (
          <div className="col-span-full text-center text-gray-6 py-12">
            No posts found.
          </div>
        )}

        {posts.map((p, index) => {
          
          // Handle date properly
          let postDate;
          if (p.displayDate) {
            postDate = p.displayDate;
          } else if (p.date) {
            postDate = new Date(p.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });
          } else if (p.createdAt) {
            postDate = new Date(p.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });
          } else {
            // Fallback to current date if no date available
            postDate = new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });
          }
          
          const delayClass = index < 6 ? `delay-${(index + 1) * 100}` : '';
          
          return (
            <div key={p.id || index} className={`animate-stagger ${delayClass}`}>
              <BlogCard
                rawPost={p}
                id={p.id}
                image={p.image || p.imageUrl || p.coverImage}
                category={p.category || p.categoryRelation?.name}
                title={p.title}
                description={p.description || p.content?.substring(0, 150)}
                author={p.author || p.bylineName || p.authorRelation?.name}
                date={postDate}
                likes={p.likes || p.likesCount || p.likeCount || p._count?.likes || 0}
                comments={p.comments || p.commentsCount || p.commentCount || p._count?.comments || 0}
                views={p.views || p.viewsCount || p.viewCount || 0}
                tags={p.tags || []}
                isLiked={p.isLiked || p.liked || false}
                isSaved={p.isSaved || p.saved || false}
                onClick={() => navigate(`/post/${p.id}`, { state: { post: p } })}
              />
            </div>
          );
        })}
        </div>

        {hasMore && !isLoading && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              className="px-6 py-3 text-purple-6 hover:text-purple-7 font-medium underline decoration-purple-3 underline-offset-4 transition-colors"
              disabled={isLoading}
            >
              View more
            </button>
          </div>
        )}
      </div>
    </section>
  );
}