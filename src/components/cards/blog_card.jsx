import { Link } from "react-router-dom";

export default function BlogCard({
  id, image, category, title, description, author, date
}) {
  return (
    <article className="rounded-xl overflow-hidden">
      <Link to={`/post/${id}`} state={{ postId: id }}>
        <img src={image} alt={title} className="w-full aspect-[3/2] object-cover rounded-xl" />
      </Link>

      <div className="mt-3">
        <span className="inline-block text-sm px-3 py-1 rounded-full bg-[#d7f4de] text-[#0f7a3b]">
          {category}
        </span>

        <Link to={`/post/${id}`} state={{ postId: id }}>
          <h3 className="mt-3 text-2xl font-extrabold hover:underline">{title}</h3>
        </Link>

        <p className="text-gray-600 mt-2">{description}</p>
        <p className="text-sm text-gray-500 mt-3">{author} · {date}</p>
      </div>
    </article>
  );
}