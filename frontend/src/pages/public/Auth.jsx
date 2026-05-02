import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Store,
  Shield,
  Truck,
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Lock
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

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
    image: null,
    phone: "",
    gender: "",
    restaurantId: "",
    address: "",
    categories: [],
  });

  const CATEGORY_OPTIONS = [
    { label: "North Indian", value: "north indian" },
    { label: "South Indian", value: "south indian" },
    { label: "Fast Food", value: "fast food" },
    { label: "Chinese", value: "chinese" },
    { label: "Desserts", value: "desserts and sweets" },
    { label: "Beverages", value: "beverages" },
  ];

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup && formData.role === "restaurant" && formData.categories.length === 0) {
        throw new Error("Please select at least one category");
      }

      let payload;
      if (isSignup) {
        if (formData.role === "restaurant") {
          payload = new FormData();
          payload.append("restaurantId", formData.restaurantId);
          payload.append("name", formData.name);
          payload.append("email", formData.email);
          payload.append("password", formData.password);
          payload.append("phone", formData.phone);
          payload.append("address", formData.address);
          formData.categories.forEach((cat) => payload.append("categories[]", cat));
          if (formData.image) payload.append("image", formData.image);
          await signup(formData.role, payload, { headers: { "Content-Type": "multipart/form-data" } });
          navigate("/restaurant/dashboard", { replace: true });
        } else {
          payload = { name: formData.name, email: formData.email, password: formData.password, phone: formData.phone, gender: formData.gender };
          await signup(formData.role, payload);
          navigate(formData.role === "delivery" ? "/delivery/dashboard" : "/", { replace: true });
        }
      } else {
        payload = { email: formData.email, password: formData.password };
        await login(formData.role, payload);
        const paths = { admin: "/admin/dashboard", restaurant: "/restaurant/dashboard", delivery: "/delivery/dashboard" };
        navigate(paths[formData.role] || "/", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 antialiased text-slate-900">
      {/* back to home button */}
      <div className="absolute top-30 left-60">
        <Link
            type="button"
            to="/"
            className="inline-flex items-center gap-2 text-sm hover:cursor-pointer font-bold uppercase tracking-wider text-slate-400 hover:text-amber-500 transition-colors mb-6"
          >
            <ArrowLeft size={14} /> Back To Home
          </Link>
      </div>
      
      {/* Step 1: Role Selection */}
      {step === "role" && (
        <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
          <h1 className="text-2xl md:text-3xl font-bold mb-10 tracking-tight text-slate-800">
            Who's using BiteBox?
          </h1>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {[
              { role: "user", label: "Customer", icon: <User size={32}/> },
              { role: "restaurant", label: "Owner", icon: <Store size={32}/> },
              { role: "delivery", label: "Partner", icon: <Truck size={32}/> },
              { role: "admin", label: "Admin", icon: <Shield size={32}/> },
            ].map((profile) => (
              <button
                key={profile.role}
                onClick={() => {
                  setFormData({ ...formData, role: profile.role });
                  setIsSignup(false);
                  setStep("form");
                }}
                className="group flex flex-col items-center gap-3 hover:cursor-pointer active:scale-95"
              >
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-slate-100 group-hover:border-amber-500 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center text-slate-400 group-hover:text-amber-500 bg-slate-50 group-hover:bg-amber-50">
                  {profile.icon}
                </div>
                <span className="text-slate-400 group-hover:text-amber-600 text-sm font-semibold transition-colors">
                  {profile.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- STEP 2: REFINED AUTH FORM --- */}
      {step === "form" && (
        <div className="w-full max-w-md bg-white shadow-2xl rounded-4xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            type="button"
            onClick={() => setStep("role")}
            className="inline-flex items-center gap-2 text-sm hover:cursor-pointer font-bold uppercase tracking-wider text-slate-400 hover:text-amber-500 transition-colors mb-6"
          >
            <ArrowLeft size={14} /> Back
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Minimal Toggle Switch */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
              {["Login", "Register"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setIsSignup(mode === "Register")}
                  className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all hover:cursor-pointer ${
                    (isSignup ? "Register" : "Login") === mode
                      ? "bg-white text-amber-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[11px] font-bold text-center">
                {error}
              </div>
            )}

            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1 custom-scrollbar">
              {isSignup && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Name</label>
                    <input name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg focus:border-amber-500 outline-none text-sm transition-all" />
                  </div>
                  
                  {formData.role === "restaurant" && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Restaurant ID</label>
                      <input name="restaurantId" required value={formData.restaurantId} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg focus:border-amber-500 outline-none text-sm transition-all" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone</label>
                    <input name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg focus:border-amber-500 outline-none text-sm transition-all" />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg focus:border-amber-500 outline-none text-sm transition-all" placeholder="email@example.com" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-100 rounded-lg focus:border-amber-500 outline-none text-sm transition-all" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-amber-500 hover:cursor-pointer">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {isSignup && formData.role === "restaurant" && (
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Categories</label>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {CATEGORY_OPTIONS.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => {
                          const exists = formData.categories.includes(cat.value);
                          setFormData({...formData, categories: exists ? formData.categories.filter(c => c !== cat.value) : [...formData.categories, cat.value]});
                        }}
                        className={`px-3 py-1 rounded-md text-sm font-bold border transition-all hover:cursor-pointer active:scale-95 ${formData.categories.includes(cat.value) ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-400 border-slate-100 hover:border-amber-200'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-500 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-amber-600 hover:cursor-pointer transition-all active:scale-95 disabled:opacity-50 mt-4"
            >
              {loading ? "Processing..." : isSignup ? "Create Account" : "Sign In"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Auth;