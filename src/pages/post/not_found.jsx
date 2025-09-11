import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="max-w-xl mx-auto py-20 text-center">
      <div className="text-5xl font-bold mb-4">!</div>
      <h1 className="text-2xl font-semibold mb-6">Page Not Found</h1>
      <Link
        to="/"
        className="inline-block px-6 py-3 rounded-full bg-black text-white"
      >
        Go To Homepage
      </Link>
    </main>
  );
}