import { useNavigate, useLocation, Outlet, Link, NavLink } from "react-router-dom";
import { LayoutGrid, FileText, Users, FolderOpen, Bell, Lock, User, ChevronDown, BarChart3 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState, useRef } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Map routes to tab values
  const routeToTab = {
    "/admin": "dashboard",
    "/admin/posts": "posts",
    "/admin/categories": "categories",
    "/admin/users": "users",
    "/admin/statistics": "statistics",
    "/admin/profile": "profile",
    "/admin/notifications": "notifications",
    "/admin/reset-password": "reset-password"
  };

  const tabToRoute = {
    "dashboard": "/admin",
    "posts": "/admin/posts",
    "categories": "/admin/categories",
    "users": "/admin/users",
    "statistics": "/admin/statistics",
    "profile": "/admin/profile",
    "notifications": "/admin/notifications",
    "reset-password": "/admin/reset-password"
  };

  useEffect(() => {
    const tab = routeToTab[location.pathname] || "dashboard";
    setActiveTab(tab);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabChange = (value) => {
    setActiveTab(value);
    const route = tabToRoute[value];
    if (route) {
      navigate(route);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-1 via-dark-2 to-dark-1">
      <div className="border-b-2 border-purple-8/30 bg-gradient-to-r from-dark-2 via-purple-9/20 to-dark-2 backdrop-blur-sm shadow-lg">
        <div className="mx-auto w-full px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-3 via-purple-2 to-emerald-2 bg-clip-text text-transparent">
              Admin panel
            </h1>
          </div>
        </div>
      </div>

      {/* Mobile: Tabs + Dropdown */}
      <div className="md:hidden mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center gap-2">
          {/* Main 4 Tabs - Modern Design */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 min-w-0">
            <div className="overflow-x-auto pb-2 scrollbar-hide">
              <TabsList className="inline-flex w-full bg-gradient-to-r from-purple-6/10 via-pink-5/10 to-purple-6/10 backdrop-blur-xl border border-purple-5/20 rounded-2xl shadow-[0_8px_32px_purple-5/25] gap-1 p-1">
                <TabsTrigger 
                  value="dashboard" 
                  className="relative flex flex-col items-center gap-1 flex-1 min-w-[60px] px-2 py-2.5 rounded-xl transition-all duration-300 group overflow-hidden"
                  style={{
                    background: activeTab === 'dashboard' 
                      ? 'linear-gradient(135deg, purple-5 0%, pink-5 100%)'
                      : 'transparent'
                  }}
                >
                  {activeTab === 'dashboard' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  )}
                  <LayoutGrid className={`h-4 w-4 transition-all duration-300 ${activeTab === 'dashboard' ? 'text-white scale-110' : 'text-purple-5 group-hover:text-purple-4 group-hover:scale-105'}`} />
                  <span className={`text-[9px] font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'dashboard' ? 'text-white' : 'text-purple-6 group-hover:text-purple-5'}`}>Dashboard</span>
                  {activeTab === 'dashboard' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full" />}
                </TabsTrigger>
                <TabsTrigger 
                  value="posts" 
                  className="relative flex flex-col items-center gap-1 flex-1 min-w-[60px] px-2 py-2.5 rounded-xl transition-all duration-300 group overflow-hidden"
                  style={{
                    background: activeTab === 'posts' 
                      ? 'linear-gradient(135deg, purple-5 0%, pink-5 100%)'
                      : 'transparent'
                  }}
                >
                  {activeTab === 'posts' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  )}
                  <FileText className={`h-4 w-4 transition-all duration-300 ${activeTab === 'posts' ? 'text-white scale-110' : 'text-purple-5 group-hover:text-purple-4 group-hover:scale-105'}`} />
                  <span className={`text-[9px] font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'posts' ? 'text-white' : 'text-purple-6 group-hover:text-purple-5'}`}>Articles</span>
                  {activeTab === 'posts' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full" />}
                </TabsTrigger>
                <TabsTrigger 
                  value="categories" 
                  className="relative flex flex-col items-center gap-1 flex-1 min-w-[60px] px-2 py-2.5 rounded-xl transition-all duration-300 group overflow-hidden"
                  style={{
                    background: activeTab === 'categories' 
                      ? 'linear-gradient(135deg, purple-5 0%, pink-5 100%)'
                      : 'transparent'
                  }}
                >
                  {activeTab === 'categories' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  )}
                  <FolderOpen className={`h-4 w-4 transition-all duration-300 ${activeTab === 'categories' ? 'text-white scale-110' : 'text-purple-5 group-hover:text-purple-4 group-hover:scale-105'}`} />
                  <span className={`text-[9px] font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'categories' ? 'text-white' : 'text-purple-6 group-hover:text-purple-5'}`}>Categories</span>
                  {activeTab === 'categories' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full" />}
                </TabsTrigger>
                <TabsTrigger 
                  value="users" 
                  className="relative flex flex-col items-center gap-1 flex-1 min-w-[60px] px-2 py-2.5 rounded-xl transition-all duration-300 group overflow-hidden"
                  style={{
                    background: activeTab === 'users' 
                      ? 'linear-gradient(135deg, purple-5 0%, pink-5 100%)'
                      : 'transparent'
                  }}
                >
                  {activeTab === 'users' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  )}
                  <Users className={`h-4 w-4 transition-all duration-300 ${activeTab === 'users' ? 'text-white scale-110' : 'text-purple-5 group-hover:text-purple-4 group-hover:scale-105'}`} />
                  <span className={`text-[9px] font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'users' ? 'text-white' : 'text-purple-6 group-hover:text-purple-5'}`}>Users</span>
                  {activeTab === 'users' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full" />}
                </TabsTrigger>
                <TabsTrigger 
                  value="statistics" 
                  className="relative flex flex-col items-center gap-1 flex-1 min-w-[60px] px-2 py-2.5 rounded-xl transition-all duration-300 group overflow-hidden"
                  style={{
                    background: activeTab === 'statistics' 
                      ? 'linear-gradient(135deg, purple-5 0%, pink-5 100%)'
                      : 'transparent'
                  }}
                >
                  {activeTab === 'statistics' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  )}
                  <BarChart3 className={`h-4 w-4 transition-all duration-300 ${activeTab === 'statistics' ? 'text-white scale-110' : 'text-purple-5 group-hover:text-purple-4 group-hover:scale-105'}`} />
                  <span className={`text-[9px] font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'statistics' ? 'text-white' : 'text-purple-6 group-hover:text-purple-5'}`}>Stats</span>
                  {activeTab === 'statistics' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full" />}
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>

          {/* Dropdown - Modern Design */}
          <div ref={dropdownRef} className="relative flex-shrink-0">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-300 min-w-[56px] backdrop-blur-xl border shadow-2xl overflow-hidden group ${
                ['profile', 'notifications', 'reset-password'].includes(activeTab)
                  ? "bg-gradient-to-br from-purple-5 to-pink-5 border-purple-4/50 text-white shadow-[0_0_20px_purple-5/50]"
                  : "bg-purple-6/10 border-purple-5/20 text-purple-5 hover:bg-purple-5/20 hover:border-purple-4/40 hover:text-purple-4"
              }`}
            >
              {['profile', 'notifications', 'reset-password'].includes(activeTab) && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              )}
              <User className={`h-4 w-4 transition-all duration-300 ${['profile', 'notifications', 'reset-password'].includes(activeTab) ? 'scale-110' : 'group-hover:scale-105'}`} />
              <ChevronDown className={`h-3 w-3 transition-all duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu - Modern */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-3 w-56 bg-gradient-to-br from-dark-2/98 via-purple-6/10 to-dark-2/98 backdrop-blur-2xl border border-purple-5/30 rounded-2xl shadow-[0_20px_60px_purple-5/30] overflow-hidden z-50 animate-slide-in-up">
                <div className="p-1.5 space-y-1">
                  <button
                    onClick={() => {
                      navigate('/admin/profile');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                      activeTab === 'profile'
                        ? "bg-gradient-to-r from-purple-5 to-pink-5 text-light-1 shadow-lg shadow-purple-5/40"
                        : "text-purple-4 hover:bg-purple-6/20 hover:text-light-1"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                      activeTab === 'profile' 
                        ? "bg-white/20" 
                        : "bg-purple-6/20 group-hover:bg-purple-5/30"
                    }`}>
                      <User className={`h-4 w-4 ${activeTab === 'profile' ? 'text-white' : 'text-purple-5 group-hover:text-purple-4'}`} />
                    </div>
                    <span>Profile</span>
                    {activeTab === 'profile' && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      navigate('/admin/notifications');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                      activeTab === 'notifications'
                        ? "bg-gradient-to-r from-purple-5 to-pink-5 text-light-1 shadow-lg shadow-purple-5/40"
                        : "text-purple-4 hover:bg-purple-6/20 hover:text-light-1"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                      activeTab === 'notifications' 
                        ? "bg-white/20" 
                        : "bg-purple-6/20 group-hover:bg-purple-5/30"
                    }`}>
                      <Bell className={`h-4 w-4 ${activeTab === 'notifications' ? 'text-white' : 'text-purple-5 group-hover:text-purple-4'}`} />
                    </div>
                    <span>Notifications</span>
                    {activeTab === 'notifications' && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      navigate('/admin/reset-password');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                      activeTab === 'reset-password'
                        ? "bg-gradient-to-r from-purple-5 to-pink-5 text-light-1 shadow-lg shadow-purple-5/40"
                        : "text-purple-4 hover:bg-purple-6/20 hover:text-light-1"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                      activeTab === 'reset-password' 
                        ? "bg-white/20" 
                        : "bg-purple-6/20 group-hover:bg-purple-5/30"
                    }`}>
                      <Lock className={`h-4 w-4 ${activeTab === 'reset-password' ? 'text-white' : 'text-purple-5 group-hover:text-purple-4'}`} />
                    </div>
                    <span>Reset Password</span>
                    {activeTab === 'reset-password' && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop: Sidebar + Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-4 grid gap-8 md:grid-cols-[260px_1fr]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block space-y-2">
          <AdminLink to="/admin" end icon={<LayoutGrid className="h-5 w-5" />}>
            Dashboard
          </AdminLink>
          <AdminLink to="/admin/posts" icon={<FileText className="h-5 w-5" />}>
            Article management
          </AdminLink>
          <AdminLink to="/admin/categories" icon={<FolderOpen className="h-5 w-5" />}>
            Category management
          </AdminLink>
          <AdminLink to="/admin/users" icon={<Users className="h-5 w-5" />}>
            Users
          </AdminLink>
          <AdminLink to="/admin/statistics" icon={<BarChart3 className="h-5 w-5" />}>
            Statistics
          </AdminLink>
          
          <div className="pt-4 border-t-2 border-purple-8/30">
            <AdminLink to="/admin/profile" icon={<User className="h-5 w-5" />}>
              Profile
            </AdminLink>
            <AdminLink to="/admin/notifications" icon={<Bell className="h-5 w-5" />}>
              Notification
            </AdminLink>
            <AdminLink to="/admin/reset-password" icon={<Lock className="h-5 w-5" />}>
              Reset password
            </AdminLink>
          </div>
        </aside>

        {/* Content */}
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
          "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200",
          isActive 
            ? "bg-purple-6 text-light-1 shadow-md" 
            : "text-gray-5 hover:bg-purple-9/60 hover:text-purple-2",
        ].join(" ")
      }
    >
      {icon}
      {children}
    </NavLink>
  );
}