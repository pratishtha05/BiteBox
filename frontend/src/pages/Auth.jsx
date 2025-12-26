import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Store, Shield, ArrowLeft } from "lucide-react";
import axios from "axios";

const BASE_URL = "http://localhost:3000/auth";

const Auth = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("role");
  const [isSignup, setIsSignup] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    restaurantId: "",
    address: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let payload = {};

    if (formData.role === "user") {
      payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        gender: formData.gender,
      };
    } else if (formData.role === "restaurant") {
      payload = {
        restaurantId: formData.restaurantId,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
      };
    } else if (formData.role === "admin") {
      payload = {
        email: formData.email,
        password: formData.password,
      };
    }

    try {
      let response;

      if (isSignup) {
        if (formData.role === "admin") {
          setError("Admin cannot signup");
          setLoading(false);
          return;
        }
        response = await axios.post(`${BASE_URL}/${formData.role}/signup`, payload);
      } else {
        response = await axios.post(`${BASE_URL}/${formData.role}/login`, payload);
      }

      const { token, role, user, restaurant, admin } = response.data;

      // Store token & role
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "user") localStorage.setItem("user", JSON.stringify(user));
      if (role === "restaurant")
        localStorage.setItem("restaurant", JSON.stringify(restaurant));
      if (role === "admin") localStorage.setItem("admin", JSON.stringify(admin));

      // Role-based redirect
      if (role === "admin") navigate("/admin/dashboard", { replace: true });
      else if (role === "restaurant") navigate("/restaurantDashboard", { replace: true });
      else navigate("/", { replace: true });

    } catch (err) {
      console.log(err.response);
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 to-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all">
        {/* Step 1: Choose Role */}
        {step === "role" && (
          <>
            <h1 className="text-3xl font-semibold text-center mb-2">Welcome</h1>
            <p className="text-center text-gray-500 mb-8">
              Choose how you want to continue
            </p>
            <div className="space-y-4">
              {[
                { role: "user", icon: <User />, label: "User" },
                { role: "restaurant", icon: <Store />, label: "Restaurant Owner" },
                { role: "admin", icon: <Shield />, label: "Admin" },
              ].map(({ role, icon, label }) => (
                <button
                  key={role}
                  onClick={() => {
                    setFormData({ ...formData, role });
                    setStep("form");
                  }}
                  className="group w-full flex items-center justify-between px-5 py-4 border rounded-xl
                  hover:border-amber-500 hover:bg-amber-50 transition"
                >
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="group-hover:text-amber-500 transition">{icon}</span>
                    <span className="font-medium">{label}</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-amber-500">→</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 2: Form */}
        {step === "form" && (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <button
              type="button"
              onClick={() => setStep("role")}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-amber-600"
            >
              <ArrowLeft size={16} /> Change role
            </button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <h2 className="text-2xl font-semibold text-center">
              {isSignup ? "Create Account" : "Login"}
            </h2>

            {/* Name field: only for signup and non-admin */}
            {isSignup && formData.role !== "admin" && (
              <div>
                <label className="text-sm font-medium">
                  Name <span className="text-amber-600">*</span>
                </label>
                <input
                  name="name"
                  placeholder="Full name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            {/* Role-specific fields */}
            {isSignup && formData.role === "user" && (
              <>
                <div>
                  <label className="text-sm font-medium">
                    Phone <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="number"
                    name="phone"
                    placeholder="9856471563"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Gender <span className="text-amber-600">*</span>
                  </label>
                  <select
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">--Select--</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </>
            )}

            {isSignup && formData.role === "restaurant" && (
              <>
                <div>
                  <label className="text-sm font-medium">
                    Restaurant ID <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="number"
                    name="restaurantId"
                    placeholder="2001"
                    required
                    value={formData.restaurantId}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Phone <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="number"
                    name="phone"
                    placeholder="9876543210"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Address <span className="text-amber-600">*</span>
                  </label>
                  <input
                    name="address"
                    placeholder="Street, City, State"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </>
            )}

            {/* Common fields */}
            <div>
              <label className="text-sm font-medium">
                Email <span className="text-amber-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Password <span className="text-amber-600">*</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-amber-500 text-white font-medium
              hover:bg-amber-600 transition"
            >
              {loading ? "Please wait..." : isSignup ? "Create Account" : "Login"}
            </button>

            <p className="text-center text-sm text-gray-600">
              {isSignup ? "Already have an account?" : "New here?"}
              <span
                onClick={() => setIsSignup(!isSignup)}
                className="ml-1 cursor-pointer text-amber-600 hover:underline"
              >
                {isSignup ? "Login" : "Signup"}
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
