import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../Layout"

import ProtectedRoutes from "./ProtectedRoutes";

import RestaurantDashboard from "../pages/restaurant/RestaurantDashboard";
import Orders from "../pages/restaurant/Orders";
import Menu from "../pages/restaurant/Menu";

const RestaurantRoutes = () => {
  return (
    <Routes>
      <Route
        element={<ProtectedRoutes allowedRoles={["restaurant"]} />}
      >
        <Route
          path="dashboard"
          element={
            <Layout>
              <RestaurantDashboard />
            </Layout>
          }
        />
        <Route
          path="orders"
          element={
            <Layout>
              <Orders />
            </Layout>
          }
        />
        <Route
          path="menu"
          element={
            <Layout>
              <Menu />
            </Layout>
          }
        />
      </Route>

      {/*redirect any unmatched route */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};

export default RestaurantRoutes;
