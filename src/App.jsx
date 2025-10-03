
import { Routes, Route, Outlet } from "react-router-dom";

import NavBar from "@/components/main_layouts/nav_bar.jsx";
import HeroSection from "@/components/main_layouts/hero_section.jsx";
import ArticleSection from "@/feature/posts/containers/article_section.jsx";
import ViewPostPage from "@/pages/post/view_post.jsx";
import NotFound from "@/pages/post/not_found.jsx";
import Footer from "@/components/main_layouts/footer.jsx";


import LoginPage from "@/pages/auth/login.jsx";
import SignUpPage from "@/pages/auth/signup.jsx";

import MemberLayout from "@/components/member/member_layout.jsx";
import ProfilePage from "@/pages/member/profile.jsx";
import ResetPasswordPage from "@/pages/member/reset_password.jsx";


import AdminRoute from "@/components/guards/admin_route.jsx";
import AdminLayout from "@/pages/admin/layout.jsx";
import AdminDashboard from "@/pages/admin/dashboard.jsx";
import AdminPosts from "@/pages/admin/posts.jsx";
import AdminUsers from "@/pages/admin/users.jsx";

import { Toaster } from "sonner";

function RootLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
      <Toaster richColors closeButton />
    </>
  );
}

function Home() {
  return (
    <>
      <HeroSection />
      <ArticleSection />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        
        <Route index element={<Home />} />
        <Route path="/post/:postId" element={<ViewPostPage />} />

        
        <Route path="/member" element={<MemberLayout />}>
          <Route index element={<ProfilePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>

      
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

    
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

console.log("API_BASE_URL =", import.meta.env.VITE_API_BASE_URL);