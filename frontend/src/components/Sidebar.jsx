import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Heart,
  History,
  Settings,
  Shield,
  User,
  Info,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { role } = useAuth();

  // Public nav
  const publicNav = [
    { name: "Home", path: "/", icon: LayoutDashboard },
    { name: "Today's Deals", path: "/deals/today", icon: Heart },
    { name: "About Us", path: "/about", icon: Info },
    { name: "FAQs", path: "/faqs", icon: HelpCircle },
    { name: "Contact Us", path: "/contact", icon: MessageSquare },
  ];

  // User nav
  const userNav = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "My Orders", path: "/orders", icon: History },
    { name: "Favorites", path: "/favorites", icon: Heart },
    { name: "Messages", path: "/messages", icon: MessageSquare },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  // Restaurant nav
  const restaurantNav = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    {
      name: "Restaurant Dashboard",
      path: "/restaurant/dashboard",
      icon: LayoutDashboard,
    },
    { name: "Orders", path: "/restaurant/orders", icon: History },
    { name: "Menu", path: "/restaurant/menu", icon: Shield },
    {
      name: "Delivery Partners",
      path: "/restaurant/delivery-partners",
      icon: Shield,
    },
  ];

  // Admin nav
  const adminNav = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    {
      name: "Admin Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    { name: "Users", path: "/admin/users", icon: User },
    { name: "Restaurants", path: "/admin/restaurants", icon: Shield },
    {
      name: "Delivery Partners",
      path: "/admin/deliveryPartners",
      icon: Shield,
    },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  // Delivery Partner nav
  const deliveryNav = [
    { name: "Dashboard", path: "/delivery/dashboard", icon: LayoutDashboard },
    { name: "My Orders", path: "/delivery/orders", icon: History },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  // Pick nav items based on role
  let navItems = publicNav;
  if (role === "user") navItems = userNav;
  if (role === "restaurant") navItems = restaurantNav;
  if (role === "admin") navItems = adminNav;
  if (role === "delivery") navItems = deliveryNav; // delivery partner

  return (
    <div className="w-56 h-screen bg-white flex flex-col justify-between p-4 shadow-xl">
      <div>
        <div className="mb-10 p-2">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            BiteBox<span className="text-amber-500">.</span>
          </Link>
        </div>

        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="flex items-center p-3 my-1 rounded-lg hover:bg-gray-100"
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <Link
        to="/help"
        className="mt-auto flex items-center gap-2 p-3 rounded-lg text-sm text-gray-600 hover:text-amber-500 hover:underline transition"
      >
        <HelpCircle className="w-5 h-5" />
        <span>Need Help?</span>
      </Link>
    </div>
  );
};

export default Sidebar;
