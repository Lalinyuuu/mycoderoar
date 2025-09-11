import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context.jsx";

const DEMO_EMAIL  = "demo@hh.dev";
const DEMO_PASS   = "Demo-HH_2024#98Lk";
const ADMIN_EMAIL = "admin@hh.dev";
const ADMIN_PASS  = "Admin-HH_2024#98Lk";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const user = await login({ email, password });

      nav(user.role === "admin" ? "/admin" : "/");
    } catch (error) {
      setErr(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASS);
  };
  const fillAdmin = () => {
    setEmail(ADMIN_EMAIL);
    setPassword(ADMIN_PASS);
  };

  return (
    <main className="mx-auto max-w-lg px-6 py-12">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <p className="text-sm text-slate-500 mb-2">
          <b>Demo (member):</b> {DEMO_EMAIL} / {DEMO_PASS}
          <br />
          <b>Demo (admin):</b> {ADMIN_EMAIL} / {ADMIN_PASS}
        </p>

        <h2 className="text-slate-500 text-sm">Admin panel</h2>
        <h1 className="text-4xl font-bold mb-6">Log in</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-lg border px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border px-4 py-3"
              required
            />
          </div>

          {err && (
            <div className="rounded-lg bg-rose-50 text-rose-600 px-4 py-2 text-sm">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-black text-white py-3 font-medium disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={fillDemo}
              className="rounded-full border py-3 font-medium"
            >
              Login as demo
            </button>
            <button
              type="button"
              onClick={fillAdmin}
              className="rounded-full border py-3 font-medium"
            >
              Login as admin
            </button>
          </div>
        </form>

        <p className="text-sm text-slate-600 mt-6 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}