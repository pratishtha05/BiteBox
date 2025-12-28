import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { ChevronDown } from "lucide-react";

const Restaurants = () => {
  const { token } = useAuth();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRestaurant, setExpandedRestaurant] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [blockModal, setBlockModal] = useState({
    open: false,
    restaurantId: null,
    reason: "",
  });

  /* ---------------- MESSAGE ---------------- */
  const showMessage = (text, type = "success", duration = 4000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), duration);
  };

  /* ---------------- FETCH RESTAURANTS ---------------- */
  const fetchRestaurants = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/restaurants", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestaurants(res.data);
      setLoading(false);
    } catch {
      showMessage("Failed to fetch restaurants", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  /* ---------------- BLOCK / UNBLOCK ---------------- */
  const handleBlockUnblock = async (id, action = "block") => {
    if (action === "block" && !blockModal.reason)
      return showMessage("Please provide a reason", "error");

    try {
      await axios.put(
        `http://localhost:3000/admin/restaurants/${id}/${action}`,
        { reason: blockModal.reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showMessage(`Restaurant ${action}ed successfully`);
      setBlockModal({ open: false, restaurantId: null, reason: "" });
      fetchRestaurants();
    } catch {
      showMessage(`Failed to ${action} restaurant`, "error");
    }
  };

  if (loading)
    return <p className="text-center py-10 text-gray-500">Loading restaurants...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
     
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

      <div className="space-y-4">
        {restaurants.map((restaurant) => {
          const isExpanded = expandedRestaurant === restaurant._id;

          return (
            <div
              key={restaurant._id}
              className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-shadow"
            >
              {/* ---------- ROW ---------- */}
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() =>
                  setExpandedRestaurant(isExpanded ? null : restaurant._id)
                }
              >
                <div className="flex flex-col sm:flex-row sm:gap-6">
                  <span className="font-medium text-gray-900">
                    {restaurant.name}
                  </span>
                  <span className="text-gray-500">{restaurant.email}</span>
                  <span className="text-gray-500">{restaurant.phone}</span>
                  <span
                    className={`font-semibold ${
                      restaurant.isBlocked
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {restaurant.isBlocked
                      ? `Blocked (${restaurant.blockReason})`
                      : "Active"}
                  </span>
                </div>

                {/* ---------- ACTIONS ---------- */}
                <div className="flex items-center gap-3">
                  {!restaurant.isBlocked ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBlockModal({
                          open: true,
                          restaurantId: restaurant._id,
                          reason: "",
                        });
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 hover:cursor-pointer active:scale-95"
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBlockUnblock(restaurant._id, "unblock");
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 hover:cursor-pointer active:scale-95"
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

              {/* ---------- EXPANDED DETAILS ---------- */}
              {isExpanded && (
                <div className="p-4 bg-gray-50 border-t rounded-b-xl space-y-2">
                  <h3 className="font-semibold text-gray-700">
                    Restaurant Details
                  </h3>
                  <p>
                    <strong>Restaurant ID:</strong> {restaurant.restaurantId}
                  </p>
                  <p>
                    <strong>Name:</strong> {restaurant.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {restaurant.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {restaurant.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {restaurant.address}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ---------- BLOCK MODAL ---------- */}
      {blockModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-opacity-0 backdrop-blur-sm"
            onClick={() =>
              setBlockModal({ open: false, restaurantId: null, reason: "" })
            }
          />
          <div className="relative bg-white p-6 rounded-2xl w-96 shadow-lg z-10 space-y-4">
            <h2 className="text-lg font-semibold">Block Restaurant</h2>
            <textarea
              value={blockModal.reason}
              onChange={(e) =>
                setBlockModal({ ...blockModal, reason: e.target.value })
              }
              placeholder="Reason for blocking"
              className="w-full p-3 border rounded-lg"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setBlockModal({ open: false, restaurantId: null, reason: "" })
                }
                className="px-4 py-2 border rounded-lg hover:cursor-pointer active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleBlockUnblock(blockModal.restaurantId, "block")
                }
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:cursor-pointer active:scale-95"
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

export default Restaurants;
