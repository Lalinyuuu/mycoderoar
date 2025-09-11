import { useState } from "react";


function ImagePicker({ label, value, onChange }) {
  const pick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="rounded-xl border p-4 bg-white">
      <p className="mb-3 text-sm text-gray-600">{label}</p>
      {value ? (
        <div className="space-y-3">
          <img src={value} alt={label} className="w-full rounded-lg object-cover" />
          <div className="flex gap-2">
            <label className="inline-flex cursor-pointer rounded-lg border px-3 py-2">
              <input type="file" hidden accept="image/*" onChange={pick} />
              Replace
            </label>
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-lg border px-3 py-2"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label className="flex h-40 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed bg-gray-50">
          <input type="file" hidden accept="image/*" onChange={pick} />
          <span className="text-sm text-gray-600">Upload image</span>
        </label>
      )}
    </div>
  );
}

export default function AdminPostsPage() {
  const [title, setTitle] = useState("");
  const [hero, setHero] = useState("");
  const [contentCover, setContentCover] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    alert("Saved (mock)\n" + JSON.stringify({ title, hero, contentCover, thumbnail }, null, 2));
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold">Posts</h1>

      <form onSubmit={onSubmit} className="space-y-6">
        <input
          className="w-full rounded-lg border px-4 py-3"
          placeholder="Title…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

     
        <div className="grid md:grid-cols-3 gap-4">
          <ImagePicker label="Hero image" value={hero} onChange={setHero} />
          <ImagePicker
            label="Content header image"
            value={contentCover}
            onChange={setContentCover}
          />
          <ImagePicker label="Thumbnail" value={thumbnail} onChange={setThumbnail} />
        </div>

        <button className="rounded-full bg-black px-6 py-3 font-medium text-white">
          Save post
        </button>
      </form>
    </main>
  );
}