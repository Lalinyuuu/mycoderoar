import usePostsFeed from "@/feature/posts/hooks/use_posts_feed.js";
import BlogCard from "@/components/cards/blog_card.jsx";
import { useEffect, useState } from "react";
import { getPosts } from "@/api_services/posts.js";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["Highlight", "General", "Cat", "Dog", "Tech", "Travel", "Food", "Finance"];

export default function ArticleSection() {
  const {
    posts, category, typing, isLoading, errorMsg, hasMore,
    setCategory, setTyping, loadMore,
  } = usePostsFeed();


  const [suggests, setSuggests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = typing.trim();
    if (!q) { setSuggests([]); return; }
    let alive = true;
    (async () => {
      const data = await getPosts({ page: 1, limit: 5, keyword: q });
      if (!alive) return;
      const seen = new Set();
      const list = (data?.posts ?? []).filter(p => !seen.has(p.id) && (seen.add(p.id), true));
      setSuggests(list);
    })();
    return () => { alive = false; };
  }, [typing]);

  return (
    <section className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Latest articles</h1>


      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6 w-full">
        {/* Search */}
        <div className="w-full md:max-w-sm relative">
          <input
            type="text"
            placeholder="Search"
            value={typing}
            onChange={(e) => setTyping(e.target.value)}
            className="w-full px-4 py-3 pr-10 rounded-lg border text-muted-foreground"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>

          {suggests.length > 0 && (
            <div className="absolute z-20 mt-2 w-full bg-white border rounded-lg shadow">
              {suggests.map((s) => (
                <button
                  key={`s-${s.id}`}
                  onClick={() => navigate(`/post/${s.id}`, { state: { post: s } })}
                  className="block w-full text-left px-4 py-3 hover:bg-gray-50"
                >
                  {s.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:flex space-x-2">
          {CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                disabled={active}
                onClick={() => setCategory(c)}
                className={[
                  "px-4 py-3 rounded-sm text-sm font-medium transition-colors",
                  "text-muted-foreground",
                  active ? "bg-[#DAD6D1] cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200",
                ].join(" ")}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>


      <div className="mb-4 text-sm text-gray-600">
        {isLoading && posts.length === 0 ? (
          <span>Loading...</span>
        ) : errorMsg ? (
          <span className="text-red-600">{errorMsg}</span>
        ) : (
          <span>Showing <b>{posts.length}</b> posts</span>
        )}
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!isLoading && posts.length === 0 && !errorMsg && (
          <div className="col-span-full text-center text-gray-500 py-12">No posts found.</div>
        )}
        {posts.map((p) => (
          <BlogCard
            key={p.id}
            id={p.id}
            image={p.image}
            category={p.category}
            title={p.title}
            description={p.description}
            author={p.author}
            date={p.displayDate}
          />
        ))}
      </div>

 
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="hover:text-muted-foreground font-medium underline"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "View more"}
          </button>
        </div>
      )}
    </section>
  );
}