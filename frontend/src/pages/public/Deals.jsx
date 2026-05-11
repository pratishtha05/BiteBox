import { useEffect, useState } from "react";
import {
  ArrowRight,
  Clock,
  AlertCircle,
} from "lucide-react";

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
    <section className="py-5 px-4 sm:px-6 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 sm:mb-12 md:mb-16 max-w-2xl text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Explore Deals
          </h2>

          <p className="mt-3 text-slate-500 text-sm font-medium leading-relaxed">
            Select offers curated from top-rated restaurants,
            available for a limited time.
          </p>
        </div>

        {/* STATES */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 bg-slate-50 rounded-2xl animate-pulse border border-slate-100"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="py-10 sm:py-12 px-4 sm:px-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center gap-3 justify-center text-slate-500 text-center">
            <AlertCircle
              size={18}
              className="shrink-0"
            />

            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              {error}
            </p>
          </div>
        )}

        {/* DEALS GRID */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {deals.map((deal) => {
              const isExpired =
                deal.validTill &&
                new Date(deal.validTill) < new Date();

              return (
                <div
                  key={deal._id}
                  className="group flex flex-col bg-white rounded-[2rem] sm:rounded-3xl shadow-sm hover:shadow-md overflow-hidden transition-all duration-300 hover:border-amber-200"
                >
                  {/* Image Box */}
                  <div className="relative h-40 sm:h-44 bg-slate-50 overflow-hidden">
                    <img
                      src={deal.image || "https://via.placeholder.com/400x300?text=No+Image"}
                      alt={deal.title}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />

                    {isExpired && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                          Expired
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md uppercase whitespace-nowrap">
                          Limited
                        </span>

                        {deal.validTill && (
                          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-medium whitespace-nowrap">
                            <Clock size={12} />
                            <span>Ends soon</span>
                          </div>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug break-words">
                        {deal.title}
                      </h3>

                      <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed break-words">
                        {deal.description}
                      </p>
                    </div>

                    <button
                      disabled={isExpired}
                      className={`mt-5 sm:mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all active:scale-[0.98] hover:cursor-pointer ${
                        isExpired
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-slate-900 text-white hover:bg-amber-600 shadow-sm"
                      }`}
                    >
                      {isExpired
                        ? "Unavailable"
                        : "Claim Deal"}

                      {!isExpired && (
                        <ArrowRight size={14} />
                      )}
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