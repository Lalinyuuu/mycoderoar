import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getPosts } from "@/api_services/posts.js";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

function ActionBar({ url, likes = 0, onLike, onCopy }) {
  const share = (site) => {
    const enc = encodeURIComponent(url);
    const map = {
      fb: `https://www.facebook.com/share.php?u=${enc}`,
      li: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`,
      tw: `https://www.twitter.com/share?&url=${enc}`,
    };
    window.open(map[site], "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center justify-between gap-3 bg-[#f3f2ef] px-4 py-3 rounded-2xl">
      {/* Like pill (ซ้าย) */}
      <button
        onClick={onLike}
        className="px-5 py-3 rounded-full border flex items-center gap-2"
      >
        <span>🙂</span> {likes}
      </button>

      {/* Copy + Social (ขวา) */}
      <div className="flex items-center gap-3">
        <button onClick={onCopy} className="px-5 py-3 rounded-full border flex items-center gap-2">
          <span>📋</span> Copy link
        </button>
        <button onClick={() => share("fb")} aria-label="Share to Facebook" className="rounded-full w-10 h-10 bg-[#1877F2] text-white">f</button>
        <button onClick={() => share("li")} aria-label="Share to LinkedIn" className="rounded-full w-10 h-10 bg-[#0A66C2] text-white">in</button>
        <button onClick={() => share("tw")} aria-label="Share to X" className="rounded-full w-10 h-10 bg-[#1DA1F2] text-white">X</button>
      </div>
    </div>
  );
}

export default function ViewPostPage() {
  const { postId } = useParams();
  const nav = useNavigate();
  const { state } = useLocation();
  const [post, setPost] = useState(state?.post || null);
  const [showLogin, setShowLogin] = useState(false);


  useEffect(() => {
    if (post) return;
    let alive = true;
    (async () => {
      let page = 1, found = null;
      while (!found && page < 100) {
        const data = await getPosts({ page, limit: 12 });
        found = (data?.posts || []).find(p => String(p.id) === String(postId));
        if (found || (data?.currentPage ?? 1) >= (data?.totalPages ?? 1)) break;
        page++;
      }
      if (!alive) return;
      if (!found) nav("/not-found");
      else setPost(found);
    })();
    return () => { alive = false; };
  }, [postId, post, nav]);

  const pageUrl = useMemo(() => window.location.href, []);
  const likeOrComment = () => setShowLogin(true);
  const copyLink = async () => {
    await navigator.clipboard.writeText(pageUrl);
    toast.success("This article has been copied to your clipboard.");
  };

  if (!post) return <div className="max-w-3xl mx-auto p-6">Loading...</div>;

  return (
    <article className="max-w-3xl mx-auto p-6">
      <img src={post.image} alt={post.title} className="w-full rounded-2xl aspect-[3/2] object-cover" />

      <div className="mt-6 flex items-center gap-3 text-sm text-gray-500">
        <span className="px-3 py-1 rounded-full bg-[#d7f4de] text-[#0f7a3b]">{post.category}</span>
        <span>{new Date(post.date).toLocaleDateString("en-GB", { day:"2-digit", month:"long", year:"numeric" })}</span>
      </div>

      <h1 className="text-4xl font-extrabold mt-3">{post.title}</h1>
      <p className="text-gray-600 mt-2">{post.description}</p>

      <div className="markdown mt-6">
        <ReactMarkdown>{post.content || ""}</ReactMarkdown>
      </div>


      <div className="mt-6">
        <ActionBar url={pageUrl} likes={post.likes} onLike={likeOrComment} onCopy={copyLink} />
      </div>


      {showLogin && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center">
          <div className="bg-white rounded-2xl p-8 w-[min(90vw,520px)] relative">
            <button className="absolute right-4 top-4" onClick={() => setShowLogin(false)}>✕</button>
            <h3 className="text-2xl font-bold mt-2">Create an account to continue</h3>
            <button className="mt-6 w-full bg-black text-white rounded-full py-3">Create account</button>
            <p className="text-center text-sm text-gray-600 mt-3">
              Already have an account? <span className="underline">log in</span>
            </p>
          </div>
        </div>
      )}


      <div className="mt-8">
        <h3 className="font-semibold text-xl mb-2">Comment</h3>
        <textarea
          className="w-full h-36 rounded-xl border p-4"
          placeholder="What are your thoughts?"
          onFocus={() => setShowLogin(true)}
        />
        <div className="mt-3 flex justify-end">
          <button className="px-6 py-3 rounded-full bg-black text-white" onClick={() => setShowLogin(true)}>
            Send
          </button>
        </div>
      </div>
    </article>
  );
}