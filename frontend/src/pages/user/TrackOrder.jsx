import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Receipt,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const STATUS_FLOW = [
  { key: "placed", label: "Placed", desc: "Order received", icon: Package },
  {
    key: "accepted",
    label: "Accepted",
    desc: "Restaurant confirmed",
    icon: CheckCircle2,
  },
  {
    key: "preparing",
    label: "Preparing",
    desc: "Chef is cooking",
    icon: Clock,
  },
  {
    key: "out for delivery",
    label: "On the way",
    desc: "Driver is nearby",
    icon: Truck,
  },
  {
    key: "completed",
    label: "Delivered",
    desc: "Enjoy your meal",
    icon: CheckCircle2,
  },
];

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    if (!token) return;

    try {
      const res = await api.get(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrder(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [orderId, token]);

  useEffect(() => {
    fetchOrder();

    const interval = setInterval(fetchOrder, 10000);

    return () => clearInterval(interval);
  }, [fetchOrder]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center px-4">
        <div className="w-12 h-12 border-[3px] border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const currentIndex = STATUS_FLOW.findIndex(
    (s) => s.key === order.status
  );

  return (
    <div className="bg-[#F8F9FB] text-slate-900 font-sans antialiased pb-10 sm:pb-20 min-h-screen overflow-x-hidden">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-amber-600 transition-all active:scale-95 group hover:cursor-pointer shrink-0"
          >
            <ChevronLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="hidden sm:inline">
              Back to History
            </span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="text-right min-w-0">
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
              Order ID
            </p>

            <p className="text-xs sm:text-sm font-black text-slate-800 truncate">
              #{orderId.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-100 overflow-hidden">
              <div className="mb-10 sm:mb-12">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight mb-2 leading-tight">
                  {order.status === "completed"
                    ? "Delivered!"
                    : "Coming your way"}
                </h1>

                <p className="text-sm sm:text-base text-slate-500 font-medium">
                  Estimated arrival in{" "}
                  <span className="text-amber-600">
                    12-15 mins
                  </span>
                </p>
              </div>

              {/* Desktop Progress */}
              <div className="hidden md:block relative mb-16 px-4">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2" />

                <div
                  className="absolute top-1/2 left-0 h-0.5 bg-amber-500 -translate-y-1/2 transition-all duration-1000 ease-in-out"
                  style={{
                    width: `${
                      (currentIndex /
                        (STATUS_FLOW.length - 1)) *
                      100
                    }%`,
                  }}
                />

                <div className="relative flex justify-between">
                  {STATUS_FLOW.map((step, index) => {
                    const active = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                      <div
                        key={step.key}
                        className="flex flex-col items-center"
                      >
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 ${
                            active
                              ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                              : "bg-white border-2 border-slate-100 text-slate-300"
                          } ${
                            isCurrent
                              ? "ring-4 ring-amber-100 scale-110"
                              : ""
                          }`}
                        >
                          <step.icon size={18} />
                        </div>

                        <div
                          className={`absolute top-14 text-center transition-opacity duration-300 ${
                            isCurrent
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        >
                          <p className="text-xs font-black uppercase tracking-widest text-slate-900 whitespace-nowrap">
                            {step.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Progress */}
              <div className="md:hidden space-y-4">
                {STATUS_FLOW.map((step, index) => {
                  const active = index <= currentIndex;
                  const isCurrent = index === currentIndex;

                  return (
                    <div
                      key={step.key}
                      className="flex items-start gap-4 relative"
                    >
                      {/* Line */}
                      {index !== STATUS_FLOW.length - 1 && (
                        <div
                          className={`absolute left-5 top-10 w-0.5 h-10 ${
                            active
                              ? "bg-amber-500"
                              : "bg-slate-200"
                          }`}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                          active
                            ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                            : "bg-white border-2 border-slate-100 text-slate-300"
                        } ${
                          isCurrent
                            ? "ring-4 ring-amber-100 scale-105"
                            : ""
                        }`}
                      >
                        <step.icon size={18} />
                      </div>

                      {/* Text */}
                      <div className="pt-1 min-w-0">
                        <p
                          className={`text-sm font-black uppercase tracking-wide ${
                            active
                              ? "text-slate-900"
                              : "text-slate-400"
                          }`}
                        >
                          {step.label}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6 sm:mb-8">
                <Receipt
                  size={20}
                  className="text-amber-500 shrink-0"
                />

                <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest">
                  Receipt Summary
                </h3>
              </div>

              <div className="space-y-4 mb-8">
                {order.items.map((item) => (
                  <div
                    key={item.menuItem}
                    className="flex justify-between items-start gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 shrink-0 bg-slate-50 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400">
                        {item.quantity}x
                      </div>

                      <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors break-words">
                        {item.name}
                      </span>
                    </div>

                    <span className="text-sm font-black text-slate-900 shrink-0">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-dashed border-slate-200 space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>Subtotal</span>
                  <span>₹{order.totalAmount}</span>
                </div>

                <div className="flex justify-between text-xs font-bold text-emerald-500">
                  <span>Delivery Fee</span>
                  <span>FREE</span>
                </div>

                <div className="flex justify-between pt-4 gap-4">
                  <span className="text-sm font-black uppercase">
                    Paid Total
                  </span>

                  <span className="text-sm font-black shrink-0">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackOrder;