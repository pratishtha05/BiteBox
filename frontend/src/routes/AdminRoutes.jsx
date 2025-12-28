import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../Layout"

import ProtectedRoutes from "./ProtectedRoutes";

import AdminDashboard from "../pages/admin/AdminDashboard";
import Users from "../pages/admin/Users";
import Restaurants from "../pages/admin/Restaurants";
import DeliveryPartners from "../pages/admin/DeliveryPartners";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        element={<ProtectedRoutes allowedRoles={["admin"]} />}
      >
        <Route
          path="dashboard"
          element={
            <Layout>
              <AdminDashboard />
            </Layout>
          }
        />
        <Route
          path="users"
          element={
            <Layout>
              <Users />
            </Layout>
          }
        />
        <Route
          path="restaurants"
          element={
            <Layout>
              <Restaurants />
            </Layout>
          }
        />
        <Route
          path="deliveryPartners"
          element={
            <Layout>
              <DeliveryPartners />
            </Layout>
          }
        />
      </Route>

      {/* redirect any unmatched route */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
