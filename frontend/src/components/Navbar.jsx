import { useState } from "react";
import { Bell, ShoppingCart, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Cart from "./Cart";

const Navbar = () => {
  const navigate = useNavigate();
  const { role, user, restaurant, admin, delivery, logout } = useAuth(); // added delivery
  const { cart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 0);
  };

  // Display name based on role
  let displayName = "Guest";
  if (role === "user" && user?.name) displayName = user.name;
  else if (role === "restaurant" && restaurant?.name) displayName = restaurant.name;
  else if (role === "admin" && admin?.name) displayName = admin.name;
  else if (role === "delivery" && delivery?.name) displayName = delivery.name; // delivery partner

  return (
    <header className="w-full bg-white border-b border-gray-100 px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Hello, <span className="text-amber-500">{displayName}</span>
        </h1>

        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!searchQuery.trim()) return;
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
          }}
          className="flex items-center w-105 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm"
        >
          <input
            type="text"
            placeholder="Search food or restaurants"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-sm text-gray-700"
          />
          <button
            type="submit"
            className="bg-amber-500 text-white px-4 py-1.5 rounded-full text-sm hover:bg-amber-600 hover:cursor-pointer active:scale-95 transition"
          >
            Search
          </button>
        </form>

        <div className="flex items-center space-x-5">
          {role === "user" && (
            <>
              <button
                className="relative text-gray-600 hover:text-amber-500 transition hover:cursor-pointer active:scale-95"
                title="Notifications"
              >
                <Bell size={24} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <button
                className="relative text-gray-600 hover:text-amber-500 transition hover:cursor-pointer active:scale-95"
                title="Cart"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                className="text-gray-600 hover:text-amber-500 transition hover:cursor-pointer active:scale-95"
                title="Profile"
              >
                <User size={24} />
              </button>

              <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
            </>
          )}

          {!role ? (
            <Link to="/auth">
              <button className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm hover:bg-amber-600 hover:cursor-pointer active:scale-95 transition">
                Login / Signup
              </button>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full text-sm hover:bg-red-600 hover:cursor-pointer active:scale-95 transition"
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
