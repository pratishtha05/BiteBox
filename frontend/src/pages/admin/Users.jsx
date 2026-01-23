import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, User } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const SERVER_URL = "http://localhost:3000/api/v1";

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
      const res = await axios.get(`${SERVER_URL}/admin/users`, authHeaders);
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

  /* =========================
     Block / Unblock
  ========================= */
  const handleBlockUnblock = async (userId, action) => {
    if (action === "block" && !blockModal.reason) {
      return showMessage("Please provide a reason", "error");
    }

    try {
      await axios.put(
        `${SERVER_URL}/admin/users/${userId}/${action}`,
        { reason: blockModal.reason },
        authHeaders,
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
      const res = await axios.get(
        `${SERVER_URL}/admin/users/${userId}/orders`,
        authHeaders,
      );
      console.log(res.data.data);
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
    return <p className="text-center py-10 text-gray-500">Loading users…</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Message */}
      {message.text && (
        <p
          className={`p-3 rounded-md text-center transition ${
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
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => setExpandedUser(isExpanded ? null : user._id)}
              >
                <div className="flex flex-col sm:flex-row sm:gap-6">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <span className="font-medium text-gray-900">{user.name}</span>
                  <span className="text-gray-500">{user.email}</span>
                  <span className="text-gray-500">{user.phone}</span>
                  <span className="text-gray-500">{user.gender}</span>
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

                <div className="flex items-center gap-4">
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
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 active:scale-95"
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBlockUnblock(user._id, "unblock");
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95"
                    >
                      Unblock
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOrders(user._id);
                    }}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 active:scale-95"
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
                <div className="p-4 bg-gray-50 border-t rounded-b-xl">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    User Details
                  </h3>

                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.phone}
                  </p>
                  <p>
                    <strong>Gender:</strong> {user.gender}
                  </p>
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
                        <ul className="list-disc pl-6 text-gray-600">
                          {ordersByUser[user._id].map((order) => (
                            <li key={order._id}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 backdrop-blur-sm"
            onClick={() =>
              setBlockModal({ open: false, userId: null, reason: "" })
            }
          />

          <div className="relative bg-white p-6 rounded-2xl w-96 shadow-lg z-10 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Block User</h2>

            <textarea
              placeholder="Reason for blocking"
              value={blockModal.reason}
              onChange={(e) =>
                setBlockModal((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-400"
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
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={() => handleBlockUnblock(blockModal.userId, "block")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
