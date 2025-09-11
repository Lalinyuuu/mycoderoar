import { useAuth } from "@/contexts/auth_context.jsx";

export default function MemberHome() {
  const { user, logout } = useAuth();

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">Member Management</h1>
      <p className="text-gray-600 mb-6">
        Hello <b>{user?.name}</b> ({user?.email}) — role: <code>{user?.role}</code>
      </p>

      <div className="rounded-2xl border bg-white p-6">
        <h2 className="font-semibold mb-4">Profile</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{user?.name}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-6 rounded-full border px-4 py-2 hover:bg-gray-50"
        >
          Log out
        </button>
      </div>
    </main>
  );
}