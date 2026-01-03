import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../Layout"

import ProtectedRoutes from "./ProtectedRoutes";

import AdminDashboard from "../pages/admin/AdminDashboard";
import Users from "../pages/admin/Users";
import Restaurants from "../pages/admin/Restaurants";
import DeliveryPartners from "../pages/admin/DeliveryPartners";
import Deals from "../pages/admin/Deals";

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
        <Route
          path="deals"
          element={
            <Layout>
              <Deals />
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
