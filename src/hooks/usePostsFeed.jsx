import { useEffect, useRef, useState, useCallback } from "react";
import { PostService } from '@/services';
import { handleApiCall } from '@/utils/apiHelpers';
import { handleError } from '@/utils/errorHandling';
import { transformPosts } from '@/utils/dataTransformers';
import { extractPaginationData } from '@/utils/apiHelpers';

const PAGE_SIZE = 10;

export default function usePostsFeed() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("All");
  const [typing, setTyping] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const reqIdRef = useRef(0);

  const handleSetCategory = useCallback((next) => {
    if (next === category) return;
    setCategory(next);
    setPage(1);
    setPosts([]);
    setHasMore(true);
    setErrorMsg("");
  }, [category]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setPage((p) => p + 1);
  }, [isLoading, hasMore]);

  const fetchPosts = useCallback(async () => {
    let alive = true;
    const myReq = ++reqIdRef.current;

    setIsLoading(true);
    setErrorMsg("");

    try {
      const params = {
        page,
        limit: PAGE_SIZE,
        keyword: typing.trim(),
      };

      // Add category filter if not "All"
      if (category !== "All") {
        params.category = category;
      }

      const result = await handleApiCall(
        () => PostService.getPosts(params),
        {
          showErrorToast: false,
          fallbackMessage: 'Failed to load posts'
        }
      );

      if (!alive || myReq !== reqIdRef.current) return;

      if (result.success) {
        const fetched = transformPosts(result.data.posts || result.data || []);
        const pagination = extractPaginationData(result.data);
        
        setPosts((prev) => (page === 1 ? fetched : [...prev, ...fetched]));
        setHasMore(fetched.length === PAGE_SIZE);
      } else {
        setErrorMsg(result.error);
      }
    } catch (err) {
      if (!alive || myReq !== reqIdRef.current) return;
      const errorMessage = err?.message || "Failed to load posts";
      setErrorMsg(errorMessage);
      handleError(err, {
        showToast: false,
        fallbackMessage: errorMessage
      });
    } finally {
      if (alive && myReq === reqIdRef.current) {
        // Remove delay to prevent hanging
        setIsLoading(false);
      }
    }

    return () => {
      alive = false;
    };
  }, [page, category, typing]);

  useEffect(() => {
    fetchPosts();
  }, [page, category, typing]);

  return {
    posts,
    category,
    typing,
    isLoading,
    errorMsg,
    hasMore,
    setCategory: handleSetCategory,
    setTyping,
    loadMore,
  };
}