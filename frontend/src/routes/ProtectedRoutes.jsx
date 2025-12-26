import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({ allowedRoles }) => {
  const role = localStorage.getItem("role"); // or get from context

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />; // Render child routes
};

export default ProtectedRoutes;
