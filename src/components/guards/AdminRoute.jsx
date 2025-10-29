import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; // หรือ spinner
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}