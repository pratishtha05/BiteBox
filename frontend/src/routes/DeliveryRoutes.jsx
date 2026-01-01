import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../Layout";
import ProtectedRoutes from "./ProtectedRoutes";

import DeliveryDashboard from "../pages/delivery/Dashboard";

const DeliveryRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoutes allowedRoles={["delivery"]} />}>
        <Route path="dashboard" element={
          <Layout>
            <DeliveryDashboard />
          </Layout>
        } />
      </Route>

      {/* redirect unmatched route */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};

export default DeliveryRoutes;
