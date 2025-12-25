import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./Layout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoutes from "./routes/AdminRoutes";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />
        <Route path="/auth" element={<Auth/>} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes/>} />
      </Routes>
      
    </BrowserRouter>
  );
};

export default Router;
