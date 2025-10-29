import { useAuth } from "@/contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function MemberHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const doLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 bg-dark-1 min-h-screen">
      <h1 className="text-2xl font-bold mb-2 text-light-1">Member Management</h1>
      <p className="text-light-3 mb-6">
        Hello <b className="text-purple-2">{user?.name}</b> ({user?.email}) — role: <code className="bg-dark-3 text-purple-3 px-2 py-1 rounded">{user?.role}</code>
      </p>

      <div className="rounded-2xl border border-dark-3 bg-dark-2/90 p-6 shadow-lg">
        <h2 className="font-semibold mb-4 text-light-1">Profile</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-dark-3 p-4 bg-dark-3/50">
            <p className="text-sm text-light-3">Name</p>
            <p className="font-medium text-light-1">{user?.name}</p>
          </div>
          <div className="rounded-lg border border-dark-3 p-4 bg-dark-3/50">
            <p className="text-sm text-light-3">Email</p>
            <p className="font-medium text-light-1">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={doLogout}
          className="bg-error text-light-1 mt-6 rounded-full px-4 py-2 transition-all hover:bg-error/80"
        >
          Log out
        </button>
      </div>
    </main>
  );
}