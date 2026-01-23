import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const SERVER_URL = "http://localhost:3000/api/v1";

const STATUS_FLOW = [
  { key: "placed", label: "Order Placed", icon: Package },
  { key: "accepted", label: "Accepted", icon: CheckCircle },
  { key: "preparing", label: "Preparing", icon: Clock },
  { key: "out for delivery", label: "Out for Delivery", icon: Truck },
  { key: "completed", label: "Delivered", icon: CheckCircle },
];

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { token, role } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || role !== "user") {
      navigate("/auth", { replace: true });
    }
  }, [token, role, navigate]);


  const fetchOrder = useCallback(async () => {
    if (!token) return;

    try {
      setError(null);

      const res = await axios.get(
        `${SERVER_URL}/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrder(res.data.data || null);
    } catch (err) {
      console.error("Failed to fetch order:", err);
      setError("Unable to fetch order details");
    } finally {
      setLoading(false);
    }
  }, [orderId, token]);

  useEffect(() => {
    fetchOrder();

    const interval = setInterval(fetchOrder, 10_000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading order…</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  if (!order) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Order not found
      </p>
    );
  }

  const currentIndex = STATUS_FLOW.findIndex(
    (step) => step.key === order.status
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Track Order
      </h1>

      {/* Status Timeline */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="flex justify-between">
          {STATUS_FLOW.map((step, index) => {
            const Icon = step.icon;
            const active = index <= currentIndex;

            return (
              <div key={step.key} className="flex-1 text-center">
                <div
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2
                    ${
                      active
                        ? "bg-amber-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                >
                  <Icon size={20} />
                </div>
                <p
                  className={`text-sm ${
                    active ? "font-medium text-gray-900" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Status */}
      {order.deliveryPartner && (
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="font-semibold mb-1 text-gray-900">
            Delivery Status
          </p>
          <p className="text-gray-600 capitalize">
            {order.deliveryStatus || "Pending"}
          </p>
        </div>
      )}

      {/* Bill */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="font-semibold mb-3 text-gray-900">
          Bill
        </h2>

        {order.items.map((item) => (
          <div
            key={item.menuItem}
            className="flex justify-between text-sm mb-1 text-gray-700"
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}

        <div className="border-t mt-3 pt-3 flex justify-between font-semibold text-gray-900">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>

      {/* Back */}
      <Link to="/orders">
        <button className="px-6 py-2 border rounded-xl hover:bg-gray-50 active:scale-95 transition">
          Back to Orders
        </button>
      </Link>
    </div>
  );
};

export default TrackOrder;
