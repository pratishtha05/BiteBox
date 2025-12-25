import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Heart,
  MessageSquare,
  History,
  Settings,
  LogOut,
  Shield
} from "lucide-react";

const LeftSidebar = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard, roles: ["guest", "user", "restaurant", "admin"] },
    { name: "Admin Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, roles: ["admin"] },
    { name: "Users", path: "/admin/users", icon: LayoutDashboard, roles: ["admin"] },
    { name: "Restaurants", path: "/admin/restaurants", icon: LayoutDashboard, roles: ["admin"] },
    { name: "Delivery Partners", path: "/admin/deliveryPartners", icon: LayoutDashboard, roles: ["admin"] },
    { name: "Orders", path: "/admin/orders", icon: LayoutDashboard, roles: ["admin"] },
    { name: "Reports", path: "/admin/reports", icon: LayoutDashboard, roles: ["admin"] },

    { name: "Settings", path: "/settings", icon: Settings, roles: ["guest", "user", "restaurant", "admin"] },

    
    // { name: "Restaurant Dashboard", path: "/restaurantDashboard", icon: LayoutDashboard, roles: ["restaurant"] },
    // { name: "User Management", path: "/userManagement", icon: LayoutDashboard, roles: ["admin"] },
    // { name: "About Us", path: "/about", icon: Shield, roles: ["guest", "user", "restaurant", "admin"] },
    // { name: "Favorites", path: "/favorites", icon: Heart, roles: ["user"] },
    // { name: "Messages", path: "/messages", icon: MessageSquare, roles: ["user", "restaurant"] },
    // { name: "Order History", path: "/orderHistory", icon: History, roles: ["user"] },
    
  ];

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
            {navItems
            //   .filter(item => hasAccess(item.roles))
              .map(item => (
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
    </div>
  );
};

export default LeftSidebar;
