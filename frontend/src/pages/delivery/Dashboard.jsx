import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const SERVER_URL = "http://localhost:3000";

const DeliveryDashboard = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchOrders = async () => {
    if (!token) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `${SERVER_URL}/orders/delivery/my-orders`,
        authHeaders
      );

      setOrders(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch delivery orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `${SERVER_URL}/orders/${orderId}/delivery-status`,
        { deliveryStatus: status },
        authHeaders
      );

      fetchOrders();
    } catch (err) {
      console.error("Failed to update delivery status:", err);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading orders...</p>;
  }

  if (!orders.length) {
    return <p className="text-gray-500">No assigned orders</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className="border p-4 rounded-lg bg-white shadow-sm"
        >
          <p>
            <strong>Order ID:</strong> {order._id}
          </p>
          <p>
            <strong>Restaurant:</strong> {order.restaurant?.name || "—"}
          </p>
          <p>
            <strong>Customer:</strong> {order.customer?.name || "—"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="capitalize">
              {order.deliveryStatus?.replace(/_/g, " ")}
            </span>
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {["picked_up", "on_the_way", "delivered"].map((status) => (
              <button
                key={status}
                onClick={() => updateStatus(order._id, status)}
                className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                disabled={order.deliveryStatus === status}
              >
                {status.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeliveryDashboard;
