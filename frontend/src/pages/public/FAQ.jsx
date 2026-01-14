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
    <div className="p-6">
      {/* Page Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-6">
        Frequently Asked Questions
      </h1>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className={`rounded-xl overflow-hidden transition-shadow ${
              openIndex === idx ? "shadow-xl border-amber-400 border" : "shadow-md hover:shadow-lg"
            } bg-white`}
          >
            <button
              className={`w-full flex justify-between items-center px-6 py-4 text-left font-medium text-gray-900 
                         focus:outline-none transition-colors hover:cursor-pointer ${
                           openIndex === idx ? "bg-amber-50" : "bg-white hover:bg-amber-50"
                         }`}
              onClick={() => toggle(idx)}
            >
              <span className={`${openIndex === idx ? "text-amber-700" : "text-gray-900"}`}>
                {faq.question}
              </span>
              {openIndex === idx ? (
                <ChevronUp className="w-5 h-5 text-amber-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            <div
              className={`px-6 overflow-hidden transition-all duration-300 ${
                openIndex === idx ? "max-h-40 py-2" : "max-h-0"
              }`}
            >
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
