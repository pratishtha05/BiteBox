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
    "/reels",
  ];

  const showNavbar = !hideNavbarPaths.includes(
    location.pathname
  );

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar fixed */}
      <div className="shrink-0 h-full hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Navbar fixed at top */}
        {showNavbar && (
          <div className="shrink-0 w-full">
            <Navbar />
          </div>
        )}

        {/* Scrollable main content */}
        <main
          className={`flex-1 overflow-y-auto hide-scrollbar min-w-0 ${
            location.pathname !== "/auth"
              ? "pb-20 md:pb-0"
              : ""
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;