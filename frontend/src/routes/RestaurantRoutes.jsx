import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../Layout";

import ProtectedRoutes from "./ProtectedRoutes";

import RestaurantDashboard from "../pages/restaurant/RestaurantDashboard";
import Orders from "../pages/restaurant/Orders";
import Menu from "../pages/restaurant/Menu";

import DeliveryPartners from "../pages/restaurant/DeliveryPartners";
import DeliveryPartnerOrders from "../pages/restaurant/DeliveryPartnerOrders";

const RestaurantRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoutes allowedRoles={["restaurant"]} />}>
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

      <Route
        path="delivery-partners"
        element={
          <Layout>
            <DeliveryPartners />
          </Layout>
        }
      />

      <Route
        path="delivery-partner/:partnerId/orders"
        element={
          <Layout>
            <DeliveryPartnerOrders />
          </Layout>
        }
      />

      {/*redirect any unmatched route */}
      <Route path="*" element={<Navigate to="/notFound" replace />} />
    </Routes>
  );
};

export default RestaurantRoutes;
