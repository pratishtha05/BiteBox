import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit, ImageIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const initialFormState = {
  name: "",
  price: "",
  description: "",
  category: "",
  image: "",
  isAvailable: true,
};

const Menu = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialFormState);
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

    const payload = {
      name: form.name,
      price: Number(form.price),
      description: form.description,
      category: form.category,
      image: form.image,
      isAvailable: form.isAvailable,
    };

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:3000/menu/${editingId}`,
          payload,
          { headers }
        );
      } else {
        await axios.post(
          "http://localhost:3000/menu/createMenuItem",
          payload,
          { headers }
        );
      }

      setForm(initialFormState);
      setEditingId(null);
      fetchMenu();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      price: item.price,
      description: item.description || "",
      category: item.category || "",
      image: item.image || "",
      isAvailable: item.isAvailable,
    });
    setEditingId(item._id);
  };

  const toggleAvailability = async (item) => {
    try {
      await axios.put(
        `http://localhost:3000/menu/${item._id}`,
        { isAvailable: !item.isAvailable },
        { headers }
      );
      fetchMenu();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // Soft delete (isDeleted = true)
  const handleDelete = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/menu/${id}`,
        { isDeleted: true },
        { headers }
      );
      fetchMenu();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Manage Menu
      </h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-10 items-end"
      >
        <input
          placeholder="Item name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-3 rounded-lg"
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-3 rounded-lg"
          required
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-3 rounded-lg"
        />

        <input
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="border p-3 rounded-lg"
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-3 rounded-lg"
        />

        <button className="bg-amber-500 text-white py-3 px-6 rounded-lg hover:bg-amber-600 transition hover:cursor-pointer active:scale-95">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* MENU LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className={`relative p-4 rounded-2xl shadow-md bg-white ${
              item.isDeleted ? "opacity-50 bg-gray-50" : ""
            }`}
          >
            {item.isDeleted && (
              <span className="absolute top-3 right-3 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                Deleted
              </span>
            )}

            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="h-32 w-full object-cover rounded-lg mb-3"
              />
            ) : (
              <div className="h-32 flex items-center justify-center bg-gray-100 rounded-lg mb-3">
                <ImageIcon className="text-gray-400" />
              </div>
            )}

            <h4 className="text-lg font-semibold capitalize">
              {item.name}
            </h4>

            <p className="text-gray-600">₹{item.price}</p>
            <p className="text-sm text-gray-500">{item.category}</p>

            {item.description && (
              <p className="text-sm text-gray-400 mt-1">
                {item.description}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-4 items-center">
              <button
                disabled={item.isDeleted}
                onClick={() => toggleAvailability(item)}
                className={`relative inline-flex h-6 w-12 rounded-full ${
                  item.isAvailable ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 bg-white rounded-full transform transition ${
                    item.isAvailable ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>

              <button
                disabled={item.isDeleted}
                onClick={() => handleEdit(item)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Edit size={18} />
              </button>

              <button
                disabled={item.isDeleted}
                onClick={() => handleDelete(item._id)}
                className="p-2 rounded-full hover:bg-gray-100"
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
