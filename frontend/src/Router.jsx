import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./Layout";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminRoutes from "./routes/AdminRoutes";
import Dashboard from "./pages/Dashboard.jsx";
import Auth from "./pages/Auth.jsx";  
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
// import SearchResults from "./pages/SearchResults";
// import Settings from "./pages/Settings.jsx";


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
        <Route path="/admin/dashboard" element={
          <Layout>
            <AdminDashboard />
          </Layout>
        } />
        {/* <Route path="/auth" element={<Auth/>} />
        <Route path="/search" element={
          <Layout>
            <SearchResults />
          </Layout>
          } />
        <Route path="/settings" element={
          <Layout>
            <Settings />
          </Layout>
          // } /> */}

        {/* Admin Routes */}
        {/* <Route path="/admin/*" element={<AdminRoutes/>} /> */}
      </Routes>
      
    </BrowserRouter>
  );
};

export default Router;
