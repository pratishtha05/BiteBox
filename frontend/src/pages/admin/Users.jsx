import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Users = () => {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [selectedOrders, setSelectedOrders] = useState({});
  const [blockModal, setBlockModal] = useState({ open: false, userId: null, reason: "" });
  const [expandedUser, setExpandedUser] = useState(null);

  const showMessage = (text, type = "success", duration = 4000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), duration);
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      showMessage("Failed to fetch users", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockUnblockUser = async (userId, action = "block") => {
    let reason = blockModal.reason;
    if (action === "block" && !reason) return showMessage("Please provide a reason", "error");

    try {
      await axios.put(
        `http://localhost:3000/admin/users/${userId}/${action}`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage(`User ${action}ed successfully`);
      setBlockModal({ open: false, userId: null, reason: "" });
      fetchUsers();
    } catch (err) {
      showMessage(`Failed to ${action} user`, "error");
    }
  };

  const handleViewOrders = async (userId) => {
    if (selectedOrders[userId]) {
      setSelectedOrders((prev) => ({ ...prev, [userId]: null }));
      return;
    }

    try {
      const res = await axios.get(`http://localhost:3000/admin/users/${userId}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedOrders((prev) => ({ ...prev, [userId]: res.data }));
    } catch (err) {
      showMessage("Failed to fetch order history", "error");
    }
  };

  if (loading) return <p className="text-center py-10 text-gray-500">Loading users...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {message.text && (
        <p
          className={`p-3 rounded-md transition-all text-center ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="space-y-4">
        {users.map((user) => {
          const isExpanded = expandedUser === user._id;
          return (
            <div
              key={user._id}
              className={`bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-shadow duration-200`}
            >
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => setExpandedUser(isExpanded ? null : user._id)}
              >
                <div className="flex flex-col sm:flex-row sm:gap-6">
                  <span className="font-medium text-gray-900">{user.name}</span>
                  <span className="text-gray-500">{user.email}</span>
                  <span className="text-gray-500">{user.phone}</span>
                  <span className="text-gray-500">{user.gender}</span>
                  <span
                    className={`font-semibold ${
                      user.isBlocked ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {user.isBlocked ? `Blocked (${user.blockReason})` : "Active"}
                  </span>
                </div>

                <div className="flex items-center gap-4">
      
                  {!user.isBlocked ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBlockModal({ open: true, userId: user._id, reason: "" });
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors hover:cursor-pointer active:scale-95"
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBlockUnblockUser(user._id, "unblock");
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors hover:cursor-pointer active:scale-95"
                    >
                      Unblock
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewOrders(user._id);
                    }}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600 transition-colors hover:cursor-pointer active:scale-95"
                  >
                    {selectedOrders[user._id] ? "Hide Orders" : "View Orders"}
                  </button>

                  <ChevronDown
                    size={22}
                    className={`ml-2 text-gray-400 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-xl transition-all">
                  <h3 className="font-semibold text-gray-700 mb-2">User Details</h3>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone}</p>
                  <p><strong>Gender:</strong> {user.gender}</p>
                  <p><strong>Status:</strong> {user.isBlocked ? `Blocked (${user.blockReason})` : "Active"}</p>

                  {selectedOrders[user._id] && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2 text-gray-700">Order History</h4>
                      {selectedOrders[user._id].length === 0 ? (
                        <p className="text-gray-500">No orders found</p>
                      ) : (
                        <ul className="list-disc pl-6 text-gray-600">
                          {selectedOrders[user._id].map((order) => (
                            <li key={order._id}>
                              {order.items.map((i) => i.name).join(", ")} - ${order.total} -{" "}
                              {new Date(order.date).toLocaleString()}
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

      {blockModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
      
          <div
            className="absolute inset-0 bg-opacity-0 backdrop-blur-sm"
            onClick={() => setBlockModal({ open: false, userId: null, reason: "" })}
          ></div>

          <div className="relative bg-white p-6 rounded-2xl w-96 space-y-4 shadow-lg z-10">
            <h2 className="text-lg font-semibold text-gray-800">Block User</h2>
            <textarea
              placeholder="Reason for blocking"
              value={blockModal.reason}
              onChange={(e) =>
                setBlockModal({ ...blockModal, reason: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setBlockModal({ open: false, userId: null, reason: "" })}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors hover:cursor-pointer active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBlockUnblockUser(blockModal.userId, "block")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors hover:cursor-pointer active:scale-95"
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
