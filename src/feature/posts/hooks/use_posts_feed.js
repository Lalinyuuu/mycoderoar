import { useEffect, useMemo, useRef, useState } from "react";
import { getPosts } from "@/api_services/posts.js";
import { formatLongDate } from "@/lib/format.js";

const LIMIT = 6;

export default function usePostsFeed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("Highlight");
  const [typing, setTyping] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [hasMore, setHasMore] = useState(true);


  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [category, typing]);

  
  const debouncedKeyword = useDebounce(typing, 300);

  useEffect(() => {
    let alive = true;

    async function run() {
      setIsLoading(true);
      setErrorMsg("");
      try {
        const params = { page, limit: LIMIT };
        if (category !== "Highlight") params.category = category;
        if (debouncedKeyword.trim()) params.keyword = debouncedKeyword.trim();

        const data = await getPosts(params);
        if (!alive) return;

        const mapped = (data?.posts ?? []).map((p) => ({
          ...p,
          displayDate: formatLongDate(p.date),
        }));


        setPosts((prev) => {
          const seen = new Set(prev.map((x) => x.id));
          const merged = [...prev];
          for (const it of mapped) if (!seen.has(it.id)) { merged.push(it); seen.add(it.id); }
          return merged;
        });

        setHasMore((data?.currentPage ?? 1) < (data?.totalPages ?? 1));
      } catch (err) {
        if (alive) setErrorMsg("Failed to load posts.");
      } finally {
        if (alive) setIsLoading(false);
      }
    }

    run();
    return () => { alive = false; };
  }, [page, category, debouncedKeyword]);

  const loadMore = () => { if (!isLoading && hasMore) setPage((p) => p + 1); };

  return {
    posts, category, typing, isLoading, errorMsg, hasMore,
    setCategory, setTyping, loadMore,
  };
}

function useDebounce(value, delay) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}