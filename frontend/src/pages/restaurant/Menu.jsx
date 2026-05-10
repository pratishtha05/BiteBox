import { useEffect, useState, useMemo } from "react";
import api from "../../utils/api";
import {
  Trash2,
  Edit,
  ImageIcon,
  Plus,
  X,
  Search,
  UtensilsCrossed,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const INITIAL_FORM_STATE = {
  name: "",
  price: "",
  description: "",
  category: "",
  image: null,
  isAvailable: true,
};

const Menu = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await api.get("/menu", authHeaders);
      setItems(res.data.data || []);
    } catch (err) {
      setError("Failed to sync menu with server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchMenu();
  }, [token]);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    setEditingId(null);
    setIsSidebarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === "image" && value instanceof File)
        formData.append("image", value);
      else if (key !== "image") formData.append(key, value);
    });

    try {
      if (editingId) {
        await api.put(`/menu/${editingId}`, formData, authHeaders);
      } else {
        await api.post("/menu/createMenuItem", formData, authHeaders);
      }

      resetForm();
      fetchMenu();
    } catch (err) {
      alert("Error saving item. Please check the fields.");
    }
  };

  const handleEdit = (item) => {
    setForm({ ...item, image: null });
    setEditingId(item._id);
    setIsSidebarOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/menu/${id}`, authHeaders);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert("Failed to delete menu item.");
    }
  };

  const toggleAvailability = async (item) => {
    try {
      setItems((prev) =>
        prev.map((i) =>
          i._id === item._id
            ? { ...i, isAvailable: !i.isAvailable }
            : i
        )
      );

      await api.put(
        `/menu/${item._id}`,
        { isAvailable: !item.isAvailable },
        authHeaders
      );
    } catch (err) {
      fetchMenu();
    }
  };

  if (loading)
    return (
      <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-64 bg-gray-100 rounded-3xl animate-pulse"
          />
        ))}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-4 md:p-8 overflow-x-hidden">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
        <div className="w-full lg:w-auto">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight break-words">
            MENU INVENTORY
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Update prices, availability, and menu items in real-time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search dishes..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-amber-600 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={20} />
            <span>Add Dish</span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <p className="text-red-600 text-sm font-medium break-words">
            {error}
          </p>
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-center px-4">
          <UtensilsCrossed size={64} className="mb-4 opacity-20" />

          <p className="text-lg sm:text-xl font-medium">
            No menu items found
          </p>
        </div>
      )}

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-8">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className={`group bg-white rounded-[2rem] sm:rounded-4xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${
              !item.isAvailable ? "opacity-75" : ""
            }`}
          >
            <div className="relative h-48 w-full overflow-hidden bg-gray-50">
              {!item.isAvailable && (
                <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                  <span className="bg-white text-gray-900 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-tighter">
                    Sold Out
                  </span>
                </div>
              )}

              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="text-gray-300" size={40} />
                </div>
              )}

              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2.5 bg-white/90 backdrop-blur shadow-lg rounded-xl hover:text-amber-600 active:scale-95"
                >
                  <Edit size={18} />
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2.5 bg-white/90 backdrop-blur shadow-lg rounded-xl hover:text-red-600 active:scale-95"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex justify-between items-start gap-3 mb-2">
                <h4 className="font-black text-gray-900 text-base sm:text-lg leading-tight uppercase tracking-tight break-words">
                  {item.name}
                </h4>

                <p className="shrink-0 font-mono font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg text-sm">
                  ₹{item.price}
                </p>
              </div>

              <p className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3 break-words">
                {item.category || "General"}
              </p>

              <p className="text-gray-500 text-sm line-clamp-2 mb-6 min-h-[40px] break-words">
                {item.description || "No description provided."}
              </p>

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-50">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${
                    item.isAvailable
                      ? "text-emerald-500"
                      : "text-gray-400"
                  }`}
                >
                  {item.isAvailable ? "Available" : "Unavailable"}
                </span>

                <button
                  onClick={() => toggleAvailability(item)}
                  className={`w-12 h-6 rounded-full relative transition-all shrink-0 ${
                    item.isAvailable ? "bg-emerald-500" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      item.isAvailable ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-over Form (Sidebar) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={resetForm}
          />

          <div className="relative w-full sm:max-w-md bg-white h-full shadow-2xl p-5 sm:p-8 overflow-y-auto animate-slide-in">
            <div className="flex justify-between items-center gap-4 mb-8">
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tighter break-words">
                {editingId ? "Edit Dish" : "Add New Dish"}
              </h3>

              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Dish Name
                </label>

                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    handleChange("name", e.target.value)
                  }
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none text-sm"
                  placeholder="e.g. Truffle Pasta"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Price (₹)
                  </label>

                  <input
                    required
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      handleChange("price", e.target.value)
                    }
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Category
                  </label>

                  <input
                    value={form.category}
                    onChange={(e) =>
                      handleChange("category", e.target.value)
                    }
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none text-sm"
                    placeholder="e.g. Mains"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Description
                </label>

                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    handleChange("description", e.target.value)
                  }
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none resize-none text-sm"
                  placeholder="What makes this dish special?"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Cover Image
                </label>

                <div className="relative group border-2 border-dashed border-gray-200 rounded-4xl p-6 sm:p-8 text-center hover:border-amber-500 transition-colors cursor-pointer overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleChange("image", e.target.files[0])
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  <ImageIcon className="mx-auto text-gray-300 mb-2 group-hover:text-amber-500 transition-colors" />

                  <p className="text-xs text-gray-400 font-bold break-all">
                    {form.image
                      ? form.image.name
                      : "Upload High-Res Photo"}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-5 rounded-4xl font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl shadow-gray-200 active:scale-[0.98] text-sm"
              >
                {editingId ? "Confirm Changes" : "Publish Dish"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;