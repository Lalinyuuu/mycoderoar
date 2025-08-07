export default function NavBar() {
    return (
      <nav className="flex justify-between items-center px-8 py-4 border-b">
        <div className="text-2xl font-bold text-gray-900">
          hh<span className="text-green-500">.</span>
        </div>
        <div className="space-x-4">
          <button className="px-4 py-2 rounded-full border border-black text-black">
            Log in
          </button>
          <button className="px-4 py-2 rounded-full bg-black text-white">
            Sign up
          </button>
        </div>
      </nav>
    );
  }