import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedRoutes from "./ProtectedRoutes";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        element={<ProtectedRoutes allowedRoles={["admin"]} />}
      >
        <Route
          path="dashboard"
          element={
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          }
        />
      </Route>

      {/* Optional: redirect any unmatched route */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
