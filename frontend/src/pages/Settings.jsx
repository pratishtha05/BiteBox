import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Upload } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const SERVER_URL = "http://localhost:3000/api/v1";

const TABS = ["Account Settings", "Delete Account"];

const Settings = () => {
  const { role, token } = useAuth();

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); 

  const [message, setMessage] = useState({ text: "", type: "" });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    image: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const originalForm = useRef(form);

  const showMessage = (text, type = "success", duration = 4000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), duration);
  };

  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${SERVER_URL}/${role}/me`,
          authHeaders
        );

        const profile = {
          name: res.data.data.name || "",
          email: res.data.data.email || "",
          phone: res.data.data.phone || "",
          gender: res.data.data.gender || "",
          address: res.data.data.address || "",
          image: res.data.data.image || "",
        };

        setForm(profile);
        originalForm.current = profile;
      } catch (err) {
        console.error("Fetch profile failed:", err);
        showMessage("Failed to fetch profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [role, token]);

  // Update profile
  const handleUpdateProfile = async () => {
  if (submitting) return;

  try {
    setSubmitting(true);
    const formData = new FormData();
    
    // Add text fields
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("gender", form.gender);
    if (form.address) formData.append("address", form.address);

    // Add the file if the user picked one
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    const res = await axios.put(
      `${SERVER_URL}/${role}/update`,
      formData,
      {
        ...authHeaders,
        headers: {
          ...authHeaders.headers,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const updatedData = res.data.data;
    setForm(updatedData);
    originalForm.current = updatedData;
    setSelectedFile(null); // Clear the file state
    setPreviewUrl(null);   // Clear the preview URL
    showMessage("Profile updated successfully");
  } catch (err) {
    console.error(err);
    showMessage("Update failed", "error");
  } finally {
    setSubmitting(false);
  }
};

  // Upload image
 const handleImageChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setSelectedFile(file);
  
  // Create a temporary URL for the preview image
  const objectUrl = URL.createObjectURL(file);
  setPreviewUrl(objectUrl);

  // We set this so the isFormChanged logic detects a change
  setForm((prev) => ({ ...prev, hasNewImage: true })); 
};  

  // Change password
  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      return showMessage("Passwords do not match", "error");
    }

    try {
      setSubmitting(true);
      await axios.put(
        `${SERVER_URL}/${role}/change-password`,
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        authHeaders
      );

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      showMessage("Password updated successfully");
    } catch (err) {
      console.error("Password change failed:", err);
      showMessage("Password update failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    const password = prompt("Please enter your password to confirm:");
    if (!password || submitting) return;

    try {
      setSubmitting(true);
      await axios.delete(`${SERVER_URL}/${role}/delete`, {
        ...authHeaders,
        data: { password },
      });

      showMessage("Account deleted successfully");
    } catch (err) {
      console.error("Delete account failed:", err);
      showMessage("Delete account failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  const isFormChanged = 
  JSON.stringify(form) !== JSON.stringify(originalForm.current) || 
  selectedFile !== null;

  const profileImage = previewUrl 
  ? previewUrl  // Show the newly picked image first
  : form.image 
    ? (form.image.startsWith("http") ? form.image : `${form.image}`)
    : null;

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      {/* Message */}
      {message.text && (
        <div
          className={`p-4 rounded-md text-center font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 relative font-medium transition ${
              activeTab === tab
                ? "text-amber-600"
                : "text-gray-500 hover:text-amber-500"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ACCOUNT SETTINGS */}
      {activeTab === "Account Settings" && (
        <div className="flex flex-col gap-6">
          {/* Profile Image */}
          <div className="flex items-center gap-4">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-amber-400"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-amber-400">
                <span className="text-xl font-bold text-gray-500">
                  {form.name?.charAt(0) || "U"}
                </span>
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer text-amber-600 hover:underline">
              <Upload size={18} />
              Change Profile Picture
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Profile Form */}
          <div className="grid sm:grid-cols-2 gap-4">
            {["name", "email", "phone"].map((field) => (
              <input
                key={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
                className="p-3 border rounded-lg focus:ring-2 focus:ring-amber-400"
              />
            ))}

            {(role === "admin" || role === "user") && (
              <select
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value })
                }
                className="p-3 border rounded-lg focus:ring-2 focus:ring-amber-400"
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
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                className="sm:col-span-2 p-3 border rounded-lg focus:ring-2 focus:ring-amber-400"
              />
            )}
          </div>

          {/* Password Section */}
          <div className="border rounded-lg p-6 bg-gray-50 flex flex-col gap-4">
            <input
              type="password"
              placeholder="Current Password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  currentPassword: e.target.value,
                })
              }
              className="p-3 border rounded-lg"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    newPassword: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <input
              type="password"
              placeholder="Confirm Password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  confirmPassword: e.target.value,
                })
              }
              className="p-3 border rounded-lg"
            />

            <button
              onClick={handleChangePassword}
              className="bg-amber-500 text-white py-3 rounded-lg hover:bg-amber-600"
            >
              Change Password
            </button>
          </div>

          <button
            onClick={handleUpdateProfile}
            disabled={!isFormChanged || submitting}
            className={`py-3 rounded-lg text-white font-medium ${
              isFormChanged
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Update Changes
          </button>
        </div>
      )}

      {/* DELETE ACCOUNT */}
      {activeTab === "Delete Account" && (
        <div className="border border-red-200 bg-red-50 rounded-lg p-6">
          <p className="font-medium text-gray-700 mb-4">
            Warning: This action is irreversible.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
          >
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;
