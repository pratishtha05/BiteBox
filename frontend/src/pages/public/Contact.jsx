import { useEffect, useState } from "react";
import axios from "axios";

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
        message: res.data.message,
        error: false,
        visible: true,
        loading: false,
      });

      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({
        message:
          err.response?.data?.message || "Submission failed. Try again.",
        error: true,
        visible: true,
        loading: false,
      });
    }
  };

  useEffect(() => {
    if (!status.visible) return;
    const timer = setTimeout(
      () => setStatus((prev) => ({ ...prev, visible: false })),
      4000
    );
    return () => clearTimeout(timer);
  }, [status.visible]);

  return (
    <div className="mt-5 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
          Get in Touch
        </h1>

        <p className="text-gray-600 mb-10 text-center">
          Questions, feedback, or suggestions? We'd love to hear from you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-4 border border-gray-300 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-amber-400
                       transition"
            required
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full p-4 border border-gray-300 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-amber-400
                       transition"
            required
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="w-full p-4 border border-gray-300 rounded-xl h-40 resize-none
                       focus:outline-none focus:ring-2 focus:ring-amber-400
                       transition"
            required
          />

          <button
            type="submit"
            disabled={status.loading}
            className="w-full bg-amber-500 text-white py-4 rounded-xl font-semibold
                       hover:bg-amber-600 cursor-pointer
                       active:scale-95 transition-transform duration-150
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status.loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      {status.visible && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl
                      text-white shadow-xl transition-all
                      ${
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
