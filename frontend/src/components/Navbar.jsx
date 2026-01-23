import { useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Cart from "./Cart";

/* =========================
   Navbar Component
========================= */
const Navbar = () => {
  const navigate = useNavigate();
  const { role, user, restaurant, admin, delivery, logout } = useAuth();
  const { cart } = useCart();

  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  /* =========================
     Derived Values
  ========================= */
  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const displayName = useMemo(() => {
    if (role === "user") return user?.name || "User";
    if (role === "restaurant") return restaurant?.name || "Restaurant";
    if (role === "admin") return admin?.name || "Admin";
    if (role === "delivery") return delivery?.name || "Delivery Partner";
    return "Guest";
  }, [role, user, restaurant, admin, delivery]);

  /* =========================
     Handlers
  ========================= */
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };

  /* =========================
     Render
  ========================= */
  return (
    <header className="w-full bg-white border-b border-gray-100 px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        {/* Greeting */}
        <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap">
          Hello, <span className="text-amber-500">{displayName}</span>
        </h1>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex items-center max-w-lg w-full bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm"
        >
          <input
            type="text"
            placeholder="Search food or restaurants"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
          />
          <button
            type="submit"
            className="bg-amber-500 text-white px-4 py-1.5 rounded-full text-sm
              hover:bg-amber-600 active:scale-95 transition"
          >
            Search
          </button>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-5">
          {role === "user" && (
            <>
              <button
                onClick={() => setCartOpen(true)}
                title="Cart"
                className="relative flex items-center justify-center w-10 h-10 rounded-full
                  text-gray-600 hover:text-amber-500 active:scale-95 transition"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center
                      text-xs bg-red-500 text-white rounded-full font-semibold shadow-sm"
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
            </>
          )}

          {!role ? (
            <Link to="/auth">
              <button className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm
                hover:bg-amber-600 active:scale-95 transition">
                Login / Signup
              </button>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full text-sm
                hover:bg-red-600 active:scale-95 transition"
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
