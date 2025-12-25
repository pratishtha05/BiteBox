import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../../src/Layout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import DeliveryPartners from "../pages/admin/DeliveryPartners";
import Orders from "../pages/admin/Orders";
import Reports from "../pages/admin/Reports";
import Restaurants from "../pages/admin/Restaurants";
import Users from "../pages/admin/Users";
// import ProtectedRoutes from "./ProtectedRoutes";

const AdminRoutes = () => {
  // Example: get role from localStorage / context
//   const user = JSON.parse(localStorage.getItem("user"));

//   // Protect admin routes
//   if (!user || user.role !== "admin") {
//     return <Navigate to="/auth" />;
//   }

  return (
    <Routes 
    // element={<ProtectedRoutes allowedRoles={["admin"]} />}
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
        path="deliveryPartners"
        element={
          <Layout>
            <DeliveryPartners />
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
        path="reports"
        element={
          <Layout>
            <Reports />
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
        path="users"
        element={
          <Layout>
            <Users />
          </Layout>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
