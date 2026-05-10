import { useEffect, useState } from "react";
import { Tag, ArrowRight, Clock, AlertCircle } from "lucide-react";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${SERVER_URL}/deals`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        setDeals(json.data || []);
      } catch (err) {
        setError("Unable to sync current offers.");
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  return (
    <section className="py-5 px-6 ">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Explore Deals
          </h2>
          <p className="mt-3 text-slate-500 text-sm font-medium leading-relaxed">
            Select offers curated from top-rated restaurants, available for a limited time.
          </p>
        </div>

        {/* STATES */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-50 rounded-2xl animate-pulse border border-slate-100" />
            ))}
          </div>
        )}

        {error && (
          <div className="py-12 px-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 justify-center text-slate-500">
            <AlertCircle size={18} />
            <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
          </div>
        )}

        {/* DEALS GRID */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map((deal) => {
              const isExpired = deal.validTill && new Date(deal.validTill) < new Date();
              
              return (
                <div
                  key={deal._id}
                  className="group flex flex-col bg-white rounded-3xl shadow-sm hover:shadow-md overflow-hidden transition-all duration-300 hover:border-amber-200"
                >
                  {/* Image Box */}
                  <div className="relative h-44 bg-slate-50 overflow-hidden">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    {isExpired && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full">Expired</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md uppercase">Limited</span>
                        {deal.validTill && (
                          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-medium">
                            <Clock size={12} />
                            <span>Ends soon</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                        {deal.title}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
                        {deal.description}
                      </p>
                    </div>

                    <button
                      disabled={isExpired}
                      className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-[0.98] hover:cursor-pointer ${
                        isExpired
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-slate-900 text-white hover:bg-amber-600 shadow-sm"
                      }`}
                    >
                      {isExpired ? "Unavailable" : "Claim Deal"}
                      {!isExpired && <ArrowRight size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Deals;