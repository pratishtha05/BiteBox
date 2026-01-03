import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const STATUS_FLOW = [
  { key: "placed", label: "Order Placed", icon: Package },
  { key: "accepted", label: "Accepted", icon: CheckCircle },
  { key: "preparing", label: "Preparing", icon: Clock },
  { key: "out for delivery", label: "Out for Delivery", icon: Truck },
  { key: "completed", label: "Delivered", icon: CheckCircle },
];

const TrackOrder = () => {
  const { orderId } = useParams();
  const { token, role } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Protect route
  useEffect(() => {
    if (!token || role !== "user") {
      navigate("/auth", { replace: true });
    }
  }, [token, role, navigate]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/order/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrder(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch + polling
  useEffect(() => {
    if (!token) return;

    fetchOrder();
    const interval = setInterval(fetchOrder, 10000); // refresh every 10s

    return () => clearInterval(interval);
  }, [orderId, token]);

  if (loading) {
    return <p className="text-center mt-10">Loading order...</p>;
  }

  if (!order) {
    return <p className="text-center mt-10 text-red-500">Order not found</p>;
  }

  const currentIndex = STATUS_FLOW.findIndex(
    (s) => s.key === order.status
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Track Order</h1>

      {/* STATUS BAR */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="flex justify-between">
          {STATUS_FLOW.map((step, index) => {
            const Icon = step.icon;
            const active = index <= currentIndex;

            return (
              <div key={step.key} className="flex-1 text-center">
                <div
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2
                  ${active ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-400"}`}
                >
                  <Icon size={20} />
                </div>
                <p className={`text-sm ${active ? "font-medium" : "text-gray-400"}`}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* DELIVERY STATUS */}
      {order.deliveryPartner && (
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="font-semibold mb-1">Delivery Status</p>
          <p className="text-gray-600 capitalize">
            {order.deliveryStatus || "Pending"}
          </p>
        </div>
      )}

      {/* BILL */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="font-semibold mb-3">Bill</h2>
        {order.items.map((item) => (
          <div key={item.menuItem} className="flex justify-between text-sm mb-1">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>

      <Link to="/orders">
        <button className="px-6 py-2 border rounded-xl hover:bg-gray-50 hover:cursor-pointer active:scale-95 transition">
          Back to Orders
        </button>
      </Link>
    </div>
  );
};

export default TrackOrder;
