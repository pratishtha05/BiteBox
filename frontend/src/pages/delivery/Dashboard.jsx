import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const DeliveryDashboard = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axios.get("http://localhost:3000/orders/delivery/my-orders", { headers: { Authorization: `Bearer ${token}` } });
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    await axios.put(`http://localhost:3000/orders/${orderId}/delivery-status`, { deliveryStatus: status }, { headers: { Authorization: `Bearer ${token}` } });
    fetchOrders();
  };

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order._id} className="border p-4 rounded-lg">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Restaurant:</strong> {order.restaurant.name}</p>
          <p><strong>Customer:</strong> {order.customer.name}</p>
          <p><strong>Delivery Status:</strong> {order.deliveryStatus}</p>
          <div className="mt-2 space-x-2">
            {["picked_up","on_the_way","delivered"].map(s => (
              <button key={s} onClick={() => updateStatus(order._id, s)}
                      className="px-3 py-1 bg-blue-600 text-white rounded">{s.replace("_"," ")}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeliveryDashboard;
