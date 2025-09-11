import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="text-center">
        <div className="text-6xl">!</div>
        <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
        <Link to="/" className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-full">
          Go To Homepage
        </Link>
      </div>
    </div>
  );
}