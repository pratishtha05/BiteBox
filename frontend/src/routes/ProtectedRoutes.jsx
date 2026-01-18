import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoutes = ({ allowedRoles }) => {
  const { role, isAuthenticated, loading } = useAuth();

  if (loading) return null; 

  // Redirect to login if not authenticated
  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  // Redirect if role is not allowed
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;

  // Render nested routes
  return <Outlet />;
};

export default ProtectedRoutes;
