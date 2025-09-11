import { useState } from "react";
import { useAuth } from "@/contexts/auth_context.jsx";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);

  const onPickAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      await updateProfile({ avatarDataUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setOk(false);
    try {
      await updateProfile({ name, username });
      setOk(true);
    } finally {
      setSaving(false);
      setTimeout(() => setOk(false), 2500);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-[220px,1fr] gap-8">
        {/* Left menu */}
        <aside className="space-y-3">
          <div className="rounded-lg border bg-gray-50 px-4 py-3 font-medium">
            Profile
          </div>
          <a
            href="/member/reset-password"
            className="block rounded-lg border px-4 py-3 text-gray-700 hover:bg-gray-50"
          >
            Reset password
          </a>
        </aside>

     
        <section className="rounded-2xl border bg-[#f7f6f4] p-8">
          {/* Avatar + upload */}
          <div className="flex items-center gap-6">
            <img
              src={user?.avatar}
              className="h-20 w-20 rounded-full object-cover"
              alt="avatar"
            />
            <label className="inline-flex items-center rounded-full border px-4 py-2 cursor-pointer bg-white hover:bg-gray-50">
              <input type="file" accept="image/*" hidden onChange={onPickAvatar} />
              Upload profile picture
            </label>
          </div>

          <hr className="my-8" />

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm text-gray-600">Name</label>
              <input
                className="w-full rounded-lg border bg-white px-4 py-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-600">Username</label>
              <input
                className="w-full rounded-lg border bg-white px-4 py-3"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-600">Email</label>
              <input
                className="w-full rounded-lg border bg-gray-100 px-4 py-3"
                value={user?.email ?? ""}
                readOnly
              />
            </div>

            <button
              disabled={saving}
              className="rounded-full bg-black px-6 py-3 font-medium text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            {ok && (
              <p className="text-sm text-emerald-600">Profile saved successfully.</p>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}