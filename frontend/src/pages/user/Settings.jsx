import { useEffect, useRef, useState, useMemo } from "react";
import api from "../../utils/api";
import { Eye, EyeOff, User, Shield, Trash2, CheckCircle, AlertCircle, Camera, Edit3, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const { role, token } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [form, setForm] = useState({
    name: "", email: "", phone: "", gender: "", address: "", image: "",
  });

  const originalForm = useRef(form);
  const authHeaders = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/${role}/me`, authHeaders);
        setForm(res.data.data);
        originalForm.current = res.data.data;
      } catch (err) {
        showMessage("Connection error", "error");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProfile();
  }, [role, token, authHeaders]);

  const cancelEditing = () => {
    setForm(originalForm.current);
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsEditing(false);
  };

  const isFormChanged = JSON.stringify(form) !== JSON.stringify(originalForm.current) || selectedFile !== null;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* TOP HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500">Manage your account and preferences</p>
        </div>

        {activeTab === "profile" && (
          <button
            onClick={() => isEditing ? cancelEditing() : setIsEditing(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:cursor-pointer active:scale-95 ${
              isEditing 
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
                : "bg-amber-500 text-white shadow-md hover:bg-amber-600"
            }`}
          >
            {isEditing ? <><X size={16} /> Cancel</> : <><Edit3 size={16} /> Edit Profile</>}
          </button>
        )}
      </div>

      {/* NAVIGATION */}
      <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8 w-full md:w-fit">
        {[
          { id: 'profile', label: 'General', icon: User },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'danger', label: 'Privacy', icon: Trash2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setIsEditing(false); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:cursor-pointer active:scale-95 ${
              activeTab === tab.id 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT CARD */}
      <div className="bg-white border border-slate-200 rounded-4xl shadow-sm overflow-hidden transition-all">
        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="divide-y divide-slate-50">
            {/* Avatar Section */}
            <div className="p-8 flex flex-col sm:flex-row items-center gap-8 bg-slate-50/30">
              <div className="relative">
                <img 
                  src={previewUrl || form.image || `https://ui-avatars.com/api/?name=${form.name}&background=f3f4f6&color=94a3b8`}
                  className={`w-28 h-28 rounded-3xl object-cover ring-4 ring-white shadow-lg transition-all ${isEditing ? "opacity-80 brightness-75" : ""}`}
                  alt="Avatar"
                />
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center cursor-pointer active:scale-95 transition-transform">
                    <Camera size={28} className="text-white drop-shadow-md" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); }
                    }} />
                  </label>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-slate-900">{form.name || "User"}</h3>
                <p className="text-xs font-black text-amber-600 uppercase tracking-widest mt-1">{role} Account</p>
              </div>
            </div>

            {/* Fields Section */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {[
                { label: 'Display Name', key: 'name', type: 'text' },
                { label: 'Email Address', key: 'email', type: 'email' },
                { label: 'Phone Number', key: 'phone', type: 'text' },
              ].map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">{field.label}</label>
                  {isEditing ? (
                    <input 
                      type={field.type}
                      value={form[field.key]} 
                      onChange={(e) => setForm({...form, [field.key]: e.target.value})} 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-medium" 
                    />
                  ) : (
                    <p className="px-1 text-sm font-semibold text-slate-700">{form[field.key] || "—"}</p>
                  )}
                </div>
              ))}
              
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Gender</label>
                {isEditing ? (
                  <select 
                    value={form.gender} 
                    onChange={(e) => setForm({...form, gender: e.target.value})} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-amber-500 outline-none transition-all font-medium appearance-none"
                  >
                    <option value="">Not Specified</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                ) : (
                  <p className="px-1 text-sm font-semibold text-slate-700">{form.gender || "Not Specified"}</p>
                )}
              </div>
            </div>

            {/* Save Bar */}
            {isEditing && (
              <div className="px-8 py-5 bg-white border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-400 italic">You have unsaved changes</p>
                <button 
                  disabled={!isFormChanged || submitting}
                  className="px-8 py-3 bg-amber-500 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-amber-600 shadow-lg shadow-amber-100 disabled:opacity-40 hover:cursor-pointer active:scale-95 transition-all"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <div className="p-10 max-w-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Update Password</h3>
            <div className="space-y-4">
              <input type="password" placeholder="Current Password" className="w-full px-5 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-amber-500" />
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="New Password" className="w-full px-5 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-amber-500" />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:cursor-pointer">
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
              <button className="w-full py-4 bg-amber-500 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-amber-600 hover:cursor-pointer active:scale-95 transition-all shadow-lg shadow-amber-50">
                Update Password
              </button>
            </div>
          </div>
        )}

        {/* DANGER TAB */}
        {activeTab === "danger" && (
          <div className="p-10">
            <div className="p-8 border-2 border-dashed border-red-100 rounded-4xl bg-red-50/30 text-center space-y-4">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Trash2 size={28}/>
              </div>
              <h3 className="text-lg font-bold text-red-900">Delete Account Permanently</h3>
              <p className="text-sm text-red-600/70 max-w-xs mx-auto">This action cannot be undone. All your history, orders, and data will be lost forever.</p>
              <button className="px-10 py-4 bg-red-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-red-700 hover:cursor-pointer active:scale-95 transition-all">
                Terminate Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* GLOBAL MESSAGE */}
      {message.text && (
        <div className={`fixed bottom-8 right-8 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all animate-in slide-in-from-bottom-5 ${
          message.type === "success" ? "bg-white border-emerald-100 text-emerald-700" : "bg-white border-red-100 text-red-700"
        }`}>
          {message.type === "success" ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
          <span className="font-bold text-sm">{message.text}</span>
        </div>
      )}
    </div>
  );
};

export default Settings;