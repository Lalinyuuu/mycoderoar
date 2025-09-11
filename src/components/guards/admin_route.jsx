import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context.jsx";
import { toast } from "sonner";

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  const loc = useLocation();

  if (!user) {
    toast.error("Please log in to continue");
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }
  if (user.role !== "admin") {
    toast.error("Admins only");
    return <Navigate to="/" replace />;
  }
  return children;
}