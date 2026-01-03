import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Confirmation = () => {
  const { orderId } = useParams();
  const { token, role } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false); // Step 2: order confirmed

  // Redirect if not authenticated
  useEffect(() => {
    if (!token || role !== "user") {
      navigate("/auth", { replace: true });
    }
  }, [token, role, navigate]);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrder();
  }, [orderId, token]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!order) return <p className="text-center mt-10 text-red-500">Order not found.</p>;

  // Confirm order button handler
  const handleConfirmOrder = async () => {
    try {
      // Optionally, you can call backend to finalize order here if needed
      // await axios.put(`http://localhost:3000/order/${orderId}/finalize`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setConfirmed(true);
    } catch (err) {
      alert(err.response?.data?.message || "Could not confirm order");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-md text-center">
      {!confirmed ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Review Your Order</h1>

          <div className="text-left mb-6">
            <h2 className="font-medium text-gray-800 mb-2">Order Summary:</h2>
            <ul className="text-gray-600 space-y-2">
              {order.items.map((item) => (
                <li key={item.menuItem} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-3 font-semibold text-gray-800">
              <span>Total:</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>

          <button
            onClick={handleConfirmOrder}
            className="w-full bg-amber-500 text-white py-3 rounded-xl font-medium hover:bg-amber-600 hover:cursor-pointer active:scale-95 transition"
          >
            Confirm Order
          </button>
        </>
      ) : (
        <>
          <CheckCircle className="mx-auto text-amber-500 mb-4" size={60} />
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Your order <span className="font-semibold">#{order._id}</span> has been successfully placed.
          </p>

          <div className="text-left mb-6">
            <h2 className="font-medium text-gray-800 mb-1">Order Details:</h2>
            <ul className="text-gray-600 space-y-1">
              {order.items.map((item) => (
                <li key={item.menuItem} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-2 font-semibold text-gray-800">
              <span>Total:</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(`/track-order/${order._id}`)}
              className="w-full bg-amber-500 text-white py-3 rounded-xl font-medium hover:bg-amber-600 hover:cursor-pointer active:scale-95 transition"
            >
              Track Order
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-300 hover:cursor-pointer active:scale-95 transition"
            >
              Back to Home
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Confirmation;
