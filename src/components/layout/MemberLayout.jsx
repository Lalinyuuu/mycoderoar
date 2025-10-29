import { Outlet, NavLink, useLocation } from "react-router-dom";
import { UserRound, RotateCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";

export default function MemberLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const onProfile = pathname.includes("/member/profile") || pathname === "/member";

  return (
    <main className="min-h-screen bg-light-1">
      {/* sub header */}
      <div className="border-b border-light-3 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center gap-3">
          <img
            src={user?.avatar || "/images/avatar/avartar-default.png"}
            alt="avatar"
            className="h-9 w-9 rounded-full object-cover"
            onError={(e) => {
              e.target.src = "/images/avatar/avartar-default.png";
            }}
          />
          <span className="text-[18px] font-medium text-dark-1">
            {user?.name || "Member"}
          </span>
          <span className="text-light-3">|</span>
          <span className="text-[18px] font-semibold text-dark-1">
            {onProfile ? "Profile" : "Reset password"}
          </span>
        </div>
      </div>

     
      <div className="mx-auto max-w-5xl px-6 py-8 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
        {/* sidebar */}
        <aside className="space-y-2">
          <NavLink
            to="/member/profile"
            end
            className={({ isActive }) =>
              [
                "flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-dark-1",
                isActive
                  ? "bg-purple-1 border-purple-3 text-purple-8"
                  : "border-light-3 hover:bg-light-2",
              ].join(" ")
            }
          >
            <UserRound className="h-4 w-4" />
            Profile
          </NavLink>

          <NavLink
            to="/member/reset-password"
            className={({ isActive }) =>
              [
                "flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-dark-1",
                isActive
                  ? "bg-purple-1 border-purple-3 text-purple-8"
                  : "border-light-3 hover:bg-light-2",
              ].join(" ")
            }
          >
            <RotateCcw className="h-4 w-4" />
            Reset password
          </NavLink>
        </aside>

    
        <section>
          <Outlet />
        </section>
      </div>
    </main>
  );
}