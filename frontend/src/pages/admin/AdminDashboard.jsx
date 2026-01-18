import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Store,
  UserX,
  StoreIcon,
  Activity,
  ArrowUpRight,
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center justify-between shadow-sm hover:shadow-md transition">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-semibold text-gray-900">{value}</p>
    </div>
    <div className="rounded-xl bg-amber-50 p-2">
      <Icon className="h-6 w-6 text-amber-500" />
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState({ users: [], restaurants: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:3000/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStats(res.data.stats);
        setActivity(res.data.recentActivity);
      } catch (error) {
        console.error("Dashboard fetch failed", error);
      }
    };

    fetchDashboard();
  }, []);

  if (!stats) {
    return (
      <div className="p-6 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} />
        <StatCard
          title="Restaurants"
          value={stats.totalRestaurants}
          icon={Store}
        />
        <StatCard
          title="Blocked Users"
          value={stats.blockedUsers}
          icon={UserX}
        />
        <StatCard
          title="Blocked Restaurants"
          value={stats.blockedRestaurants}
          icon={StoreIcon}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Attention Required
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Blocked Restaurants
              </span>
              <button
                onClick={() => navigate("/admin/restaurants")}
                className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium hover:cursor-pointer hover:underline"
              >
                Review <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Blocked Users
              </span>
              <button
                onClick={() => navigate("/admin/users")}
                className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium hover:cursor-pointer hover:underline"
              >
                Review <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-lg bg-amber-50 p-1.5">
              <Activity className="h-4 w-4 text-amber-500" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>

          <ul className="space-y-3 text-sm text-gray-600">
            {activity.restaurants.map((r) => (
              <li key={r._id}>
                • Restaurant <span className="font-medium text-gray-900">“{r.name}”</span> registered
              </li>
            ))}
            {activity.users.map((u) => (
              <li key={u._id}>
                • New user <span className="font-medium text-gray-900">"{u.name}"</span> registered
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
