import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useImageWithFallback } from "../../hooks/useImageWithFallback";
import { PostService } from '@/services';
import { ARIA_LABELS, KEYBOARD_NAVIGATION } from "../../utils/accessibility";

function getPostImage(p) {
  return (
    p?.image ||
    p?.cover ||
    p?.thumbnail ||
    (Array.isArray(p?.images) ? p.images[0] : null) ||
    p?.author?.avatar ||
    null
  );
}

function ensureHttps(url) {
  if (!url) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("http://")) return url.replace("http://", "https://");
  return url;
}

function SuggestItem({ s, onPick }) {
  const { src, onError } = useImageWithFallback(ensureHttps(getPostImage(s)));
  
  const handleKeyDown = (e) => {
    if (e.key === KEYBOARD_NAVIGATION.ENTER || e.key === KEYBOARD_NAVIGATION.SPACE) {
      e.preventDefault();
      onPick(s);
    }
  };
  
  return (
    <button
      onMouseDown={() => onPick(s)}
      onKeyDown={handleKeyDown}
      aria-label={`View post: ${s.title} by ${s.author?.name || "Unknown"}`}
      className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-purple-2 hover:to-emerald-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-5"
    >
      <img
        src={src}
        onError={onError}
        alt={`${s.title} thumbnail`}
        className="h-7 w-7 rounded object-cover border-2 border-purple-3 shadow-sm"
      />
      <div className="flex-1 min-w-0">
        <div className="truncate font-semibold text-gray-10">{s.title}</div>
        <div className="text-xs text-purple-5 truncate">
          {s.author?.name || "Unknown"} • {s.category}
        </div>
      </div>
    </button>
  );
}

export default function SearchBar({ typing, setTyping }) {
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
    if (!q) {
      setSuggests([]);
      setOpenSuggest(false);
      return;
    }

    let alive = true;
    (async () => {
      const data = await PostService.getPosts({ page: 1, limit: 5, keyword: q });
      if (!alive) return;
      const seen = new Set();
      const list = (data?.posts ?? []).filter(
        (p) => !seen.has(p.id) && (seen.add(p.id), true)
      );
      setSuggests(list);
      setOpenSuggest(true);
    })();
    return () => {
      alive = false;
    };
  }, [typing]);

  return (
    <div className="w-full md:max-w-sm relative" ref={boxRef}>
      <input
        type="text"
        placeholder="Search"
        value={typing}
        onChange={(e) => setTyping(e.target.value)}
        onFocus={() => suggests.length && setOpenSuggest(true)}
        aria-label={ARIA_LABELS.searchInput}
        aria-expanded={openSuggest}
        aria-haspopup="listbox"
        role="combobox"
        className="w-full px-4 py-3 pr-10 rounded-lg border-2 border-purple-3 bg-gradient-to-r from-light-1 to-purple-1/30 text-purple-7 font-medium placeholder:gray-5 placeholder:font-normal focus:outline-none focus:border-purple-5 focus:shadow-lg transition-all"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-5 text-xl" aria-hidden="true">
        🔍
      </span>

      {openSuggest && suggests.length > 0 && (
        <div 
          className="absolute z-20 mt-2 w-full bg-gradient-to-br from-light-1 via-emerald-1/50 to-purple-1 border-2 border-purple-3 rounded-lg shadow-2xl overflow-hidden backdrop-blur-md"
          role="listbox"
          aria-label={ARIA_LABELS.searchResults}
        >
          {suggests.map((s) => (
            <SuggestItem
              key={`s-${s.id}`}
              s={s}
              onPick={(picked) => {
                navigate(`/post/${picked.id}`, { state: { post: picked } });
                setOpenSuggest(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}