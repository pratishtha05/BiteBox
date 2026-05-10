import { useEffect, useState } from "react";
import api from "../../utils/api";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

/* =========================
   Delivery Partners
========================= */
const DeliveryPartners = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const authHeaders = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  useEffect(() => {
    if (!token) return;

    const fetchPartners = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(
          "/delivery-partners/available",
          authHeaders
        );

        setPartners(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch delivery partners:", err);
        setError("Unable to load delivery partners");
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [token]);

  /* =========================
     UI States
  ========================= */
  if (loading) {
    return (
      <div className="px-4">
        <p className="text-center mt-10 text-gray-500 text-sm sm:text-base">
          Loading delivery partners…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4">
        <p className="text-center mt-10 text-red-500 text-sm sm:text-base">
          {error}
        </p>
      </div>
    );
  }

  if (!partners.length) {
    return (
      <div className="px-4">
        <p className="text-center mt-10 text-gray-500 text-sm sm:text-base">
          No delivery partners assigned yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {partners.map((partner) => (
          <div
            key={partner._id}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6
              hover:shadow-2xl transition-shadow duration-300
              flex flex-col justify-between min-h-[220px]"
          >
            <div className="space-y-2 overflow-hidden">
              <h3 className="font-bold text-base sm:text-lg text-gray-800 break-words">
                {partner.name}
              </h3>

              <p className="text-gray-600 text-sm sm:text-base break-all">
                {partner.phone}
              </p>

              <p className="text-gray-600 text-sm sm:text-base break-all">
                {partner.email}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() =>
                  navigate(
                    `/restaurant/delivery-partner/${partner._id}/orders`
                  )
                }
                className="flex items-center gap-2 text-amber-600
                  font-semibold hover:underline text-sm sm:text-base
                  active:scale-95 transition-transform"
              >
                View Orders <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryPartners;