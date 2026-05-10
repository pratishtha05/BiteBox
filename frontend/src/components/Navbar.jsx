import { useMemo, useState } from "react";
import {
  ShoppingCart,
  Search,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Cart from "./Cart";

const Navbar = () => {
  const navigate = useNavigate();

  const {
    role,
    user,
    restaurant,
    admin,
    delivery,
    logout,
  } = useAuth();

  const { cart } = useCart();

  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] =
    useState("");

  const cartCount = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    [cart]
  );

  const displayName = useMemo(() => {
    if (role === "user")
      return user?.name || "User";

    if (role === "restaurant")
      return restaurant?.name || "Restaurant";

    if (role === "admin")
      return admin?.name || "Admin";

    if (role === "delivery")
      return (
        delivery?.name || "Delivery Partner"
      );

    return "Guest";
  }, [
    role,
    user,
    restaurant,
    admin,
    delivery,
  ]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    navigate(
      `/search?q=${encodeURIComponent(
        searchQuery.trim()
      )}`
    );

    setSearchQuery("");
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-md top-0 z-40 shadow-sm px-3 sm:px-4 md:px-6 lg:px-10 py-3 transition-all overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 md:gap-6">
        {/* Branding/Greeting */}
        <div className="flex items-baseline gap-2 shrink min-w-0">
          <h1 className="text-base sm:text-lg md:text-2xl font-black text-slate-900 tracking-tight truncate">
            Hello,{" "}
            <span className="text-amber-500 break-words">
              {displayName}
            </span>
          </h1>
        </div>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 items-center max-w-lg relative group min-w-0"
        >
          <div className="absolute left-4 text-slate-400 group-focus-within:text-amber-500 transition-colors">
            <Search size={18} />
          </div>

          <input
            type="text"
            placeholder="What are you craving?"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="w-full bg-slate-100 border-none rounded-3xl py-4 pl-11 pr-24 text-sm focus:ring-2 focus:ring-amber-500/20 focus:bg-white outline-none transition-all min-w-0"
          />

          <button
            type="submit"
            className="absolute right-1.5 bg-amber-500 text-white px-4 py-3 rounded-3xl text-xs font-bold uppercase tracking-widest hover:bg-amber-600 active:scale-95 transition-all shadow-sm hover:cursor-pointer whitespace-nowrap"
          >
            Search
          </button>
        </form>

        {/* Actions Section */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5 shrink-0">
          {role === "user" && (
            <div className="relative">
              <button
                onClick={() =>
                  setCartOpen(true)
                }
                className="group p-2 sm:p-2.5 text-slate-600 hover:text-amber-600 transition-all active:scale-90 hover:cursor-pointer relative"
              >
                <ShoppingCart
                  size={20}
                  className="sm:w-[22px] sm:h-[22px]"
                  strokeWidth={2.5}
                />

                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[9px] sm:text-[10px] bg-amber-500 text-white rounded-full font-black ring-2 sm:ring-4 ring-white animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {!role ? (
            <Link to="/auth">
              <button className="flex items-center gap-1.5 sm:gap-2 bg-slate-900 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-3xl text-xs sm:text-sm font-bold hover:bg-amber-600 transition-all active:scale-95 hover:cursor-pointer whitespace-nowrap">
                <UserIcon size={16} />
                <span className="xs:block">
                  Sign In
                </span>
              </button>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="group flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-3xl text-slate-600 border hover:text-red-500 hover:bg-red-50 transition-all active:scale-95 hover:cursor-pointer"
            >
              <LogOut size={18} />

              <span className="hidden md:block text-sm font-bold">
                Logout
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search */}
      <form
        onSubmit={handleSearch}
        className="md:hidden mt-3 flex items-center bg-slate-100 rounded-xl px-3 py-2 gap-2"
      >
        <Search
          size={16}
          className="text-slate-400 shrink-0"
        />

        <input
          type="text"
          placeholder="Search food..."
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
          className="flex-1 bg-transparent border-none outline-none text-sm min-w-0"
        />

        <button
          type="submit"
          className="text-[10px] font-bold uppercase text-amber-600 whitespace-nowrap"
        >
          Go
        </button>
      </form>

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </header>
  );
};

export default Navbar;