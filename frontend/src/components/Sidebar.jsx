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
];

const USER_NAV = [
  { label: "Home", path: "/", icon: Home },
  { label: "My Orders", path: "/orders", icon: History },
  { label: "Favorites", path: "/favorites", icon: Heart },
  { label: "Messages", path: "/messages", icon: MessageSquare },
  { label: "Settings", path: "/settings", icon: Settings },
];

const RESTAURANT_NAV = [
  { label: "Home", path: "/", icon: Home },
  { label: "Dashboard", path: "/restaurant/dashboard", icon: LayoutDashboard },
  { label: "Orders", path: "/restaurant/orders", icon: History },
  { label: "Menu", path: "/restaurant/menu", icon: Shield },
  {
    label: "Delivery Partners",
    path: "/restaurant/delivery-partners",
    icon: Truck,
  },
  { label: "Settings", path: "/settings", icon: Settings },
];

const ADMIN_NAV = [
  { label: "Home", path: "/", icon: Home },
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", path: "/admin/users", icon: User },
  { label: "Restaurants", path: "/admin/restaurants", icon: Shield },
  {
    label: "Delivery Partners",
    path: "/admin/deliveryPartners",
    icon: Truck,
  },
  { label: "Deals", path: "/admin/deals", icon: Heart },
  { label: "Settings", path: "/settings", icon: Settings },
];

const DELIVERY_NAV = [
  { label: "Dashboard", path: "/delivery/dashboard", icon: LayoutDashboard },
  { label: "My Orders", path: "/delivery/orders", icon: History },
  { label: "Settings", path: "/settings", icon: Settings },
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

  const navItems = NAV_BY_ROLE[role] || NAV_BY_ROLE.public;

  return (
    <aside className="w-56 h-screen bg-white flex flex-col justify-between p-4 shadow-xl">
      {/* Logo */}
      <div>
        <div className="mb-10 p-2">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            BiteBox<span className="text-amber-500">.</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="space-y-1">
            {navItems.map(({ label, path, icon: Icon }) => (
              <li key={label}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg text-sm transition
                     ${
                       isActive
                         ? "bg-amber-50 text-amber-600 font-medium"
                         : "text-gray-700 hover:bg-gray-100"
                     }`
                  }
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Help */}
      <NavLink
        to="/help"
        className="flex items-center gap-2 p-3 rounded-lg text-sm text-gray-600
                   hover:text-amber-500 hover:underline transition"
      >
        <HelpCircle className="w-5 h-5" />
        <span>Need Help?</span>
      </NavLink>
    </aside>
  );
};

export default Sidebar;
