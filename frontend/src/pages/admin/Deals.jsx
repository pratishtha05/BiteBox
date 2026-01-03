import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Pencil, Trash2, Plus, X, ChevronDown } from "lucide-react";

const Deals = () => {
  const { token } = useAuth();

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDeal, setExpandedDeal] = useState(null);
  const [editDeal, setEditDeal] = useState(null);

  const [message, setMessage] = useState({ text: "", type: "" });

  const [form, setForm] = useState({
    title: "",
    description: "",
    dealType: "today",
    image: "",
    validTill: "",
  });

  /* ---------------- MESSAGE ---------------- */
  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  /* ---------------- API ---------------- */
  const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: { Authorization: `Bearer ${token}` },
  });

  /* ---------------- FETCH DEALS ---------------- */
  const fetchDeals = async () => {
    try {
      const res = await api.get("/admin/deals");
      setDeals(res.data);
    } catch {
      showMessage("Failed to fetch deals", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  /* ---------------- CREATE ---------------- */
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/deals", form);
      showMessage("Deal created");
      setForm({
        title: "",
        description: "",
        dealType: "today",
        image: "",
        validTill: "",
      });
      fetchDeals();
    } catch {
      showMessage("Failed to create deal", "error");
    }
  };

  /* ---------------- UPDATE ---------------- */
  const handleUpdate = async () => {
    try {
      await api.put(`/admin/deals/${editDeal._id}`, editDeal);
      showMessage("Deal updated");
      setEditDeal(null);
      fetchDeals();
    } catch {
      showMessage("Failed to update deal", "error");
    }
  };

  /* ---------------- TOGGLE ACTIVE ---------------- */
  const toggleStatus = async (deal) => {
    try {
      await api.put(`/admin/deals/${deal._id}`, {
        isActive: !deal.isActive,
      });
      fetchDeals();
    } catch {
      showMessage("Failed to update status", "error");
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this deal?")) return;
    try {
      await api.delete(`/admin/deals/${id}`);
      showMessage("Deal deleted");
      fetchDeals();
    } catch {
      showMessage("Failed to delete deal", "error");
    }
  };

  if (loading) return <p className="text-center py-10 text-gray-500">Loading deals...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* ---------------- MESSAGE ---------------- */}
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

      {/* ---------------- CREATE DEAL ---------------- */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        <input
          placeholder="Title"
          required
          className="border p-3 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Description"
          className="border p-3 rounded"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <select
          className="border p-3 rounded"
          value={form.dealType}
          onChange={(e) => setForm({ ...form, dealType: e.target.value })}
        >
          <option value="today">Today</option>
          <option value="weekend">Weekend</option>
          <option value="festival">Festival</option>
          <option value="custom">Custom</option>
        </select>
        <input
          type="date"
          className="border p-3 rounded"
          value={form.validTill}
          onChange={(e) => setForm({ ...form, validTill: e.target.value })}
        />
        <button className="bg-amber-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-amber-600">
          <Plus size={18} /> Add
        </button>
      </form>

      {/* ---------------- DEAL LIST ---------------- */}
      <div className="space-y-4">
        {deals.map((deal) => {
          const expanded = expandedDeal === deal._id;
          return (
            <div
              key={deal._id}
              className="bg-white border rounded-xl shadow hover:shadow-lg transition"
            >
              <div
                onClick={() => setExpandedDeal(expanded ? null : deal._id)}
                className="flex justify-between items-center p-4 cursor-pointer"
              >
                <div className="space-y-1">
                  <h3 className="font-semibold">{deal.title}</h3>
                  <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700">
                    {deal.dealType}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-semibold ${
                      deal.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {deal.isActive ? "Active" : "Inactive"}
                  </span>

                  <ChevronDown
                    className={`transition-transform ${
                      expanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {expanded && (
                <div className="p-4 bg-gray-50 border-t rounded-b-xl space-y-3">
                  <p><strong>Description:</strong> {deal.description || "-"}</p>
                  <p><strong>Valid Till:</strong> {deal.validTill ? new Date(deal.validTill).toDateString() : "-"}</p>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setEditDeal(deal)}
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Pencil size={16} /> Edit
                    </button>

                    <button
                      onClick={() => toggleStatus(deal)}
                      className="flex items-center gap-1 text-amber-600 hover:underline"
                    >
                      {deal.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => handleDelete(deal._id)}
                      className="flex items-center gap-1 text-red-600 hover:underline"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ---------------- EDIT MODAL ---------------- */}
      {editDeal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative space-y-4">
            <button
              onClick={() => setEditDeal(null)}
              className="absolute top-4 right-4 text-gray-500"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold">Edit Deal</h2>

            <input
              className="border p-3 rounded w-full"
              value={editDeal.title}
              onChange={(e) =>
                setEditDeal({ ...editDeal, title: e.target.value })
              }
            />
            <input
              className="border p-3 rounded w-full"
              value={editDeal.description}
              onChange={(e) =>
                setEditDeal({ ...editDeal, description: e.target.value })
              }
            />
            <select
              className="border p-3 rounded w-full"
              value={editDeal.dealType}
              onChange={(e) =>
                setEditDeal({ ...editDeal, dealType: e.target.value })
              }
            >
              <option value="today">Today</option>
              <option value="weekend">Weekend</option>
              <option value="festival">Festival</option>
              <option value="custom">Custom</option>
            </select>

            <input
              type="date"
              className="border p-3 rounded w-full"
              value={editDeal.validTill?.split("T")[0] || ""}
              onChange={(e) =>
                setEditDeal({ ...editDeal, validTill: e.target.value })
              }
            />

            <button
              onClick={handleUpdate}
              className="w-full bg-amber-500 text-white py-2 rounded hover:bg-amber-600"
            >
              Update Deal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deals;
