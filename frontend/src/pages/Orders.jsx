import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Orders = () => {
  const { token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!isAuthenticated || !token) return; // do not fetch if token missing

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/order/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data); // debug
      setOrders(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, [isAuthenticated, token]);


  if (!isAuthenticated) {
    return <p className="p-6 text-center text-gray-500">Please login to view your orders.</p>;
  }

  if (loading) {
    return <p className="p-6 text-center text-gray-500">Loading your orders...</p>;
  }

  if (orders.length === 0) {
    return <p className="p-6 text-center text-gray-500">You have no orders yet.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white shadow rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-lg">
                {order.restaurant?.name || "Restaurant"}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "accepted" || order.status === "preparing"
                    ? "bg-blue-100 text-blue-700"
                    : order.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            <div className="mb-3 border-t border-gray-200 pt-3 space-y-2">
              {order.items.map((item) => (
                <div key={item.menuItem} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.price} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-semibold text-gray-800">
              <span>Total:</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
