import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { getPosts } from "@/api_services/posts.js";
import AuthorAside from "@/components/post/author_aside.jsx";


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
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#f3f2ef] px-4 py-3">
      <button onClick={onLike} className="flex items-center gap-2 rounded-full border px-5 py-3">
        <span>🙂</span> {likes ?? 0}
      </button>

      <div className="flex items-center gap-3">
        <button onClick={onCopy} className="flex items-center gap-2 rounded-full border px-5 py-3">
          <span>📋</span> Copy link
        </button>
        <button onClick={() => share("fb")} className="h-10 w-10 rounded-full bg-[#1877F2] text-white">f</button>
        <button onClick={() => share("li")} className="h-10 w-10 rounded-full bg-[#0A66C2] text-white">in</button>
        <button onClick={() => share("tw")} className="h-10 w-10 rounded-full bg-[#1DA1F2] text-white">X</button>
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
      let page = 1;
      let found = null;
      while (!found && page < 100) {
        const data = await getPosts({ page, limit: 12 });
        const list = data?.posts || [];
        found = list.find((p) => String(p.id) === String(postId));
        if (found || (data?.currentPage ?? 1) >= (data?.totalPages ?? 1)) break;
        page++;
      }
      if (!alive) return;
      if (!found) nav("/not-found");
      else setPost(found);
    })();
    return () => {
      alive = false;
    };
  }, [postId, post, nav]);

  const pageUrl = useMemo(() => window.location.href, []);
  const likeOrComment = () => setShowLogin(true);
  const copyLink = async () => {
    await navigator.clipboard.writeText(pageUrl);
    toast.success("This article has been copied to your clipboard.");
  };

  if (!post) return <div className="mx-auto max-w-5xl p-6">Loading...</div>;


  return (
    <article className="mx-auto max-w-[1100px] px-4 py-10">

      <figure className="relative aspect-[16/9] w-full max-h-[460px] overflow-hidden rounded-2xl bg-gray-100">
        <img
          src={post.image}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </figure>

   
      <div className="mt-6 flex items-center gap-3 text-sm text-gray-500">
        <span className="rounded-full bg-[#d7f4de] px-3 py-1 font-medium text-[#0f7a3b]">
          {post.category}
        </span>
        <time>
          {post.date
            ? new Date(post.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "—"}
        </time>
      </div>

      <h1 className="mt-3 text-4xl font-extrabold leading-tight">{post.title}</h1>
      <p className="mt-2 text-lg text-gray-600">{post.description}</p>

      {/* เนื้อหา + กล่องผู้เขียน: ทำเป็น 2 คอลัมน์เมื่อจอกว้าง */}
      <div
        className="
          mt-8 grid gap-10
          lg:grid-cols-[minmax(0,1fr)_320px]  /* คอลัมน์ซ้ายยืด, ขวาคงที่ 320px */
          items-start
        "
      >
      
        <div>
          <div className="prose prose-neutral max-w-none">
            <ReactMarkdown>{post.content || ""}</ReactMarkdown>
          </div>

          <div className="mt-9">
            <ActionBar
              url={pageUrl}
              likes={post.likes}
              onLike={likeOrComment}
              onCopy={copyLink}
            />
          </div>

 
          <div className="mt-8">
            <h3 className="mb-2 text-xl font-semibold">Comment</h3>
            <textarea
              className="h-36 w-full rounded-xl border p-4"
              placeholder="What are your thoughts?"
              onFocus={() => setShowLogin(true)}
            />
            <div className="mt-3 flex justify-end">
              <button
                className="rounded-full bg-black px-6 py-3 text-white"
                onClick={() => setShowLogin(true)}
              >
                Send
              </button>
            </div>
          </div>
        </div>


        <div className="hidden lg:block">
          <AuthorAside author={post.author} />
        </div>
      </div>


      {showLogin && (
        <div className="grid place-items-center bg-black/40 fixed inset-0">
          <div className="relative w-[min(90vw,520px)] rounded-2xl bg-white p-8">
            <button className="absolute right-4 top-4" onClick={() => setShowLogin(false)}>
              ✕
            </button>
            <h3 className="mt-2 text-2xl font-bold">Create an account to continue</h3>
            <button className="mt-6 w-full rounded-full bg-black py-3 text-white">
              Create account
            </button>
            <p className="mt-3 text-center text-sm text-gray-600">
              Already have an account? <span className="underline">log in</span>
            </p>
          </div>
        </div>
      )}
    </article>
  );
}