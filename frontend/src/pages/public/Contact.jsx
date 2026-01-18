import React, { useState, useEffect } from "react";
import axios from "axios";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ message: "", error: false, visible: false, loading: false });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "", error: false, visible: false, loading: true });

    try {
      const res = await axios.post("http://localhost:3000/public/contact", form);
      setStatus({ message: res.data.message, error: false, visible: true, loading: false });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({
        message: err.response?.data?.message || "Submission failed. Try again.",
        error: true,
        visible: true,
        loading: false,
      });
    }
  };

  useEffect(() => {
    if (status.visible) {
      const timer = setTimeout(() => setStatus((prev) => ({ ...prev, visible: false })), 4000);
      return () => clearTimeout(timer);
    }
  }, [status.visible]);

  return (
    <div className="p-6 mt-10 max-w-4xl mx-auto bg-gray-50 rounded-xl ">
      
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
        Get in Touch
      </h1>
      <p className="text-gray-700 mb-8 text-center">
        Questions, feedback, or suggestions? Fill out the form below and our team will respond promptly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none shadow-sm transition"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none shadow-sm transition"
          required
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your Message"
          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none shadow-sm transition h-40 resize-none"
          required
        />
        <button
          type="submit"
          disabled={status.loading}
          className="w-full bg-amber-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-amber-600 transition shadow-md hover:cursor-pointer active:scale-95"
        >
          {status.loading ? "Sending..." : "Send Message"}
        </button>
      </form>

      {status.visible && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg text-white font-medium transition-all duration-300 z-50 ${
            status.error ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {status.message}
        </div>
      )}
    </div>
  );
};

export default Contact;
