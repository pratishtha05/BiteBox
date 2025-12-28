import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { isAuthenticated, role, token } = useAuth();

  const [activeTab, setActiveTab] = useState(role ? "Account Settings" : "Appearance");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const originalForm = useRef(form);

  // ----------------- Message State -----------------
  const [message, setMessage] = useState({ text: "", type: "" }); // type: "success" | "error"

  const showMessage = (text, type = "success", duration = 4000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), duration);
  };

  // ----------------- Fetch Profile -----------------
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/${role}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = {
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          gender: res.data.gender || "",
          address: res.data.address || "",
        };

        setForm(data);
        originalForm.current = data;
        setLoading(false);
      } catch (err) {
        showMessage("Failed to fetch profile", "error");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, role, token]);

  // ----------------- Update Profile -----------------
  const handleUpdateProfile = async () => {
    try {
      await axios.put(`http://localhost:3000/${role}/update`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage("Profile updated successfully", "success");
      originalForm.current = form;
    } catch (err) {
      showMessage("Profile update failed", "error");
    }
  };

  // ----------------- Change Password -----------------
  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      return showMessage("Passwords do not match", "error");
    }

    try {
      await axios.put(
        `http://localhost:3000/${role}/change-password`,
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage("Password updated successfully", "success");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showMessage("Password update failed", "error");
    }
  };

  // ----------------- Delete Account -----------------
  const handleDeleteAccount = async () => {
    const password = prompt("Please enter your password to confirm:");
    if (!password) return;

    try {
      await axios.delete(`http://localhost:3000/${role}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { password },
      });
      showMessage("Account deleted successfully", "success");
      // Optionally logout user here
    } catch (err) {
      showMessage("Delete account failed", "error");
    }
  };

  // ----------------- Tabs -----------------
  const tabs = !isAuthenticated ? ["Appearance"] : ["Account Settings", "Appearance", "Delete Account"];

  if (loading && isAuthenticated) return null;

  const isFormChanged = JSON.stringify(form) !== JSON.stringify(originalForm.current);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold">Settings</h1>

      {/* ---------------- MESSAGE ---------------- */}
      {message.text && (
        <p
          className={`p-3 rounded-md ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </p>
      )}

      {/* ---------------- TABS ---------------- */}
      <div className="flex gap-6 border-b text-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 relative cursor-pointer active:scale-95 ${
              activeTab === tab ? "text-amber-600 font-medium" : "text-gray-500"
            }`}
          >
            {tab}
            {activeTab === tab && <span className="absolute left-0 bottom-0 w-full h-0.5 bg-amber-500" />}
          </button>
        ))}
      </div>

      {/* ---------------- ACCOUNT SETTINGS ---------------- */}
      {activeTab === "Account Settings" && isAuthenticated && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="p-2.5 border rounded-md"
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="p-2.5 border rounded-md"
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="p-2.5 border rounded-md"
            />
            {(role === "admin" || role === "user") && (
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="p-2.5 border rounded-md"
              >
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            )}
            {role === "restaurant" && (
              <input
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="col-span-2 p-2.5 border rounded-md"
              />
            )}
          </div>

          {/* Change Password */}
          <div className="border p-4 rounded-lg space-y-3">
            <input
              type="password"
              placeholder="Current password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, currentPassword: e.target.value })
              }
              className="w-full p-2.5 border rounded-md"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                className="w-full p-2.5 border rounded-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <input
              type="password"
              placeholder="Confirm password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
              className="w-full p-2.5 border rounded-md"
            />
            <button
              onClick={handleChangePassword}
              className="bg-amber-500 text-white px-4 py-2 rounded-md cursor-pointer active:scale-95"
            >
              Change Password
            </button>
          </div>

          <button
            onClick={handleUpdateProfile}
            disabled={!isFormChanged}
            className={`bg-amber-500 text-white px-6 py-2 rounded-md cursor-pointer active:scale-95 ${
              !isFormChanged ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Update Changes
          </button>
        </div>
      )}

      {/* ---------------- APPEARANCE ---------------- */}
      {activeTab === "Appearance" && (
        <div className="space-y-4 max-w-md ">
          coming soon...
        </div>
      )}

      {/* ---------------- DELETE ACCOUNT ---------------- */}
      {activeTab === "Delete Account" && isAuthenticated && (
        <div className="border border-red-300 p-6 rounded-lg space-y-4">
          <p className="text-sm text-gray-600">
            This action is irreversible.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white px-6 py-2 rounded-md cursor-pointer active:scale-95"
          >
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;
