import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../Layout"

import Home from "../pages/public/Home.jsx";
import Auth from "../pages/public/Auth.jsx";
import RestaurantMenu from "../pages/RestaurantMenu.jsx";
import Deals from "../pages/public/Deals.jsx";
import SearchResults from "../pages/public/SearchResults.jsx";
import About from "../pages/public/About.jsx";
import FAQ from "../pages/public/FAQ.jsx";
import Contact from "../pages/public/Contact.jsx";
import Help from "../pages/public/Help.jsx";


const PublicRoutes = () => {
  return (
    <Routes>
        <Route 
            path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route path="auth" element={<Auth />} />

        <Route
          path="about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />

        <Route
          path="faqs"
          element={
            <Layout>
              <FAQ />
            </Layout>
          }
        />

        <Route
          path="contact"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />

        <Route
          path="help"
          element={
            <Layout>
              <Help />
            </Layout>
          }
        />

        <Route
          path="deals"
          element={
            <Layout>
              <Deals />
            </Layout>
          }
        />

        <Route
          path="menu/:restaurantId"
          element={
            <Layout>
              <RestaurantMenu />
            </Layout>
          }
        />

        <Route
          path="search"
          element={
            <Layout>
              <SearchResults />
            </Layout>
          }
        />

      {/* redirect any unmatched route */}
      <Route path="*" element={<Navigate to="/notFound" replace />} />
    </Routes>
  );
};

export default PublicRoutes;
