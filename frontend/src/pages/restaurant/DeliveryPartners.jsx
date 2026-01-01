import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DeliveryPartners = () => {
  const { token } = useAuth();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPartners = async () => {
    try {
      const res = await axios.get("http://localhost:3000/delivery-partners", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPartners(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading delivery partners...</p>;
  if (partners.length === 0) return <p className="text-center mt-10 text-gray-500">No delivery partners assigned yet.</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {partners.map((p) => (
        <div
          key={p._id}
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between"
        >
          <div>
            <h3 className="font-bold text-lg text-gray-800">{p.name}</h3>
            <p className="text-gray-600">{p.phone}</p>
            <p className="text-gray-600">{p.email}</p>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => navigate(`/delivery-partner/${p._id}/orders`)}
              className="flex items-center gap-2 text-amber-600 font-semibold hover:underline"
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
