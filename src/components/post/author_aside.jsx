export default function AuthorAside({ author }) {
  if (!author) return null;

  return (
    <aside
      className="
        w-full lg:w-[320px]
        rounded-2xl bg-[#F3F1ED] p-6
        lg:sticky lg:top-24
      "
    >
      <div className="flex items-center gap-3">
        <img
          src={author.avatar}
          alt={author.name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <div className="text-sm text-gray-500">Author</div>
          <div className="text-xl font-semibold">{author.name}</div>
        </div>
      </div>

      <hr className="my-5 border-gray-200" />

      <p className="leading-7 text-gray-700">{author.bio1}</p>
      <p className="mt-5 leading-7 text-gray-700">{author.bio2}</p>
    </aside>
  );
}