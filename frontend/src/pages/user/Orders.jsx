import { useEffect, useState, useMemo } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ChevronRight,
  AlertCircle,
  Bike,
  CheckCircle2,
  UtensilsCrossed,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const getStatusStyles = (status) => {
  switch (status.toLowerCase()) {
    case "placed":
      return "bg-slate-100 text-slate-600 border-slate-200";
    case "accepted":
      return "bg-indigo-50 text-indigo-600 border-indigo-100";
    case "preparing":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "out for delivery":
      return "bg-purple-50 text-purple-600 border-purple-100";
    case "completed":
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    default:
      return "bg-slate-50 text-slate-500 border-slate-100";
  }
};

const Orders = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated, role } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  useEffect(() => {
    if (!isAuthenticated || role !== "user") return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/orders/me", authHeaders);
        setOrders(res.data.data || []);
      } catch (err) {
        setError("Unable to sync your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, role, authHeaders]);

  const filteredOrders = useMemo(() => {
    if (activeTab === "active")
      return orders.filter((o) =>
        ["placed", "accepted", "preparing", "out for delivery"].includes(
          o.status.toLowerCase()
        )
      );

    if (activeTab === "past")
      return orders.filter(
        (o) => o.status.toLowerCase() === "completed"
      );

    return orders;
  }, [orders, activeTab]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 mb-8 sm:mb-10">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Orders
          </h1>

          <div className="text-xs sm:text-sm text-slate-500 mt-1">
            {orders.length}{" "}
            {orders.length === 1 ? "order" : "orders"} placed so far
          </div>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-2xl w-full sm:w-fit border border-slate-200 shadow-inner overflow-x-auto hide-scrollbar">
          {["all", "active", "past"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap hover:cursor-pointer active:scale-95 ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      {error ? (
        <div className="bg-rose-50 border border-rose-100 p-5 sm:p-6 rounded-3xl text-center flex items-center justify-center gap-3">
          <AlertCircle className="text-rose-500 shrink-0" size={18} />
          <p className="text-rose-700 font-bold text-xs sm:text-sm">
            {error}
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 sm:py-20 bg-white border border-slate-100 rounded-[2.5rem]">
          <ShoppingBag
            className="mx-auto text-slate-200 mb-4"
            size={40}
          />

          <p className="text-slate-400 font-bold text-xs sm:text-sm uppercase tracking-widest">
            No records found
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = order.status.toLowerCase();

            return (
              <div
                key={order._id}
                className="group bg-white border border-slate-200 rounded-[2rem] sm:rounded-4xl p-4 sm:p-5 md:p-6 flex flex-col lg:flex-row items-start lg:items-center gap-5 sm:gap-6 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300"
              >
                {/* Visual Status Indicator */}
                <div className="w-full lg:w-40 h-24 sm:h-28 lg:h-24 bg-slate-50 rounded-3xl flex flex-col items-center justify-center border border-slate-100 shrink-0">
                  {status === "completed" && (
                    <CheckCircle2
                      className="text-emerald-500 mb-1"
                      size={20}
                    />
                  )}

                  {status === "out for delivery" && (
                    <Bike
                      className="text-purple-500 mb-1 animate-bounce"
                      size={20}
                    />
                  )}

                  {status === "preparing" && (
                    <UtensilsCrossed
                      className="text-amber-500 mb-1 animate-pulse"
                      size={20}
                    />
                  )}

                  <span
                    className={`px-3 py-1 mt-1 rounded-full text-[9px] font-black border uppercase tracking-widest text-center ${getStatusStyles(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 w-full min-w-0 text-left">
                  <h3 className="font-black text-slate-800 text-base sm:text-lg uppercase tracking-tight group-hover:text-amber-600 transition-colors break-words">
                    {order.restaurant?.name || "Kitchen"}
                  </h3>

                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-tighter mt-1 break-all">
                    ID: #{order._id.slice(-6).toUpperCase()}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {order.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] sm:text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 break-words"
                      >
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between w-full lg:w-auto gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right lg:text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Amount
                    </p>

                    <p className="text-lg sm:text-xl font-black text-slate-900">
                      ₹{order.totalAmount}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/track-order/${order._id}`)
                    }
                    className="w-full sm:w-auto bg-amber-500 text-white px-5 sm:px-6 py-3 rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:bg-amber-600 active:scale-95 transition-all hover:cursor-pointer flex items-center justify-center gap-2"
                  >
                    {status === "completed"
                      ? "Details"
                      : "Track Order"}

                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;