import { useEffect, useState } from "react";
import api from "../../utils/api";
import { ChevronDown, User } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Users = () => {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [expandedUser, setExpandedUser] = useState(null);
  const [ordersByUser, setOrdersByUser] = useState({});
  const [blockModal, setBlockModal] = useState({
    open: false,
    userId: null,
    reason: "",
  });

  const authHeaders = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  const showMessage = (text, type = "success", duration = 4000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), duration);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users", authHeaders);
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
      showMessage("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchUsers();
  }, [token]);

  const handleBlockUnblock = async (userId, action) => {
    if (action === "block" && !blockModal.reason) {
      return showMessage("Please provide a reason", "error");
    }

    try {
      await api.put(
        `/admin/users/${userId}/${action}`,
        { reason: blockModal.reason },
        authHeaders
      );

      showMessage(`User ${action}ed successfully`);
      setBlockModal({ open: false, userId: null, reason: "" });
      fetchUsers();
    } catch (err) {
      console.error(err);
      showMessage(`Failed to ${action} user`, "error");
    }
  };

  const toggleOrders = async (userId) => {
    if (ordersByUser[userId]) {
      setOrdersByUser((prev) => ({ ...prev, [userId]: null }));
      return;
    }

    try {
      const res = await api.get(`/admin/users/${userId}/orders`, authHeaders);

      setOrdersByUser((prev) => ({
        ...prev,
        [userId]: res.data.data || [],
      }));
    } catch (err) {
      console.error(err);
      showMessage("Failed to fetch order history", "error");
    }
  };

  if (loading) {
    return (
      <p className="text-center py-10 text-gray-500 px-4">
        Loading users…
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6">

      {/* Message */}
      {message.text && (
        <p
          className={`p-3 rounded-md text-center text-sm sm:text-base ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Users List */}
      <div className="space-y-4">
        {users.map((user) => {
          const isExpanded = expandedUser === user._id;

          return (
            <div
              key={user._id}
              className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition"
            >
              {/* Header */}
              <div
                className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3 p-4 cursor-pointer"
                onClick={() => setExpandedUser(isExpanded ? null : user._id)}
              >
                {/* Left Info */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-5 text-sm sm:text-base">
                  {/* Avatar */}
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center border">
                      <User className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                    </div>
                  )}

                  <span className="font-medium text-gray-900">
                    {user.name}
                  </span>

                  <span className="text-gray-500 break-all">
                    {user.email}
                  </span>

                  <span className="text-gray-500">
                    {user.phone}
                  </span>

                  <span className="text-gray-500">
                    {user.gender}
                  </span>

                  <span
                    className={`font-semibold ${
                      user.isBlocked ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {user.isBlocked
                      ? `Blocked (${user.blockReason})`
                      : "Active"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {!user.isBlocked ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBlockModal({
                          open: true,
                          userId: user._id,
                          reason: "",
                        });
                      }}
                      className="px-3 sm:px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 active:scale-95"
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBlockUnblock(user._id, "unblock");
                      }}
                      className="px-3 sm:px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95"
                    >
                      Unblock
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOrders(user._id);
                    }}
                    className="px-3 sm:px-4 py-2 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 active:scale-95"
                  >
                    {ordersByUser[user._id] ? "Hide Orders" : "View Orders"}
                  </button>

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
                <div className="p-4 bg-gray-50 border-t rounded-b-xl text-sm sm:text-base space-y-2">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    User Details
                  </h3>

                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone}</p>
                  <p><strong>Gender:</strong> {user.gender}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {user.isBlocked
                      ? `Blocked (${user.blockReason})`
                      : "Active"}
                  </p>

                  {ordersByUser[user._id] && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2 text-gray-700">
                        Order History
                      </h4>

                      {ordersByUser[user._id].length === 0 ? (
                        <p className="text-gray-500">No orders found</p>
                      ) : (
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                          {ordersByUser[user._id].map((order) => (
                            <li key={order._id} className="break-words">
                              {order.items.map((i) => i.name).join(", ")} - ₹
                              {order.totalAmount} -{" "}
                              {new Date(order.createdAt).toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Block Modal */}
      {blockModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
          <div
            className="absolute inset-0 backdrop-blur-sm"
            onClick={() =>
              setBlockModal({ open: false, userId: null, reason: "" })
            }
          />

          <div className="relative bg-white p-5 sm:p-6 rounded-2xl w-full max-w-sm sm:max-w-md shadow-lg space-y-4">
            <h2 className="text-base sm:text-lg font-semibold">
              Block User
            </h2>

            <textarea
              placeholder="Reason for blocking"
              value={blockModal.reason}
              onChange={(e) =>
                setBlockModal((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
              className="w-full p-3 border rounded-lg text-sm sm:text-base"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setBlockModal({
                    open: false,
                    userId: null,
                    reason: "",
                  })
                }
                className="px-3 sm:px-4 py-2 border rounded-lg text-sm active:scale-95"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  handleBlockUnblock(blockModal.userId, "block")
                }
                className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg text-sm active:scale-95"
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

export default Users;