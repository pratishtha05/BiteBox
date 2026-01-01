import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [openDates, setOpenDates] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ---------------- HELPERS ---------------- */

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const isToday = (date) =>
    new Date(date).toDateString() === new Date().toDateString();

  const getLast7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(formatDate(d));
    }
    return days;
  };

  const getNextStatus = (status) => {
    const flow = ["pending", "accepted", "preparing", "completed"];
    const index = flow.indexOf(status);
    return index >= 0 && index < flow.length - 1 ? flow[index + 1] : null;
  };

  /* ---------------- FETCH DATA ---------------- */

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
    fetchOrders();
    fetchPartners();
  }, []);

  /* ---------------- GROUPING ---------------- */

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

  /* ---------------- ACTIONS ---------------- */

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
    await axios.put(
      `http://localhost:3000/order/${orderId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchOrders();
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading orders...</p>;
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <button
          // onClick={() => setShowAll(!showAll)}
          className="text-sm font-medium text-amber-600 hover:underline"
        >
          {/* {showAll ? "View Last 7 Days" : "View All Orders"} */}View all Orders
        </button>
      </div>

      {/* Date Sections */}
      {visibleDates.map((date) => {
        const dayOrders = groupedOrders[date] || [];

        return (
          <div key={date} className="bg-white rounded-xl shadow">
            {/* Date Header */}
            <button
              onClick={() =>
                setOpenDates((p) => ({ ...p, [date]: !p[date] }))
              }
              className="w-full px-6 py-4 flex justify-between items-center border-b"
            >
              <div>
                <p className="font-semibold text-gray-800">{date}</p>
                <p className="text-sm text-gray-500">
                  {dayOrders.length} orders
                </p>
              </div>
              {openDates[date] ? <ChevronUp /> : <ChevronDown />}
            </button>

            {/* Orders */}
            {openDates[date] && (
              <div className="p-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {dayOrders.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No orders for this day
                  </p>
                )}

                {dayOrders.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-2xl p-5 space-y-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between">
                      <h3 className="font-semibold">
                        Order #{order._id.slice(-6)}
                      </h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
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
                        onClick={() =>
                          updateStatus(order._id, getNextStatus(order.status))
                        }
                        className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600"
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
