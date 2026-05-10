import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../utils/api";
import { CheckCircle, ChevronLeft, ShoppingBag, ReceiptText, MapPin, ArrowRight } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { token, role } = useAuth();
  const { clearCart } = useCart();

  const { restaurantId, items = [], totalAmount } = location.state || {};

  const [order, setOrder] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authHeaders = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  useEffect(() => {
    if (!token || role !== "user") navigate("/auth", { replace: true });
    if (!items.length && !confirmed) navigate("/", { replace: true });
  }, [token, role, navigate, items.length, confirmed]);

  const handleConfirmOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post("/orders", { restaurantId, items, totalAmount }, authHeaders);
      clearCart();
      setOrder(res.data.data);
      setConfirmed(true);
    } catch (err) {
      setError(err.response?.data?.message || "Order placement failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        {!confirmed ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigate(`/menu/${restaurantId}` , { replace: true })}
                className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-amber-600 transition-all hover:cursor-pointer active:scale-95"
              >
                <ChevronLeft size={18} /> Back
              </button>
              <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-3 py-1 rounded-full uppercase tracking-tighter">Step 2 of 2</span>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><ReceiptText size={20} /></div>
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Order Summary</h1>
              </div>

              {/* Item List */}
              <div className="p-8 space-y-4 max-h-[40vh] overflow-y-auto no-scrollbar">
                {items.map((item) => (
                  <div key={item.menuItem} className="flex gap-4 items-center">
                    <img 
                      src={item.image || "/placeholder.png"} 
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm"
                      alt={item.name}
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-slate-800 capitalize">{item.name}</h3>
                      <p className="text-[11px] font-bold text-slate-400">QTY: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-black text-slate-900">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              {/* Billing Info */}
              <div className="p-8 bg-slate-50/50 space-y-3 border-t border-slate-100">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-emerald-600 uppercase tracking-widest">
                  <span>Delivery Fee</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-slate-200">
                  <span className="text-sm font-black text-slate-900 uppercase">Total Amount</span>
                  <span className="text-xl font-black text-slate-900">₹{totalAmount}</span>
                </div>
              </div>

              {/* Action */}
              <div className="p-8 pt-0">
                {error && <p className="text-xs font-bold text-red-500 mb-4 text-center">{error}</p>}
                <button
                  disabled={loading}
                  onClick={handleConfirmOrder}
                  className="w-full bg-amber-500 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-amber-600 transition-all hover:cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Place Order Now"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* SUCCESS STATE */
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl p-10 text-center overflow-hidden relative">
              {/* Decorative Circle */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-50 rounded-full" />
              
              <div className="relative">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <CheckCircle size={48} />
                </div>
                
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Order Confirmed!</h2>
                <p className="text-slate-500 text-sm font-medium mb-6">Your food is being prepared. Grab your forks!</p>
                
                <div className="inline-block px-4 py-2 bg-slate-100 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">
                  Order ID: <span className="text-slate-900 font-black">#{order?._id.slice(-6)}</span>
                </div>

                <div className="space-y-3 mb-10">
                  <button
                    onClick={() => navigate(`/track-order/${order._id}`, { replace: true })}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all hover:cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                  >
                    Track Live Progress <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => navigate("/", { replace: true })}
                    className="w-full bg-white text-slate-500 border border-slate-200 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all hover:cursor-pointer active:scale-95"
                  >
                    Back to Home
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-slate-400">
                   <MapPin size={14} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Delivering to your saved address</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Confirmation;