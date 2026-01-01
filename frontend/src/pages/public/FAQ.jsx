// FAQ.jsx
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  { question: "How do I place an order?", answer: "Select your favorite restaurant, add items to your cart, and complete checkout." },
  { question: "Can I track my delivery?", answer: "Yes! Track your order in real-time from your Orders page." },
  { question: "What payment methods are accepted?", answer: "Credit/Debit cards, UPI, and cash on delivery are all accepted." },
  { question: "How do I contact support?", answer: "Use the Contact page or click 'Need Help?' in the sidebar." },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white shadow-lg rounded-xl p-4 hover:shadow-xl transition">
            <button
              className="w-full flex justify-between items-center text-left font-semibold text-gray-900"
              onClick={() => toggle(idx)}
            >
              {faq.question}
              {openIndex === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {openIndex === idx && <p className="mt-2 text-gray-700">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
