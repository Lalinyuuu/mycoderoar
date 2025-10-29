import { Link } from "react-router-dom";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import { ChevronDown, LogOut, UserRound, RotateCcw, Shield, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "@/components/common/NotificationBell.jsx";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const doLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-light-1/80 backdrop-blur border-b border-light-3">
      <nav className="mx-auto flex h-16 max-w-full items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="relative flex items-center gap-3 py-2">
          <img 
            src="/images/navbar/logo-dev-nav.png" 
            alt="MyCodeRoar Logo" 
            className="h-20 w-20 transition-transform duration-300 hover:scale-105"
          />
          <span className="text-lg font-bold text-dark-1">Ragnarok Guide</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3">
          <NotificationBell />

          {!user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full border border-purple-3 px-4 py-2 text-sm text-dark-1 hover:bg-purple-1"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-gradient-to-r from-purple-6 to-purple-5 px-4 py-2 text-sm text-light-1 hover:from-purple-7 hover:to-purple-6"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-purple-2 pl-1 pr-2 py-1 hover:bg-purple-1">
                  <img
                    src={user.avatar || "/images/avatar/avartar-default.png"}
                    alt="avatar"
                    className="h-9 w-9 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = "/images/avatar/avartar-default.png";
                    }}
                  />
                  <span className="text-[16px] font-semibold text-dark-1">
                    {user.name}
                  </span>
                  <ChevronDown className="h-4 w-4 text-dark-3" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-72 p-2 bg-light-1 border border-purple-2">
                <DropdownMenuItem asChild className="px-3 py-3 text-[15px] text-gray-7 hover:bg-purple-1 hover:text-purple-6 rounded-xl group">
                  <Link to="/member/profile" className="flex w-full items-center gap-3">
                    <UserRound className="h-5 w-5 text-gray-7 group-hover:text-purple-6 transition-colors" />
                    <span className="flex-1 text-gray-7 group-hover:text-purple-6 transition-colors">Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="px-3 py-3 text-[15px] text-gray-7 hover:bg-purple-1 hover:text-purple-6 rounded-xl group">
                  <Link to="/member/reset-password" className="flex w-full items-center gap-3">
                    <RotateCcw className="h-5 w-5 text-gray-7 group-hover:text-purple-6 transition-colors" />
                    <span className="flex-1 text-gray-7 group-hover:text-purple-6 transition-colors">Reset password</span>
                  </Link>
                </DropdownMenuItem>

                {user.role === "admin" && (
                  <DropdownMenuItem asChild className="px-3 py-3 text-[15px] text-gray-7 hover:bg-purple-1 hover:text-purple-6 rounded-xl group">
                    <Link to="/admin" className="flex w-full items-center gap-3">
                      <Shield className="h-5 w-5 text-gray-7 group-hover:text-purple-6 transition-colors" />
                      <span className="flex-1 text-gray-7 group-hover:text-purple-6 transition-colors">Admin panel</span>
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="bg-purple-2" />

                <DropdownMenuItem className="px-3 py-3 text-[15px] text-red-6 hover:bg-red-1 rounded-xl group" onSelect={(e) => e.preventDefault()}>
                  <button onClick={doLogout} className="flex w-full items-center gap-3">
                    <LogOut className="h-5 w-5 text-red-6 group-hover:text-red-7 transition-colors" />
                    <span className="flex-1 text-left text-red-6 group-hover:text-red-7 transition-colors">Log out</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <NotificationBell />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-purple-6"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-purple-2 bg-light-1">
          <div className="px-4 py-4 space-y-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center rounded-full border border-purple-3 px-4 py-2 text-sm text-dark-1 hover:bg-purple-1"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center rounded-full bg-gradient-to-r from-purple-6 to-purple-5 px-4 py-2 text-sm text-light-1 hover:from-purple-7 hover:to-purple-6"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 pb-3 border-b border-purple-2">
                  <img 
                    src={user.avatar || "/images/avatar/avartar-default.png"} 
                    alt="avatar" 
                    className="h-10 w-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = "/images/avatar/avartar-default.png";
                    }}
                  />
                  <div>
                    <p className="font-semibold text-dark-1">{user.name}</p>
                    <p className="text-sm text-dark-3">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/member/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-dark-1 hover:text-purple-6"
                >
                  <UserRound className="h-5 w-5 text-purple-6" />
                  Profile
                </Link>
                <Link
                  to="/member/reset-password"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-dark-1 hover:text-purple-6"
                >
                  <RotateCcw className="h-5 w-5 text-purple-6" />
                  Reset password
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2 text-dark-1 hover:text-purple-6"
                  >
                    <Shield className="h-5 w-5 text-purple-6" />
                    Admin panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    doLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 py-2 text-error w-full hover:opacity-80"
                >
                  <LogOut className="h-5 w-5" />
                  Log out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}