import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { role, token } = useAuth();

  const [activeTab, setActiveTab] = useState("Account Settings");
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
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text, type = "success", duration = 4000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), duration);
  };

  useEffect(() => {
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
        console.error(err);
        showMessage("Failed to fetch profile", "error");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [role, token]);

  const handleUpdateProfile = async () => {
    try {
      await axios.put(`http://localhost:3000/${role}/update`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage("Profile updated successfully", "success");
      originalForm.current = form;
    } catch (err) {
      console.error(err);
      showMessage("Profile update failed", "error");
    }
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword)
      return showMessage("Passwords do not match", "error");

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
      console.error(err);
      showMessage("Password update failed", "error");
    }
  };

  const handleDeleteAccount = async () => {
    const password = prompt("Please enter your password to confirm:");
    if (!password) return;

    try {
      await axios.delete(`http://localhost:3000/${role}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { password },
      });
      showMessage("Account deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showMessage("Delete account failed", "error");
    }
  };

  if (loading) return null;

  const isFormChanged = JSON.stringify(form) !== JSON.stringify(originalForm.current);
  const tabs = ["Account Settings", "Delete Account"];

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6 justify-center">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      {/* Message */}
      {message.text && (
        <div
          className={`p-4 rounded-md text-center font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 relative font-medium transition-colors hover:text-amber-500 cursor-pointer active:scale-95 ${
              activeTab === tab ? "text-amber-600" : "text-gray-500"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Account Settings */}
      {activeTab === "Account Settings" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
            {(role === "admin" || role === "user") && (
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
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
                className="col-span-1 sm:col-span-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
            )}
          </div>

          {/* Password Section */}
          <div className="border border-gray-200 rounded-lg p-6 flex flex-col gap-4 bg-gray-50">
            <input
              type="password"
              placeholder="Current Password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, currentPassword: e.target.value })
              }
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 cursor-pointer active:scale-95"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
            <button
              onClick={handleChangePassword}
              className="w-full bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600 cursor-pointer active:scale-95 transition"
            >
              Change Password
            </button>
          </div>

          {/* Update Profile Button */}
          <button
            onClick={handleUpdateProfile}
            disabled={!isFormChanged}
            className={`w-full py-3 rounded-lg font-medium text-white cursor-pointer active:scale-95 transition-colors ${
              isFormChanged
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Update Changes
          </button>
        </div>
      )}

      {/* Delete Account */}
      {activeTab === "Delete Account" && (
        <div className="border border-red-200 rounded-lg p-6 flex flex-col gap-4 bg-red-50">
          <p className="text-gray-700 font-medium">
            Warning: This action is irreversible.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 cursor-pointer active:scale-95 transition-colors"
          >
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;
