import { Routes, Route, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import { reportError } from "./utils/sentry";

// Components
import { NavBar, HeroSection, Footer, MemberLayout, CustomToaster, LoadingSpinner, AdminRoute, ChatBot } from "@/components";

// Pages
import { 
  HomePage, 
  ViewPostPage, 
  NotFoundPage, 
  LoginPage, 
  SignUpPage, 
  ProfilePage, 
  ResetPasswordPage, 
  AdminLayout, 
  NotificationsPage, 
  FollowersPage, 
  FollowingPage, 
  UserProfilePage 
} from "@/pages";

// Lazy loaded Admin Pages
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminPosts = lazy(() => import("@/pages/admin/AdminPosts"));
const EditPostPage = lazy(() => import("@/pages/admin/EditPostPage"));
const CreatePostPage = lazy(() => import("@/pages/admin/CreatePostPage"));
const AdminCategories = lazy(() => import("@/pages/admin/AdminCategories"));
const AdminProfile = lazy(() => import("@/pages/admin/AdminProfile"));
const AdminNotifications = lazy(() => import("@/pages/admin/AdminNotifications"));
const AdminResetPassword = lazy(() => import("@/pages/admin/AdminResetPassword"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
const AdminStatistics = lazy(() => import("@/pages/admin/AdminStatistics"));
import { ErrorBoundary } from "@/components";


function RootLayout() {
  return (
    <div className="bg-off-white min-h-screen w-full">
      <NavBar />
      <main className="w-full">
        <Outlet />
      </main>
      <Footer />
      <CustomToaster />
      <ChatBot />
    </div>
  );
}


export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<RootLayout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="post/:postId" element={<ViewPostPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />

          {/* Member Routes */}
          <Route path="member" element={<MemberLayout />}>
            <Route index element={<ProfilePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* Notification Routes */}
          <Route path="notifications" element={<NotificationsPage />} />

          {/* User Routes */}
          <Route path="users/:userId" element={<UserProfilePage />} />

          {/* Follow Routes */}
          <Route path="users/:userId/followers" element={<FollowersPage />} />
          <Route path="users/:userId/following" element={<FollowingPage />} />

          {/* Admin Routes */}
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={
              <Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
                <AdminDashboard />
              </Suspense>
            } />
            <Route path="posts" element={
              <Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
                <AdminPosts />
              </Suspense>
            } />
            <Route path="posts/:id" element={
              <Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
                <EditPostPage />
              </Suspense>
            } />
            <Route path="create-post" element={
              <Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
                <CreatePostPage />
              </Suspense>
            } />
            <Route path="categories" element={
              <Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
                <AdminCategories />
              </Suspense>
            } />
            <Route path="profile" element={
              <Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
                <AdminProfile />
              </Suspense>
            } />
            <Route path="notifications" element={
              <Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
                <AdminNotifications />
              </Suspense>
            } />
            <Route path="reset-password" element={
              <Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
                <AdminResetPassword />
              </Suspense>
            } />
            <Route path="users" element={
              <Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
                <AdminUsers />
              </Suspense>
            } />
            <Route path="statistics" element={
              <Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
                <AdminStatistics />
              </Suspense>
            } />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}