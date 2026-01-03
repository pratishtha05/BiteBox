import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUS_COLORS = {
  placed: "bg-gray-100 text-gray-800",
  accepted: "bg-blue-100 text-blue-800",
  preparing: "bg-yellow-100 text-yellow-800",
  "out for delivery": "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const Orders = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [openDates, setOpenDates] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const isToday = (formattedDate) =>
    formattedDate === formatDate(new Date());

  const getLast7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(formatDate(d));
    }
    return days;
  };

  const STATUS_FLOW = [
    "placed",
    "accepted",
    "preparing",
    "out for delivery",
    "completed",
  ];

  const getNextStatus = (status) => {
    const index = STATUS_FLOW.indexOf(status);
    if (index === -1 || index === STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[index + 1];
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/order/restaurant",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartners = async () => {
    const res = await axios.get(
      "http://localhost:3000/delivery-partners/available",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPartners(res.data);
  };

  useEffect(() => {
    if (!token) return;
    fetchOrders();
    fetchPartners();
  }, [token]);

  const groupedOrders = orders.reduce((acc, order) => {
    const key = formatDate(order.createdAt);
    acc[key] = acc[key] || [];
    acc[key].push(order);
    return acc;
  }, {});

  const visibleDates = showAll
    ? Object.keys(groupedOrders)
    : getLast7Days();

  useEffect(() => {
    const state = {};
    visibleDates.forEach((date) => {
      state[date] = isToday(date);
    });
    setOpenDates(state);
  }, [showAll, orders]);

  const assignPartner = async (orderId, partnerId) => {
    if (!partnerId) return;
    await axios.put(
      `http://localhost:3000/order/${orderId}/assign-delivery`,
      { deliveryPartnerId: partnerId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchOrders();
  };

  const updateStatus = async (orderId, status) => {
    try {
      setUpdating(orderId);
      await axios.put(
        `http://localhost:3000/order/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } finally {
      setUpdating(null);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading orders...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm font-medium text-amber-600 hover:underline"
        >
          {showAll ? "View Last 7 Days" : "View All Orders"}
        </button>
      </div>

      {/* Date Sections */}
      {visibleDates.map((date) => {
        const dayOrders = groupedOrders[date] || [];
        return (
          <div key={date} className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Date Header */}
            <button
              onClick={() =>
                setOpenDates((p) => ({ ...p, [date]: !p[date] }))
              }
              className="w-full px-6 py-4 flex justify-between items-center border-b hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-semibold text-gray-800">{date}</p>
                <p className="text-sm text-gray-500">
                  {dayOrders.length} order{dayOrders.length > 1 ? "s" : ""}
                </p>
              </div>
              {openDates[date] ? <ChevronUp /> : <ChevronDown />}
            </button>

            {/* Orders */}
            {openDates[date] && (
              <div className="p-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3 transition-all duration-300">
                {dayOrders.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No orders for this day
                  </p>
                )}

                {dayOrders.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-2xl p-5 space-y-4 hover:shadow-xl transition duration-300"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">
                        Order #{order._id.slice(-6)}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          STATUS_COLORS[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="text-sm text-gray-700">
                      {order.items.map((i) => (
                        <p key={i.menuItem}>
                          {i.name} × {i.quantity}
                        </p>
                      ))}
                    </div>

                    {/* Delivery */}
                    {!order.deliveryPartner ? (
                      <select
                        onChange={(e) =>
                          assignPartner(order._id, e.target.value)
                        }
                        className="w-full border rounded-lg px-3 py-2"
                      >
                        <option value="">Assign delivery partner</option>
                        {partners.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex justify-between items-center bg-green-50 px-3 py-2 rounded-lg">
                        <span className="text-sm font-medium text-green-700">
                          {order.deliveryPartner.name}
                        </span>
                        <button
                          onClick={() =>
                            navigate(`/delivery-updates/${order._id}`)
                          }
                          className="text-sm text-amber-600 hover:underline"
                        >
                          View
                        </button>
                      </div>
                    )}

                    {/* Status */}
                    {getNextStatus(order.status) && (
                      <button
                        disabled={updating === order._id}
                        onClick={() =>
                          updateStatus(order._id, getNextStatus(order.status))
                        }
                        className="w-full bg-linear-to-r from-amber-500 to-amber-600 text-white py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
                      >
                        Mark as {getNextStatus(order.status)}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Orders;
