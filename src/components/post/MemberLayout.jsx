import { Navigate, Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRound, RotateCcw } from 'lucide-react';

export default function MemberLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-6"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-light-1">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-light-3 p-4 sticky top-24">
              <nav className="space-y-2">
                <NavLink
                  to="/member/profile"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? 'bg-purple-1 text-purple-8 font-medium border border-purple-3'
                        : 'text-dark-1 hover:bg-light-2'
                    }`
                  }
                >
                  <UserRound className="w-5 h-5" />
                  Profile
                </NavLink>

                <NavLink
                  to="/member/reset-password"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? 'bg-purple-1 text-purple-8 font-medium border border-purple-3'
                        : 'text-dark-1 hover:bg-light-2'
                    }`
                  }
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset Password
                </NavLink>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="col-span-9">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}