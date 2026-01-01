// Contact.jsx
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

  // Auto-hide message after 4 seconds
  useEffect(() => {
    if (status.visible) {
      const timer = setTimeout(() => setStatus((prev) => ({ ...prev, visible: false })), 4000);
      return () => clearTimeout(timer);
    }
  }, [status.visible]);

  return (
    <div className="p-6 max-w-3xl mx-auto relative">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
      <p className="text-gray-700 mb-6">
        Questions, feedback, or suggestions? Fill out the form below and our team will respond promptly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          required
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your Message"
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none h-40"
          required
        />
        <button
          type="submit"
          disabled={status.loading}
          className="w-full bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-amber-600 transition"
        >
          {status.loading ? "Sending..." : "Send Message"}
        </button>
      </form>

      {/* Notification */}
      {status.visible && (
        <div
          className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
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
