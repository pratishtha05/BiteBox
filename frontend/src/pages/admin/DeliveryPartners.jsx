import { useEffect, useRef, useState } from "react";
import api from "../../utils/api";
import { ChevronDown } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const DeliveryPartners = () => {
  const { token } = useAuth();
  const messageTimer = useRef(null);

  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [blockModal, setBlockModal] = useState({
    open: false,
    partnerId: null,
    reason: "",
  });

  const authHeaders = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  const showMessage = (text, type = "success", duration = 4000) => {
    clearTimeout(messageTimer.current);
    setMessage({ text, type });

    messageTimer.current = setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, duration);
  };

  const fetchPartners = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/delivery-partners", authHeaders);

      setPartners(res.data.data || []);
    } catch (err) {
      console.error(err);
      showMessage("Failed to fetch delivery partners", "error");
    } finally {
      setLoading(false);
    }
  };

  const updatePartnerStatus = async (partnerId, action) => {
    if (action === "block" && !blockModal.reason.trim()) {
      return showMessage("Please provide a reason", "error");
    }

    try {
      await api.put(
        `/admin/delivery-partners/${partnerId}/${action}`,
        { reason: blockModal.reason },
        authHeaders
      );

      showMessage(`Delivery partner ${action}ed successfully`);
      setBlockModal({ open: false, partnerId: null, reason: "" });
      fetchPartners();
    } catch (err) {
      console.error(err);
      showMessage(`Failed to ${action} delivery partner`, "error");
    }
  };

  /* =========================
     Effects
  ========================= */
  useEffect(() => {
    if (!token) return;
    fetchPartners();

    return () => clearTimeout(messageTimer.current);
  }, [token]);

  /* =========================
     UI States
  ========================= */
  if (loading) {
    return (
      <p className="text-center py-10 text-gray-500">
        Loading delivery partners…
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Message */}
      {message.text && (
        <p
          className={`p-3 rounded-md text-center ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Partner List */}
      <div className="space-y-4">
        {partners.map((partner) => {
          const isExpanded = expandedId === partner._id;

          return (
            <div
              key={partner._id}
              className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() =>
                  setExpandedId(isExpanded ? null : partner._id)
                }
              >
                <div className="flex flex-col sm:flex-row sm:gap-6">
                  <span className="font-medium text-gray-900">
                    {partner.name}
                  </span>
                  <span className="text-gray-500">{partner.email}</span>
                  <span className="text-gray-500">{partner.phone}</span>
                  <span
                    className={`font-semibold ${
                      partner.isBlocked
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {partner.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {!partner.isBlocked ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBlockModal({
                          open: true,
                          partnerId: partner._id,
                          reason: "",
                        });
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 active:scale-95"
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePartnerStatus(partner._id, "unblock");
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 active:scale-95"
                    >
                      Unblock
                    </button>
                  )}

                  <ChevronDown
                    size={22}
                    className={`text-gray-400 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Expanded */}
              {isExpanded && (
                <div className="p-4 bg-gray-50 border-t rounded-b-xl space-y-2">
                  <h3 className="font-semibold text-gray-700">
                    Partner Details
                  </h3>
                  <p>
                    <strong>Name:</strong> {partner.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {partner.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {partner.phone}
                  </p>
                  <p>
                    <strong>Availability:</strong>{" "}
                    {partner.isAvailable ? "Available" : "Busy"}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Block Modal */}
      {blockModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 backdrop-blur-sm"
            onClick={() =>
              setBlockModal({ open: false, partnerId: null, reason: "" })
            }
          />
          <div className="relative bg-white p-6 rounded-2xl w-96 shadow-lg z-10 space-y-4">
            <h2 className="text-lg font-semibold">
              Block Delivery Partner
            </h2>

            <textarea
              value={blockModal.reason}
              onChange={(e) =>
                setBlockModal({
                  ...blockModal,
                  reason: e.target.value,
                })
              }
              placeholder="Reason for blocking"
              className="w-full p-3 border rounded-lg"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setBlockModal({
                    open: false,
                    partnerId: null,
                    reason: "",
                  })
                }
                className="px-4 py-2 border rounded-lg active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  updatePartnerStatus(blockModal.partnerId, "block")
                }
                className="px-4 py-2 bg-red-600 text-white rounded-lg active:scale-95"
              >
                Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryPartners;
