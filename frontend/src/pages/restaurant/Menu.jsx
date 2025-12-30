import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Menu = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });
  const [editingId, setEditingId] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchMenu = async () => {
    try {
      const res = await axios.get("http://localhost:3000/menu", { headers });
      setItems(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/menu/${editingId}`, form, {
          headers,
        });
      } else {
        await axios.post("http://localhost:3000/menu/createMenuItem", form, {
          headers,
        });
      }
      setForm({ name: "", price: "", description: "", category: "" });
      setEditingId(null);
      fetchMenu();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item._id);
  };

  const toggleAvailability = async (item) => {
    await axios.put(
      `http://localhost:3000/menu/${item._id}`,
      { isAvailable: !item.isAvailable },
      { headers }
    );
    fetchMenu();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/menu/${id}`, { headers });
    fetchMenu();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Menu</h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 items-end"
      >
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
          required
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
        />
        <button className="bg-amber-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-amber-600 hover:shadow-lg active:scale-95 transition-all">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* MENU LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className={`relative flex flex-col justify-between p-4 rounded-2xl shadow-md bg-white transition-transform hover:scale-[1.02] hover:shadow-xl ${
              item.isDeleted ? "opacity-50 bg-gray-50" : ""
            }`}
          >
            {/* Availability badge */}
            {item.isDeleted && (
              <span className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-semibold">
                Deleted
              </span>
            )}

            <div>
              <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
              <p className="text-gray-600 mt-1">₹{item.price}</p>
              <p className="text-gray-500 mt-1">{item.category}</p>
              {item.description && (
                <p className="text-gray-400 mt-1 text-sm">{item.description}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4 items-center">
              <button
                disabled={item.isDeleted}
                onClick={() => toggleAvailability(item)}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all ${
                  item.isDeleted
                    ? "cursor-not-allowed bg-gray-200"
                    : "hover:cursor-pointer"
                } ${item.isAvailable ? "bg-green-500" : "bg-gray-300"}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-all ${
                    item.isAvailable ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>

              <button
                disabled={item.isDeleted}
                onClick={() => handleEdit(item)}
                className={`p-2 rounded-full transition ${
                  item.isDeleted
                    ? "cursor-not-allowed opacity-40"
                    : "hover:bg-gray-100 hover:cursor-pointer active:scale-95"
                }`}
              >
                <Edit size={18} />
              </button>

              <button
                disabled={item.isDeleted}
                onClick={() => handleDelete(item._id)}
                className={`p-2 rounded-full transition ${
                  item.isDeleted
                    ? "cursor-not-allowed opacity-40"
                    : "hover:bg-gray-100 hover:cursor-pointer active:scale-95"
                }`}
              >
                <Trash2 size={18} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
