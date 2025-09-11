import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePostsFeed from "@/feature/posts/hooks/use_posts_feed.js";
import { getPosts } from "@/api_services/posts.js";
import BlogCard from "@/components/cards/blog_card.jsx";

const CATEGORIES = ["Highlight", "General", "Cat", "Dog", "Tech", "Travel", "Food", "Finance"];

export default function ArticleSection() {
  const {
    posts, category, typing, isLoading, errorMsg, hasMore,
    setCategory, setTyping, loadMore,
  } = usePostsFeed();

  const [suggests, setSuggests] = useState([]);
  const [openSuggest, setOpenSuggest] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef(null);


  useEffect(() => {
    const onClick = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpenSuggest(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);


  useEffect(() => {
    const q = typing.trim();
    if (!q) { setSuggests([]); setOpenSuggest(false); return; }

    let alive = true;
    (async () => {
      const data = await getPosts({ page: 1, limit: 5, keyword: q });
      if (!alive) return;
      const seen = new Set();
      const list = (data?.posts ?? [])
        .filter(p => !seen.has(p.id) && (seen.add(p.id), true));
      setSuggests(list);
      setOpenSuggest(true);
    })();
    return () => { alive = false; };
  }, [typing]);

  return (
    <section className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Latest articles</h1>


      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6 w-full">
        {/* Search */}
        <div className="w-full md:max-w-sm relative" ref={boxRef}>
          <input
            type="text"
            placeholder="Search"
            value={typing}
            onChange={(e) => setTyping(e.target.value)}
            onFocus={() => suggests.length && setOpenSuggest(true)}
            className="w-full px-4 py-3 pr-10 rounded-lg border text-muted-foreground"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>

   
          {openSuggest && suggests.length > 0 && (
            <div className="absolute z-20 mt-2 w-full bg-white border rounded-lg shadow overflow-hidden">
              {suggests.map((s) => (
                <button
                  key={`s-${s.id}`}
                  onMouseDown={() => {
                    // onMouseDown ป้องกัน blur input ก่อน navigate
                    navigate(`/post/${s.id}`, { state: { post: s } });
                    setOpenSuggest(false);
                  }}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gray-50"
                >
                  <img
                    src={s.author?.avatar}
                    alt={s.author?.name || "author"}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{s.title}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {s.author?.name || "Unknown"} • {s.category}
                    </div>
                  </div>
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
            rawPost={p} 
            id={p.id}
            image={p.image}
            category={p.category}
            title={p.title}
            description={p.description}
            author={p.author}                          
            date={
              p.displayDate ||
              new Date(p.date).toLocaleDateString("en-GB", {
                day: "2-digit", month: "long", year: "numeric",
              })
            }
            onClick={() => navigate(`/post/${p.id}`, { state: { post: p } })} 
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