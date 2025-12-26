import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Router from "./Router.jsx";
// import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  // <AuthProvider>
    <StrictMode>
      <Router />
    </StrictMode>
  // {/* </AuthProvider> */}
);
