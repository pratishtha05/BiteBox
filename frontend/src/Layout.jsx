import { useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarPaths = [
    "/auth",
    "/favorites",
    "/messages",
    "/orderHistory",
    "/settings",
    "/about",
    "/faqs",
    "/contact",
    "/help",
  ];

  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar fixed */}
      <div className="shrink-0 h-full">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar fixed at top */}
        {showNavbar && <div className="shrink-0"><Navbar /></div>}

        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
