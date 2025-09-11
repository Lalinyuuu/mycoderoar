import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown_menu";
import { ChevronDown, LogOut, UserRound, RotateCcw, Shield } from "lucide-react";
import { useAuth } from "@/contexts/auth_context.jsx";
import NotificationBell from "@/components/common/notification_bell.jsx";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const doLogout = () => {
    logout();
    navigate("/"); 
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur border-b">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <NavLink to="/" className="text-2xl font-bold text-gray-900 select-none">
          hh<span className="text-green-500">.</span>
        </NavLink>

        <div className="flex items-center gap-3">
          <NotificationBell />

          {!user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full border px-4 py-2 text-sm hover:bg-gray-50"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-black px-4 py-2 text-sm text-white"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 rounded-full border pl-1 pr-2 py-1"
                  aria-label="Open user menu"
                >
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <span className="hidden sm:inline text-[16px] font-semibold text-neutral-800">
                    {user.name}
                  </span>
                  <ChevronDown className="h-4 w-4 text-neutral-500" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-72 p-2">
                <DropdownMenuItem asChild className="px-3 py-3 text-[15px]">
                  <Link to="/member/profile" className="flex w-full items-center gap-3">
                    <UserRound className="h-5 w-5" />
                    <span className="flex-1">Profile</span>
                    <span className="ml-auto h-2 w-2 rounded-full bg-neutral-600" />
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="px-3 py-3 text-[15px]">
                  <Link to="/member/reset-password" className="flex w-full items-center gap-3">
                    <RotateCcw className="h-5 w-5" />
                    <span className="flex-1">Reset password</span>
                    <span className="ml-auto h-2 w-2 rounded-full bg-neutral-600" />
                  </Link>
                </DropdownMenuItem>

                {user.role === "admin" && (
                  <DropdownMenuItem asChild className="px-3 py-3 text-[15px]">
                    <Link to="/admin" className="flex w-full items-center gap-3">
                      <Shield className="h-5 w-5" />
                      <span className="flex-1">Admin panel</span>
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem className="px-3 py-3 text-[15px]" onSelect={(e)=>e.preventDefault()}>
                  <button onClick={doLogout} className="flex w-full items-center gap-3">
                    <LogOut className="h-5 w-5" />
                    <span className="flex-1 text-left">Log out</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </header>
  );
}