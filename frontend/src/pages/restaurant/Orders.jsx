import { useEffect, useMemo, useState, useCallback } from "react";
import { Calendar, ChevronRight, Clock, Package, User, MapPin, Search, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const STATUS_FLOW = ["placed", "accepted", "preparing", "out for delivery", "completed"];

const STATUS_THEMES = {
  placed: "bg-slate-100 text-slate-700 border-slate-200",
  accepted: "bg-blue-50 text-blue-600 border-blue-100",
  preparing: "bg-orange-50 text-orange-600 border-orange-100",
  "out for delivery": "bg-purple-50 text-purple-600 border-purple-100",
  completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

const Orders = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const authHeaders = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  const fetchData = useCallback(async () => {
    try {
      const [ordRes, partRes] = await Promise.all([
        api.get("/orders/restaurant", authHeaders),
        api.get("/delivery-partners/available", authHeaders),
      ]);
      setOrders(ordRes.data.data || []);
      setPartners(partRes.data.data || []);
    } catch (err) {
      console.error("Sync failed");
    }
  }, [authHeaders]);

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchData().finally(() => setLoading(false));
    }
  }, [token, fetchData]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
      const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase());
      return orderDate === selectedDate && matchesSearch;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, selectedDate, searchTerm]);

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingOrderId(orderId);
      await api.put(`/orders/${orderId}/status`, { status }, authHeaders);
      await fetchData();
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const assignPartner = async (orderId, partnerId) => {
    if (!partnerId) return;
    setUpdatingOrderId(orderId);
    await api.put(`/orders/${orderId}/assign-delivery`, { deliveryPartnerId: partnerId }, authHeaders);
    await fetchData();
    setUpdatingOrderId(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">Syncing Kitchen Feed...</p>
      </div>
    </div>
  );

  return (
    <div className="pb-20 bg-gray-50">
      
      {/* NAV */}
      <div className="top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              Order Management
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full md:w-auto">
            
            <div className="relative group w-full sm:w-auto">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="text"
                placeholder="Search ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none w-full md:w-48 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm w-full sm:w-auto">
              <Calendar size={16} className="ml-2 text-gray-500" />
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none text-sm font-bold text-gray-700 focus:ring-0 cursor-pointer w-full sm:w-auto"
              />
            </div>

          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 sm:py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Package className="text-gray-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No Orders Found</h3>
            <p className="text-gray-400 text-sm mt-1 text-center px-4">
              Try a different date or clear your search.
            </p>
          </div>
        ) : (
          
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            
            {filteredOrders.map((order) => {
              const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1];
              const isUpdating = updatingOrderId === order._id;

              return (
                <div key={order._id} className="group bg-white rounded-4xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  
                  {/* HEADER */}
                  <div className="px-6 py-5 flex justify-between items-start border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                        <Hash size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">ID</p>
                        <p className="font-mono font-bold text-gray-900 leading-none">
                          {order._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${STATUS_THEMES[order.status]}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* BODY */}
                  <div className="p-6 space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <div className="flex gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-gray-50 text-gray-500 font-bold text-xs">
                            {item.quantity}
                          </span>
                          <span className="text-gray-700 font-semibold">
                            {item.name}
                          </span>
                        </div>
                      </div>
                    ))}

                    <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between items-center">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Bill</p>
                      <p className="text-xl font-black text-gray-900">₹{order.totalAmount}</p>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="p-6 bg-gray-50/50 border-t border-gray-50 space-y-4">
                    
                    {order.status !== "placed" && (
                      <div className="relative">
                        {!order.deliveryPartner ? (
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-gray-400 absolute left-3" />
                            <select
                              disabled={isUpdating}
                              onChange={(e) => assignPartner(order._id, e.target.value)}
                              className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-orange-500/20 outline-none font-bold text-gray-700"
                            >
                              <option value="">Select Rider</option>
                              {partners.map(p => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <User size={16} />
                              </div>
                              <div>
                                <p className="text-[8px] font-black text-emerald-600 uppercase">Assigned Rider</p>
                                <p className="text-xs font-bold text-gray-800">
                                  {order.deliveryPartner.name}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {nextStatus ? (
                      <button
                        disabled={isUpdating}
                        onClick={() => updateStatus(order._id, nextStatus)}
                        className="w-full bg-gray-900 text-white text-xs font-black py-4 rounded-2xl hover:bg-orange-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-gray-200 hover:shadow-orange-200 disabled:opacity-50"
                      >
                        {isUpdating ? "UPDATING..." : `MOVE TO ${nextStatus.toUpperCase()}`}
                        {!isUpdating && <ChevronRight size={16} />}
                      </button>
                    ) : (
                      <div className="w-full py-4 rounded-2xl bg-emerald-500 text-white text-xs font-black text-center">
                        ORDER COMPLETED
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;