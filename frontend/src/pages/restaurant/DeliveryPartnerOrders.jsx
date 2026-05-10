import { useEffect, useState, useCallback } from "react";
import api from "../../utils/api";
import { useParams, Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const DeliveryPartnerOrders = () => {
  const { token } = useAuth();
  const { partnerId } = useParams();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!token || !partnerId) return;

    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/delivery-partners/${partnerId}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to fetch partner orders:", err);
      setError("Unable to load delivery partner orders");
    } finally {
      setLoading(false);
    }
  }, [token, partnerId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* =========================
     UI States
  ========================= */
  if (loading) {
    return (
      <div className="px-4">
        <p className="text-center mt-10 text-gray-500 text-sm sm:text-base">
          Loading orders…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4">
        <p className="text-center mt-10 text-red-500 text-sm sm:text-base">
          {error}
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="px-4">
        <p className="text-center mt-10 text-gray-500 text-sm sm:text-base">
          No orders assigned to this partner yet.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 space-y-4 max-w-6xl mx-auto">
      <Link
        to="/restaurant/delivery-partners"
        className="inline-block text-amber-600 hover:underline font-medium text-sm sm:text-base break-words"
      >
        ← Back to Delivery Partners
      </Link>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col gap-3
                     hover:shadow-2xl transition-shadow overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base break-all">
              Order #{order._id?.slice(-6)}
            </h3>

            <span className="text-gray-500 text-xs sm:text-sm break-words">
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="text-gray-700 text-sm space-y-2 break-words">
            <p className="leading-relaxed">
              <strong>Customer:</strong>{" "}
              <span className="break-all">
                {order.customer?.name} ({order.customer?.phone})
              </span>
            </p>

            <p className="leading-relaxed">
              <strong>Items:</strong>{" "}
              {order.items
                ?.map((i) => `${i.name} x${i.quantity}`)
                .join(", ")}
            </p>

            <p>
              <strong>Total:</strong> ₹
              {Number(order.totalAmount || 0).toFixed(2)}
            </p>

            <p className="capitalize">
              <strong>Order Status:</strong> {order.status}
            </p>

            <p className="capitalize">
              <strong>Delivery Status:</strong>{" "}
              {order.deliveryStatus?.replaceAll("_", " ")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeliveryPartnerOrders;