import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const SERVER_URL = "http://localhost:3000/api/v1";

const Restaurants = () => {
  const { token } = useAuth();

  const [restaurants, setRestaurants] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const [blockModal, setBlockModal] = useState({
    open: false,
    restaurantId: null,
    reason: "",
  });

  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const showMessage = (text, type = "success", timeout = 4000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), timeout);
  };

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${SERVER_URL}/admin/restaurants`,
        authHeaders
      );
      setRestaurants(res.data.data || []);
    } catch (err) {
      console.error(err);
      showMessage("Failed to fetch restaurants", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, action) => {
    if (action === "block" && !blockModal.reason) {
      return showMessage("Please provide a reason", "error");
    }

    try {
      await axios.put(
        `${SERVER_URL}/admin/restaurants/${id}/${action}`,
        { reason: blockModal.reason },
        authHeaders
      );

      showMessage(`Restaurant ${action}ed successfully`);
      setBlockModal({ open: false, restaurantId: null, reason: "" });
      fetchRestaurants();
    } catch (err) {
      console.error(err);
      showMessage(`Failed to ${action} restaurant`, "error");
    }
  };

  useEffect(() => {
    if (token) fetchRestaurants();
  }, [token]);

  if (loading) {
    return (
      <p className="text-center py-10 text-gray-500">
        Loading restaurants…
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Message */}
      {message && (
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

      {/* Restaurants List */}
      <div className="space-y-4">
        {restaurants.map((restaurant) => {
          const isExpanded = expandedId === restaurant._id;

          return (
            <div
              key={restaurant._id}
              className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition"
            >
              {/* Header */}
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() =>
                  setExpandedId(isExpanded ? null : restaurant._id)
                }
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        restaurant.image || "/placeholder-restaurant.jpg"
                      }
                      alt={restaurant.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <span className="font-medium">
                      {restaurant.name}
                    </span>
                  </div>
                  <span className="text-gray-500">
                    {restaurant.email} | {restaurant.phone}
                  </span>
                  <span
                    className={`font-semibold ${
                      restaurant.isBlocked
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {restaurant.isBlocked
                      ? `Blocked`
                      : ""}
                  </span>
                </div>

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
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 active:scale-95"
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(restaurant._id, "unblock");
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95"
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

              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-4 bg-gray-50 border-t rounded-b-xl space-y-2 text-sm">
                  <h3 className="font-semibold text-gray-700">
                    Restaurant Details
                  </h3>
                  <p><strong>ID:</strong> {restaurant.restaurantId}</p>
                  <p><strong>Name:</strong> {restaurant.name}</p>
                  <p><strong>Email:</strong> {restaurant.email}</p>
                  <p><strong>Phone:</strong> {restaurant.phone}</p>
                  <p><strong>Address:</strong> {restaurant.address}</p>
                  <p>
                    <strong>Categories:</strong>{" "}
                    {restaurant.categories?.join(", ")}
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
              setBlockModal({ open: false, restaurantId: null, reason: "" })
            }
          />
          <div className="relative bg-white p-6 rounded-2xl w-96 shadow-lg space-y-4">
            <h2 className="text-lg font-semibold">Block Restaurant</h2>

            <textarea
              value={blockModal.reason}
              onChange={(e) =>
                setBlockModal((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
              placeholder="Reason for blocking"
              className="w-full p-3 border rounded-lg"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setBlockModal({ open: false, restaurantId: null, reason: "" })
                }
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  updateStatus(blockModal.restaurantId, "block")
                }
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
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
