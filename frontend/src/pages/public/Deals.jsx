import { useEffect, useState } from "react";

const SERVER_URL = "http://localhost:3000/api/v1/public";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${SERVER_URL}/deals`);
        if (!res.ok) throw new Error("Failed to load deals");

        const json = await res.json();
        setDeals(json.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch deals. Please try again.");
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  return (
    <section className="mt-4 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-2xl font-bold text-gray-900">
            Explore Deals
          </h2>
          <p className="text-gray-600 mt-2 text-sm ">
            Grab the best offers before they're gone!
          </p>
        </div>

        {/* States */}
        {loading && (
          <p className="text-gray-500 text-center animate-pulse">
            Loading deals...
          </p>
        )}

        {!loading && error && (
          <p className="text-red-500 text-center font-medium">{error}</p>
        )}

        {!loading && !error && deals.length === 0 && (
          <p className="text-gray-500 text-center mt-10">
            No deals available right now
          </p>
        )}

        {/* Deals Grid */}
        {!loading && deals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
            {deals.map((deal) => {
              const isExpired =
                deal.validTill && new Date(deal.validTill) < new Date();

              return (
                <div
                  key={deal._id}
                  className="relative group bg-white rounded-2xl overflow-hidden
                             shadow-lg hover:shadow-2xl transition-all duration-300
                             hover:-translate-y-1 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col justify-between h-auto">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {deal.title}
                      </h3>
                      <p className="text-gray-600 mt-2 text-sm line-clamp-3">
                        {deal.description}
                      </p>
                    </div>

                    <button
                      className={`mt-4 w-full py-2.5 rounded-xl font-semibold transition-all duration-150 hover:cursor-pointer ${
                        isExpired
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-amber-500 text-white hover:bg-amber-600 active:scale-95"
                      }`}
                      disabled={isExpired}
                    >
                      {isExpired ? "Expired" : "Grab Deal"}
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
