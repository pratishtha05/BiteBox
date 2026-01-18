import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, role } = useAuth();
  const { clearCart } = useCart();

  const { restaurantId, items, totalAmount } = location.state || {};

  const [confirmed, setConfirmed] = useState(false);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || role !== "user") {
      navigate("/auth", { replace: true });
    }
  }, [token, role, navigate]);

  useEffect(() => {
    if (!items || !items.length) {
      navigate("/", { replace: true });
    }
  }, [items, navigate]);

  const handleConfirmOrder = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/order/create",
        {
          restaurantId,
          items,
          totalAmount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      clearCart();
      setOrder(res.data);
      setConfirmed(true);
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {!confirmed ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {confirmed ? "Order Confirmed" : "Review Order"}
              </h1>

              <button
                onClick={() =>
                  navigate(`/menu/${restaurantId || order?.restaurant?._id}`, {
                    replace: true,
                  })
                }
                className="text-sm font-medium text-amber-600 hover:underline hover:cursor-pointer"
              >
                ← Back to Menu
              </button>
            </div>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={item.menuItem}
                  className="flex gap-4 items-center border rounded-xl p-3"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {item.image ? (
                      <img
                        src={`http://localhost:3000${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) =>
                          (e.currentTarget.src = "/placeholder.png")
                        }
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-medium capitalize">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="font-semibold">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between border-t pt-4 mb-6">
              <span>Total</span>
              <span className="font-bold text-xl">₹{totalAmount}</span>
            </div>

            <button
              disabled={loading}
              onClick={handleConfirmOrder}
              className="w-full bg-amber-500 text-white py-3 rounded-xl font-medium
              hover:bg-amber-600 disabled:opacity-60"
            >
              {loading ? "Placing Order..." : "Confirm Order"}
            </button>
          </>
        ) : (
          <>
            {/* Success */}
            <div className="text-center">
              <CheckCircle size={64} className="mx-auto text-amber-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Order Placed Successfully!
              </h2>
              <p className="text-gray-600">
                Order ID: <span className="font-semibold">#{order._id}</span>
              </p>
            </div>

            <div className="mt-6 space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.menuItem}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.name} * {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-semibold border-t pt-4 mt-4">
              <span>Total</span>
              <span>₹{order.totalAmount}</span>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() =>
                  navigate(`/track-order/${order._id}`, { replace: true })
                }
                className="bg-amber-500 text-white py-3 rounded-xl"
              >
                Track Order
              </button>

              <button
                onClick={() => navigate("/", { replace: true })}
                className="bg-gray-100 py-3 rounded-xl"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Confirmation;
