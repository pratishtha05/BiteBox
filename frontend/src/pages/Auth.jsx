import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Store,
  Shield,
  ArrowLeft,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Auth = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [step, setStep] = useState("role");
  const [isSignup, setIsSignup] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

    try {
      // Build payload based on role
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

      if (isSignup) {
        if (formData.role === "admin") {
          setError("Admin cannot signup");
          return;
        }

        await signup(formData.role, payload);
      } else {
        await login(formData.role, payload);
      }

      // Role-based redirect
      if (formData.role === "admin")
        navigate("/admin/dashboard", { replace: true });
      else if (formData.role === "restaurant")
        navigate("/restaurant/dashboard", { replace: true });
      else navigate("/", { replace: true });
    } catch (err) {
      console.log(err.response?.data);
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          err.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all">
        {/* Step 1: Choose Role */}
        {step === "role" && (
          <>
            <h1 className="text-3xl font-semibold text-center mb-2">
              Welcome!
            </h1>
            <p className="text-center text-gray-500 mb-8">
              Choose how you want to continue
            </p>

            {/* options */}
            <div className="space-y-4">
              {[
                { role: "user", icon: <User />, label: "User" },
                {
                  role: "restaurant",
                  icon: <Store />,
                  label: "Restaurant Owner",
                },
                { role: "admin", icon: <Shield />, label: "Admin" },
              ].map(({ role, icon, label }) => (
                <button
                  key={role}
                  onClick={() => {
                    setFormData({ ...formData, role });
                    if (role === "admin") setIsSignup(false);
                    setStep("form");
                  }}
                  className="group w-full flex items-center justify-between px-5 py-4 border rounded-xl
                  hover:border-amber-500 hover:bg-amber-50 transition hover:cursor-pointer active:scale-95"
                >
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="group-hover:text-amber-500 transition">
                      {icon}
                    </span>
                    <span className="font-medium">{label}</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-amber-500">
                    →
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 2: Form */}
        {step === "form" && (
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* change role button */}
            <button
              type="button"
              onClick={() => setStep("role")}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-amber-600 hover:cursor-pointer hover:underline"
            >
              <ArrowLeft size={18} /> Change role
            </button>

            {/* Error Messages */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* heading */}
            <h2 className="text-2xl font-semibold text-center">
              {isSignup ? "Create Account" : "Login"}
            </h2>

            {/* Signup-only fields */}
            {isSignup && formData.role !== "admin" && (
              <>
                {formData.role === "user" && (
                  <>
                    <label className="text-sm font-medium">
                      Name <span className="text-amber-600">*</span>
                    </label>
                    <input
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full mt-1 px-4 py-2 border rounded-lg"
                      placeholder="enter your name"
                    />

                    <label className="text-sm font-medium">
                      Phone <span className="text-amber-600">*</span>
                    </label>
                    <input
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full mt-1 px-4 py-2 border rounded-lg"
                      placeholder="enter your phone number"
                    />

                    <label className="text-sm font-medium">
                      Gender <span className="text-amber-600">*</span>
                    </label>

                    <div className="relative">
                      <select
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full mt-1 px-4 pr-12 py-2 border rounded-lg appearance-none"
                      >
                        <option value="">-- Select Gender --</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>

                      {/* Lucide arrow */}
                      <ChevronDown
                        size={20}
                        className="pointer-events-none absolute right-4 top-7 -translate-y-1/2"
                      />
                    </div>
                  </>
                )}

                {formData.role === "restaurant" && (
                  <>
                    <label className="text-sm font-medium">
                      Restaurant ID <span className="text-amber-600">*</span>
                    </label>
                    <input
                      name="restaurantId"
                      required
                      value={formData.restaurantId}
                      onChange={handleChange}
                      className="w-full mt-1 px-4 py-2 border rounded-lg"
                    />
                    <label className="text-sm font-medium">
                      Name <span className="text-amber-600">*</span>
                    </label>
                    <input
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full mt-1 px-4 py-2 border rounded-lg"
                    />
                    <label className="text-sm font-medium">
                      Phone <span className="text-amber-600">*</span>
                    </label>
                    <input
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full mt-1 px-4 py-2 border rounded-lg"
                    />
                    <label className="text-sm font-medium">
                      Address <span className="text-amber-600">*</span>
                    </label>
                    <input
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full mt-1 px-4 py-2 border rounded-lg"
                    />
                  </>
                )}
              </>
            )}

            {/* Common fields */}
            <label className="text-sm font-medium">
              Email <span className="text-amber-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="email@example.com"
            />

            <label className="text-sm font-medium">
              Password <span className="text-amber-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg pr-10"
                placeholder="enter your password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-600 hover:cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-amber-500 text-white font-medium hover:cursor-pointer active:scale-95"
            >
              {loading
                ? "Please wait..."
                : isSignup
                ? "Create Account"
                : "Login"}
            </button>

            {formData.role !== "admin" && (
              <p className="text-center text-sm text-gray-600">
                {isSignup ? "Already have an account?" : "New here?"}
                <span
                  onClick={() => setIsSignup(!isSignup)}
                  className="ml-1 cursor-pointer text-amber-600 hover:underline"
                >
                  {isSignup ? "Login" : "Signup"}
                </span>
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
