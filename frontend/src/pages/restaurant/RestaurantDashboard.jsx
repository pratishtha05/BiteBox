import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart, DollarSign, Menu, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const RestaurantDashboard = () => {
  const { restaurant, token } = useAuth();
  const restaurantId = restaurant?.restaurantId;

  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topMenuItems, setTopMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) return;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:3000/restaurant/dashboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data;

        // Stats cards
        setStats([
          {
            id: 1,
            title: "Total Orders",
            value: data.stats.totalOrders,
            icon: <ShoppingCart className="text-white w-6 h-6" />,
          },
          {
            id: 2,
            title: "Revenue",
            value: `$${data.stats.revenue}`,
            icon: <DollarSign className="text-white w-6 h-6" />,
          },
          {
            id: 3,
            title: "Menu Items",
            value: data.stats.totalMenuItems,
            icon: <Menu className="text-white w-6 h-6" />,
          },
        ]);

        setRecentOrders(data.recentOrders || []);
        setTopMenuItems(data.topMenuItems || []); // optional, can be empty
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [restaurantId, token]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      {/* ---------------- Header ---------------- */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {restaurant?.name}!</h1>
        <p className="text-gray-500 mt-1">
          Here's a quick overview of your restaurant performance
        </p>
      </div>

      {/* ---------------- Stats Cards ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {loading
          ? Array(3).fill(0).map((_, idx) => (
              <div key={idx} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
            ))
          : stats.map((stat) => (
              <div
                key={stat.id}
                className="flex items-center justify-between p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
              >
                <div>
                  <p className="text-gray-500">{stat.title}</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
            ))}
      </div>

      {/* ---------------- Recent Orders ---------------- */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : recentOrders.length === 0 ? (
          <p className="text-gray-500">No recent orders</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-2 px-4">Order ID</th>
                  <th className="py-2 px-4">Customer</th>
                  <th className="py-2 px-4">Total</th>
                  <th className="py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="py-2 px-4">#{order._id}</td>
                    <td className="py-2 px-4">{order.customerName}</td>
                    <td className="py-2 px-4">${order.total}</td>
                    <td className="py-2 px-4 text-amber-500 font-medium">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---------------- Top Menu Items ---------------- */}
      {topMenuItems.length > 0 && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Menu Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topMenuItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <img
                  src={item.image || "/placeholder-restaurant.jpg"}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-gray-500">${item.price}</p>
                  <p className="flex items-center gap-1 text-amber-500">
                    <Star size={16} /> {item.sales || 0} sold
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;
