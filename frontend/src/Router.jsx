import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./Layout";

import Dashboard from "./pages/Dashboard.jsx";
import Auth from "./pages/Auth.jsx";
import RestaurantMenu from "./pages/RestaurantMenu.jsx";

import AdminRoutes from "./routes/AdminRoutes.jsx";
import RestaurantRoutes from "./routes/RestaurantRoutes.jsx";
import Settings from "./pages/Settings.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route path="/auth" element={<Auth />} />

        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />

        <Route
          path="/menu/:id"
          element={
            <Layout>
              <RestaurantMenu />
            </Layout>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Restaurant Routes */}
        <Route path="/restaurant/*" element={<RestaurantRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
