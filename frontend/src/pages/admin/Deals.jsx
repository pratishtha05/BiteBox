import { useEffect, useMemo, useState } from "react";
import api from "../../utils/api";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const initialFormState = {
  title: "",
  description: "",
  validTill: "",
  image: null,
};

const Deals = () => {
  const { token } = useAuth();

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingDeal, setEditingDeal] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [form, setForm] = useState(initialFormState);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [message, setMessage] = useState({ text: "", type: "" });

  const api = useMemo(
    () =>
      api.create({
        headers: { Authorization: `Bearer ${token}` },
      }),
    [token]
  );

  /* ---------------- UTIL ---------------- */
  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  /* ---------------- FETCH ---------------- */
  const fetchDeals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/deals");
      setDeals(res.data.data || []);
    } catch {
      showMessage("Failed to fetch deals", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [api]);

  /* ---------------- CLEANUP PREVIEW ---------------- */
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  /* ---------------- FILE CHANGE ---------------- */
  const handleFileChange = (e, isEditing = false) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isEditing) {
      setEditingDeal((prev) => ({ ...prev, newImage: file }));
    } else {
      setForm((prev) => ({ ...prev, image: file }));
    }

    setPreviewUrl(URL.createObjectURL(file));
  };

  /* ---------------- CREATE ---------------- */
  const handleCreate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("validTill", form.validTill);
      if (form.image) formData.append("image", form.image);

      await api.post("/admin/deals", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showMessage("Deal created successfully");
      setForm(initialFormState);
      setPreviewUrl(null);
      setShowCreateModal(false);
      fetchDeals();
    } catch {
      showMessage("Failed to create deal", "error");
    }
  };

  /* ---------------- UPDATE ---------------- */
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", editingDeal.title);
      formData.append("description", editingDeal.description);
      formData.append("validTill", editingDeal.validTill);
      if (editingDeal.newImage) formData.append("image", editingDeal.newImage);

      await api.put(`/admin/deals/${editingDeal._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showMessage("Deal updated successfully");
      setEditingDeal(null);
      setPreviewUrl(null);
      fetchDeals();
    } catch {
      showMessage("Failed to update deal", "error");
    }
  };

  /* ---------------- STATUS ---------------- */
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Deals Management
        </h1>

        <button
          onClick={() => {
            setPreviewUrl(null);
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 bg-amber-500 text-white px-5 py-3 rounded-xl hover:bg-amber-600 transition cursor-pointer active:scale-95"
        >
          <Plus size={18} /> Add Deal
        </button>
      </div>

      {/* MESSAGE */}
      {message.text && (
        <div
          className={`px-4 py-3 rounded-xl text-center font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {deals.map((deal) => (
          <div
            key={deal._id}
            className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col"
          >
            {/* IMAGE */}
            <div className="h-48 bg-gray-100 relative">
              {deal.image ? (
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon size={48} />
                </div>
              )}

              <span
                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                  deal.isActive
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {deal.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* CONTENT */}
            <div className="p-5 flex-1 space-y-2">
              <h3 className="font-bold text-xl">{deal.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {deal.description}
              </p>

              <p className="text-xs text-amber-600 font-medium">
                Valid Till:{" "}
                {deal.validTill
                  ? new Date(deal.validTill).toDateString()
                  : "Unlimited"}
              </p>

              <div className="flex gap-4 pt-4 border-t">
                <button
                  onClick={() => {
                    setEditingDeal(deal);
                    setPreviewUrl(null);
                  }}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm cursor-pointer active:scale-95"
                >
                  <Pencil size={14} /> Edit
                </button>

                <button
                  onClick={() => toggleStatus(deal)}
                  className="text-amber-600 hover:text-amber-800 text-sm cursor-pointer active:scale-95"
                >
                  {deal.isActive ? "Deactivate" : "Activate"}
                </button>

                <button
                  onClick={() => handleDelete(deal._id)}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm ml-auto cursor-pointer active:scale-95"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {(showCreateModal || editingDeal) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative space-y-4">
            <button
              onClick={() => {
                setShowCreateModal(false);
                setEditingDeal(null);
                setPreviewUrl(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold">
              {editingDeal ? "Edit Deal" : "Create New Deal"}
            </h2>

            {/* IMAGE UPLOAD */}
            <div className="flex flex-col items-center gap-2 border-2 border-dashed rounded-xl p-4 bg-gray-50">
              {previewUrl || editingDeal?.image ? (
                <img
                  src={previewUrl || editingDeal.image}
                  className="h-32 w-full object-cover rounded-lg"
                  alt="Preview"
                />
              ) : (
                <ImageIcon size={40} className="text-gray-300" />
              )}

              <label className="text-amber-600 text-sm font-medium cursor-pointer hover:underline flex items-center gap-2">
                <Upload size={16} />
                {editingDeal ? "Change Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleFileChange(e, Boolean(editingDeal))
                  }
                />
              </label>
            </div>

            <input
              placeholder="Title"
              className="border rounded-xl px-4 py-3 w-full"
              value={editingDeal ? editingDeal.title : form.title}
              onChange={(e) =>
                editingDeal
                  ? setEditingDeal({
                      ...editingDeal,
                      title: e.target.value,
                    })
                  : setForm({ ...form, title: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              rows="3"
              className="border rounded-xl px-4 py-3 w-full"
              value={
                editingDeal ? editingDeal.description : form.description
              }
              onChange={(e) =>
                editingDeal
                  ? setEditingDeal({
                      ...editingDeal,
                      description: e.target.value,
                    })
                  : setForm({
                      ...form,
                      description: e.target.value,
                    })
              }
            />

            <input
              type="date"
              className="border rounded-xl px-4 py-3 w-full"
              value={
                editingDeal
                  ? editingDeal.validTill?.split("T")[0] || ""
                  : form.validTill
              }
              onChange={(e) =>
                editingDeal
                  ? setEditingDeal({
                      ...editingDeal,
                      validTill: e.target.value,
                    })
                  : setForm({
                      ...form,
                      validTill: e.target.value,
                    })
              }
            />

            <button
              onClick={editingDeal ? handleUpdate : handleCreate}
              className="w-full bg-amber-500 text-white py-3 rounded-xl hover:bg-amber-600 transition font-bold cursor-pointer active:scale-95"
            >
              {editingDeal ? "Update Deal" : "Save Deal"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deals;
