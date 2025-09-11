import { Outlet, NavLink, useLocation } from "react-router-dom";
import { UserRound, RotateCcw } from "lucide-react";
import { useAuth } from "@/contexts/auth_context.jsx";

export default function MemberLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const onProfile = pathname.includes("/member/profile") || pathname === "/member";

  return (
    <main className="min-h-screen bg-[#f7f6f4]">
      {/* sub header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center gap-3">
          <img
            src={user?.avatar || "/images/avatar/profile_mockup.jpg"}
            alt="avatar"
            className="h-9 w-9 rounded-full object-cover"
          />
          <span className="text-[18px] font-medium text-neutral-800">
            {user?.name || "Member"}
          </span>
          <span className="text-neutral-300">|</span>
          <span className="text-[18px] font-semibold text-neutral-900">
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
                "flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
                isActive
                  ? "bg-[#f0efec] border-neutral-300"
                  : "hover:bg-neutral-50",
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
                "flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
                isActive
                  ? "bg-[#f0efec] border-neutral-300"
                  : "hover:bg-neutral-50",
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