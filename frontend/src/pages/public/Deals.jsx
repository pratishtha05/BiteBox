import { useEffect, useState } from "react";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://localhost:3000/public/deals`);

        if (!res.ok) {
          throw new Error("Failed to load deals");
        }

        const data = await res.json();
        setDeals(data);
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
    <div className="p-6 max-w-7xl mx-auto">
    
      <h2 className="text-2xl font-bold mb-6 capitalize text-gray-800">
        Explore Deals
      </h2>

      {loading && <p className="text-gray-500">Loading deals...</p>}

      {!loading && error && <p className="text-red-500 font-medium">{error}</p>}

      {!loading && !error && deals.length === 0 && (
        <p className="text-gray-500">No deals available right now</p>
      )}

      {!loading && deals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <div
              key={deal._id}
              className="bg-white shadow-lg rounded-xl overflow-hidden
                         hover:scale-[1.02] transition-transform duration-200"
            >
              <img
                src={deal.image || "/placeholder-deal.jpg"}
                alt={deal.title}
                className="w-full h-40 object-cover"
              />

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {deal.title}
                </h2>

                <p className="text-gray-500 mt-1 text-sm">{deal.description}</p>

                <button
                  className="mt-4 w-full bg-amber-500 text-white py-2
                             rounded-lg hover:bg-amber-600 transition"
                >
                  Grab Deal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Deals;
