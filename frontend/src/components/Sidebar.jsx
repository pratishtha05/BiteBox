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
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Orders", path: "/admin/orders", icon: History },
    { name: "Products", path: "/admin/products", icon: Shield },
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
