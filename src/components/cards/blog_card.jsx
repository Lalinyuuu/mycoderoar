import { Link } from "react-router-dom";
import { useState } from "react";

const FALLBACK_IMG =
  "https://via.placeholder.com/800x450?text=Image+not+available";
const FALLBACK_AVATAR =
  "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg";


export default function BlogCard({
  id,
  image,
  category,
  title,
  description,
  author,
  date,
  rawPost, 
}) {
  const [src, setSrc] = useState(image || FALLBACK_IMG);

  const a =
    typeof author === "string"
      ? { name: author, avatar: FALLBACK_AVATAR }
      : {
          name: author?.name || "Thompson P.",
          avatar: author?.avatar || FALLBACK_AVATAR,
        };


  const postForState =
    rawPost ?? {
      id,
      image: src,
      category,
      title,
      description,
      author: a,
      displayDate: date,
    };

  return (
    <article className="border rounded-xl overflow-hidden bg-white">
      <Link to={`/post/${id}`} state={{ post: postForState }} aria-label={title}>
        <div className="w-full h-48 bg-gray-100">
          <img
            src={src}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={() => setSrc(FALLBACK_IMG)}
          />
        </div>
      </Link>

      <div className="p-5">
        {category && (
          <div className="text-xs text-green-700 font-medium mb-2">
            {category}
          </div>
        )}

        <Link to={`/post/${id}`} state={{ post: postForState }} className="block">
          <h3 className="text-lg font-semibold leading-snug hover:underline">
            {title}
          </h3>
        </Link>

        {description && (
          <p className="text-gray-600 text-sm mt-2 line-clamp-3">{description}</p>
        )}

        <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
          <img
            src={a.avatar}
            alt={a.name}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-gray-800">By {a.name}</span>
          {date && (
            <>
              <span className="mx-1">·</span>
              <time>{date}</time>
            </>
          )}
        </div>
      </div>
    </article>
  );
}