import { Link, NavLink } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Heart,
  History,
  Settings,
  Shield,
  User,
  Info,
  HelpCircle,
  MessageSquare,
  Truck,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

/* =========================
   Navigation Configs
========================= */

const PUBLIC_NAV = [
  { label: "Home", path: "/", icon: Home },
  { label: "Deals", path: "/deals", icon: Heart },
  { label: "About Us", path: "/about", icon: Info },
  { label: "FAQs", path: "/faqs", icon: HelpCircle },
  { label: "Contact Us", path: "/contact", icon: MessageSquare },
  { label: "Reels", path: "/reels", icon: Heart },
];

const USER_NAV = [
  { label: "Home", path: "/", icon: Home },
  { label: "My Orders", path: "/orders", icon: History },
  { label: "Favorites", path: "/favourites", icon: Heart },
  { label: "Messages", path: "/messages", icon: MessageSquare },
  { label: "Deals", path: "/deals", icon: Heart },
  { label: "About Us", path: "/about", icon: Info },
  { label: "FAQs", path: "/faqs", icon: HelpCircle },
  { label: "Contact Us", path: "/contact", icon: MessageSquare },
  { label: "Settings", path: "/settings", icon: Settings },
];

const RESTAURANT_NAV = [
  { label: "Home", path: "/", icon: Home },
  {
    label: "Dashboard",
    path: "/restaurant/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    path: "/restaurant/orders",
    icon: History,
  },
  {
    label: "Menu",
    path: "/restaurant/menu",
    icon: Shield,
  },
  {
    label: "Delivery Partners",
    path: "/restaurant/delivery-partners",
    icon: Truck,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const ADMIN_NAV = [
  { label: "Home", path: "/", icon: Home },
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: User,
  },
  {
    label: "Restaurants",
    path: "/admin/restaurants",
    icon: Shield,
  },
  {
    label: "Delivery Partners",
    path: "/admin/deliveryPartners",
    icon: Truck,
  },
  {
    label: "Deals",
    path: "/admin/deals",
    icon: Heart,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const DELIVERY_NAV = [
  {
    label: "Dashboard",
    path: "/delivery/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Orders",
    path: "/delivery/orders",
    icon: History,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const NAV_BY_ROLE = {
  user: USER_NAV,
  restaurant: RESTAURANT_NAV,
  admin: ADMIN_NAV,
  delivery: DELIVERY_NAV,
  public: PUBLIC_NAV,
};

/* =========================
   Sidebar Component
========================= */

const Sidebar = () => {
  const { role } = useAuth();

  const navItems =
    NAV_BY_ROLE[role] || NAV_BY_ROLE.public;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 h-screen bg-white flex-col justify-between p-4 shadow-xl border-r border-slate-100">
        {/* Logo */}
        <div>
          <div className="mb-10 p-2">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-800"
            >
              BiteBox
              <span className="text-amber-500">.</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav>
            <ul className="space-y-1">
              {navItems.map(
                ({ label, path, icon: Icon }) => (
                  <li key={label}>
                    <NavLink
                      to={path}
                      className={({ isActive }) =>
                        `flex items-center p-3 rounded-lg text-sm transition-all duration-200 ${
                          isActive
                            ? "bg-amber-50 text-amber-600 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      <Icon className="w-5 h-5 mr-3 shrink-0" />
                      <span className="truncate">
                        {label}
                      </span>
                    </NavLink>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>

        {/* Help */}
        <NavLink
          to="/help"
          className="flex items-center gap-2 p-3 rounded-lg text-sm text-gray-600 hover:text-amber-500 hover:underline transition"
        >
          <HelpCircle className="w-5 h-5 shrink-0" />
          <span>Need Help?</span>
        </NavLink>
      </aside>

      {/* Mobile Bottom Navigation */}
      <aside className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-2xl">
        <nav className="overflow-x-auto hide-scrollbar">
          <ul className="flex items-center justify-between min-w-max px-2 py-2">
            {navItems.map(
              ({ label, path, icon: Icon }) => (
                <li
                  key={label}
                  className="flex-1 min-w-[70px]"
                >
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-xl text-[10px] font-medium transition-all ${
                        isActive
                          ? "text-amber-600 bg-amber-50"
                          : "text-slate-500"
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="truncate max-w-full">
                      {label}
                    </span>
                  </NavLink>
                </li>
              )
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;