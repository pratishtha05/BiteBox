import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./Layout";

import Cart from "./components/Cart";

import AdminRoutes from "./routes/AdminRoutes.jsx";
import RestaurantRoutes from "./routes/RestaurantRoutes.jsx";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import DeliveryRoutes from "./routes/DeliveryRoutes.jsx";
import PublicRoutes from "./routes/PublicRoutes.jsx";

import Orders from "./pages/user/Orders.jsx";
import Settings from "./pages/Settings.jsx";
import Confirmation from "./pages/user/Confirmation.jsx";
import TrackOrder from "./pages/user/TrackOrder.jsx";
import NotFound from "./pages/public/NotFound.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* PROTECTED USER ROUTES */}
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
          <Route
            path="/confirmation"
            element={
                <Confirmation />
            }
          />
          <Route
            path="/track-order/:orderId"
            element={
              <Layout>
                <TrackOrder />
              </Layout>
            }
          />
        </Route>

        {/* PROTECTED ROUTES (only logged in users)*/}
        <Route
          element={
            <ProtectedRoutes allowedRoles={["user", "admin", "restaurant"]} />
          }
        >
          <Route
            path="/settings"
            element={
              <Layout>
                <Settings />
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

        {/* Not Found Route */}
        <Route path="/notFound" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
