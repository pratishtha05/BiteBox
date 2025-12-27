import { Bell, ShoppingCart, X, Search, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { role, user, restaurant, admin, logout } = useAuth();

  // Logout handler
  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 0);
  };

  // Get display name
  let displayName = "Guest";
  if (role === "user" && user?.name) displayName = user.name;
  else if (role === "restaurant" && restaurant?.name)
    displayName = restaurant.name;
  else if (role === "admin" && admin?.name) {
    console.log(admin.name);
    displayName = admin.name;
  }

  return (
    <header className="w-full bg-white border-b border-gray-100 px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Greeting */}
        <h1 className="text-2xl font-bold text-gray-800">
          Hello, <span className="text-amber-500">{displayName}</span>
        </h1>

        {/* Search bar */}
        <form className="flex items-center w-105 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
          <input
            type="text"
            placeholder="Search food or restaurants"
            className="flex-1 outline-none text-sm text-gray-700"
          />
          <button
            type="submit"
            className="bg-amber-500 text-white px-4 py-1.5 rounded-full text-sm hover:bg-amber-600 transition hover:cursor-pointer active:scale-95"
          >
            Search
          </button>
        </form>

        {/* Actions */}
        <div className="flex items-center space-x-5">
          {/* Logged-in icons */}
          {role && (
            <>
              {/* Notifications - for all logged-in roles */}
              <button
                className="relative text-gray-600 hover:text-amber-500 transition"
                title="Notifications"
              >
                <Bell size={24} className="hover:cursor-pointer active:scale-95"/>
                {/* optional badge */}
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Cart - ONLY for user */}
              {role === "user" && (
                <button
                  className="text-gray-600 hover:text-amber-500 transition"
                  title="Cart"
                >
                  <ShoppingCart size={24} className="hover:cursor-pointer active:scale-95"/>
                </button>
              )}

              {/* User profile - ONLY for user */}
              {role === "user" && (
                <button
                  className="text-gray-600 hover:text-amber-500 transition"
                  title="Profile"
                >
                  <User size={24} className="hover:cursor-pointer active:scale-95"/>
                </button>
              )}
            </>
          )}

          {/* Auth buttons */}
          {!role ? (
            <Link to="/auth">
              <button className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm hover:bg-amber-600 transition hover:cursor-pointer active:scale-95">
                Login / Signup
              </button>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full text-sm hover:bg-red-600 transition hover:cursor-pointer active:scale-95"
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
