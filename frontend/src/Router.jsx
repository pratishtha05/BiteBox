import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./Layout";

import Home from "./pages/public/Home.jsx";
import Auth from "./pages/Auth.jsx";
import RestaurantMenu from "./pages/RestaurantMenu.jsx";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Cart from "./components/Cart";

import AdminRoutes from "./routes/AdminRoutes.jsx";
import RestaurantRoutes from "./routes/RestaurantRoutes.jsx";
import Settings from "./pages/Settings.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import Orders from "./pages/Orders.jsx";
import DeliveryRoutes from "./routes/DeliveryRoutes.jsx";
import Deals from "./pages/public/Deals.jsx";
import PublicRoutes from "./routes/PublicRoutes.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* 🔐 PROTECTED USER ROUTES */}
        <Route element={<ProtectedRoutes allowedRoles={["user"]} />}>
          <Route path="cart" element={<Cart />} />
        </Route>
        <Route element={<ProtectedRoutes allowedRoles={["user"]} />}>
          <Route
            path="orders"
            element={
              <Layout>
                <Orders />
              </Layout>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Restaurant Routes */}
        <Route path="/restaurant/*" element={<RestaurantRoutes />} />

        {/* Delivery Routes */}
        <Route path="/delivery/*" element={<DeliveryRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
