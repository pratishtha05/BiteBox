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
        }
      );

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
      <p className="text-center mt-10 text-gray-500">
        Loading orders…
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        {error}
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No orders assigned to this partner yet.
      </p>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <Link
        to="/restaurant/delivery-partners"
        className="text-amber-600 hover:underline font-medium"
      >
        ← Back to Delivery Partners
      </Link>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2
                     hover:shadow-2xl transition-shadow"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              Order #{order._id?.slice(-6)}
            </h3>
            <span className="text-gray-500 text-sm">
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="text-gray-700 text-sm space-y-1">
            <p>
              <strong>Customer:</strong>{" "}
              {order.customer?.name} ({order.customer?.phone})
            </p>

            <p>
              <strong>Items:</strong>{" "}
              {order.items
                ?.map((i) => `${i.name} x${i.quantity}`)
                .join(", ")}
            </p>

            <p>
              <strong>Total:</strong> ₹
              {Number(order.totalAmount || 0).toFixed(2)}
            </p>

            <p>
              <strong>Order Status:</strong> {order.status}
            </p>

            <p>
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
