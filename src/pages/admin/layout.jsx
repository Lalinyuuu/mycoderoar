import { NavLink, Outlet } from "react-router-dom";
import { LayoutGrid, FileText, Users } from "lucide-react";

export default function AdminLayout() {
  return (
    <main className="min-h-screen bg-[#f7f6f4]">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <h1 className="text-xl font-semibold">Admin panel</h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 grid gap-8 md:grid-cols-[220px_1fr]">
      
        <aside className="space-y-2">
          <AdminLink to="/admin" end icon={<LayoutGrid className="h-4 w-4" />}>
            Dashboard
          </AdminLink>
          <AdminLink to="/admin/posts" icon={<FileText className="h-4 w-4" />}>
            Posts
          </AdminLink>
          <AdminLink to="/admin/users" icon={<Users className="h-4 w-4" />}>
            Users
          </AdminLink>
        </aside>

     
        <section className="min-w-0">
          <Outlet />
        </section>
      </div>
    </main>
  );
}

function AdminLink({ to, icon, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
          isActive ? "bg-[#f0efec] border-neutral-300" : "hover:bg-neutral-50",
        ].join(" ")
      }
    >
      {icon}
      {children}
    </NavLink>
  );
}