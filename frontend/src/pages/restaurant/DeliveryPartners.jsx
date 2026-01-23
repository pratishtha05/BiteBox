import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const SERVER_URL = "http://localhost:3000/api/v1";

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

        const res = await axios.get(
          `${SERVER_URL}/delivery-partners/available`,
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
      <p className="text-center mt-10 text-gray-500">
        Loading delivery partners…
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        {error}
      </p>
    );
  }

  if (!partners.length) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No delivery partners assigned yet.
      </p>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {partners.map((partner) => (
        <div
          key={partner._id}
          className="bg-white rounded-2xl shadow-lg p-6 
            hover:shadow-2xl transition-shadow duration-300 
            flex flex-col justify-between"
        >
          <div>
            <h3 className="font-bold text-lg text-gray-800">
              {partner.name}
            </h3>
            <p className="text-gray-600">{partner.phone}</p>
            <p className="text-gray-600">{partner.email}</p>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() =>
                navigate(`/restaurant/delivery-partner/${partner._id}/orders`)
              }
              className="flex items-center gap-2 text-amber-600 
                font-semibold hover:underline"
            >
              View Orders <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeliveryPartners;
