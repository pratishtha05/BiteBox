import { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, AlertCircle } from "lucide-react";

const SERVER_URL = "http://localhost:3000/api/v1/public";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({
    message: "",
    error: false,
    visible: false,
    loading: false,
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "", error: false, visible: false, loading: true });

    try {
      const res = await axios.post(`${SERVER_URL}/contact`, form);
      setStatus({
        message: res.data.message || "Message sent successfully!",
        error: false,
        visible: true,
        loading: false,
      });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({
        message: err.response?.data?.message || "Something went wrong.",
        error: true,
        visible: true,
        loading: false,
      });
    }
  };

  useEffect(() => {
    if (!status.visible) return;
    const timer = setTimeout(() => setStatus((p) => ({ ...p, visible: false })), 4000);
    return () => clearTimeout(timer);
  }, [status.visible]);

  return (
    <div className=" bg-gray pt-10 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
            Let's Start a <span className="text-amber-500">Conversation</span>
          </h1>
          <p className="text-slate-500 font-small max-w-lg">
            Have a question or just want to say hi? We'd love to hear from you. 
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 items-start">
          
          {/* LEFT: INFO PANEL */}
          <div className="lg:col-span-4 space-y-10 pt-2">
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email Us</h4>
                <p className="text-sm font-bold text-slate-900">support@bitebox.com</p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Call Us</h4>
                <p className="text-sm font-bold text-slate-900">+91 7932561800</p>
              </div>
            </div>
          </div>

          {/* RIGHT: FORM PANEL */}
          <div className="lg:col-span-8 bg-gray-100 border border-slate-100 rounded-[2.5rem] md:p-12 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-amber-200 outline-none transition-all font-medium text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-amber-200 outline-none transition-all font-medium text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-amber-200 outline-none transition-all font-medium text-sm h-40 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-amber-600 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:cursor-pointer shadow-xl shadow-slate-100"
              >
                {status.loading ? "Processing..." : (
                  <>
                    Send Message <Send size={14} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --- TOAST NOTIFICATION --- */}
      {status.visible && (
        <div
          className={`fixed bottom-10 right-10 flex items-center gap-3 px-6 py-4 rounded-2xl text-white shadow-2xl animate-in slide-in-from-right-10 duration-500 ${
            status.error ? "bg-rose-500" : "bg-emerald-500"
          }`}
        >
          {status.error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span className="text-sm font-bold uppercase tracking-tight">{status.message}</span>
        </div>
      )}
    </div>
  );
};

export default Contact;