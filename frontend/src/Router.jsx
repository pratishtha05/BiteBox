import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./Layout";

import Dashboard from "./pages/Dashboard.jsx";
import Auth from "./pages/Auth.jsx";
import RestaurantMenu from "./pages/RestaurantMenu.jsx";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Cart from "./components/Cart";


import AdminRoutes from "./routes/AdminRoutes.jsx";
import RestaurantRoutes from "./routes/RestaurantRoutes.jsx";
import Settings from "./pages/Settings.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import Orders from "./pages/Orders.jsx";


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
          path="/menu/:restaurantId"
          element={
            <Layout>
              <RestaurantMenu />
            </Layout>
          }
        />
        
        <Route
          path="/search"
          element={
            <Layout>
              <SearchResults />
            </Layout>
          }
        />

        {/* 🔐 PROTECTED USER ROUTES */}
          <Route
            element={<ProtectedRoutes allowedRoles={["user"]} />}
          >
            <Route path="cart" element={<Cart />} />
          </Route>
          <Route
            element={<ProtectedRoutes allowedRoles={["user"]} />}
          >
            <Route path="orders" element={<Layout><Orders /></Layout>} />
          </Route>

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Restaurant Routes */}
        <Route path="/restaurant/*" element={<RestaurantRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
