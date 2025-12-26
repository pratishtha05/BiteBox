import { Bell, ShoppingCart, X, Search, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // Simple logout function
  const handleLogout = () => {
    // Clear all auth-related localStorage items
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("restaurant");
    localStorage.removeItem("admin");

    // Redirect to homepage
    navigate("/", { replace: true });
  };

  // Get role and user info from localStorage to conditionally show buttons
  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const restaurant = JSON.parse(localStorage.getItem("restaurant") || "null");
  const admin = JSON.parse(localStorage.getItem("admin") || "null");

  // Get display name
  let displayName = "User";
  if (role === "user" && user?.name) displayName = user.name;
  else if (role === "restaurant" && restaurant?.name) displayName = restaurant.name;
  else if (role === "admin" && admin?.name) displayName = admin.name;

  return (
    <header className="w-full bg-white border-b border-gray-100 px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between">

        {/* Left - Greeting */}
        <h1 className="text-2xl font-bold text-gray-800">
          Hello, <span className="text-amber-500">{displayName}</span>
        </h1>

        {/* Center - Search */}
        <form
          className="flex items-center w-105 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm"
        >
          <input
            type="text"
            placeholder="Search food or restaurants"
            className="flex-1 outline-none text-sm text-gray-700"
          />
          <button
            type="submit"
            className="bg-amber-500 text-white px-4 py-1.5 rounded-full text-sm hover:bg-amber-600 transition"
          >
            Search
          </button>
        </form>

        {/* Right - Actions */}
        <div className="flex items-center space-x-5">
          {!role ? (
            <Link to="/auth">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-amber-600 transition">
                Signup/Login
              </button>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full text-sm hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
