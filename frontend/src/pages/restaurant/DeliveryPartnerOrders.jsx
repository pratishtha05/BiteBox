import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const DeliveryPartnerOrders = () => {
  const { token } = useAuth();
  const { partnerId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/delivery-partners/${partnerId}/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [partnerId]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading orders...</p>;
  if (orders.length === 0) return <p className="text-center mt-10 text-gray-500">No orders assigned to this partner yet.</p>;

  return (
    <div className="p-6 space-y-4">
      <Link to="/restaurant/delivery-partners" className="text-amber-600 hover:underline">← Back to Delivery Partners</Link>
      {orders.map((o) => (
        <div key={o._id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 hover:shadow-2xl transition-shadow">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Order #{o._id.slice(-6)}</h3>
            <span className="text-gray-500 text-sm">{new Date(o.createdAt).toLocaleString()}</span>
          </div>

          <div className="text-gray-700">
            <p><strong>Customer:</strong> {o.customer.name} ({o.customer.phone})</p>
            <p><strong>Items:</strong> {o.items.map(i => `${i.name} x${i.quantity}`).join(", ")}</p>
            <p><strong>Total:</strong> ${o.totalAmount.toFixed(2)}</p>
            <p><strong>Order Status:</strong> {o.status}</p>
            <p><strong>Delivery Status:</strong> {o.deliveryStatus.replaceAll("_", " ")}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeliveryPartnerOrders;
