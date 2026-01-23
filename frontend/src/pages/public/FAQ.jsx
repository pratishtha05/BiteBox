import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    id: "order",
    question: "How do I place an order?",
    answer:
      "Select your favorite restaurant, add items to your cart, and complete checkout.",
  },
  {
    id: "tracking",
    question: "Can I track my delivery?",
    answer:
      "Yes! Track your order in real-time from your Orders page.",
  },
  {
    id: "payment",
    question: "What payment methods are accepted?",
    answer:
      "Credit/Debit cards, UPI, and cash on delivery are all accepted.",
  },
  {
    id: "support",
    question: "How do I contact support?",
    answer:
      "Use the Contact page or click 'Need Help?' in the sidebar.",
  },
];

const FAQ = () => {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
        Frequently Asked Questions
      </h1>

      <div className="space-y-4">
        {FAQS.map(({ id, question, answer }) => {
          const isOpen = openId === id;

          return (
            <div
              key={id}
              className={`rounded-xl bg-white overflow-hidden transition-shadow
              ${isOpen ? "border border-amber-400 shadow-xl" : "shadow-md hover:shadow-lg"}`}
            >
              <button
                onClick={() => toggle(id)}
                className={`w-full flex justify-between items-center px-6 py-4 text-left 
                font-medium focus:outline-none transition-colors hover:cursor-pointer
                ${isOpen ? "bg-amber-50 text-amber-700" : "hover:bg-amber-50"}`}
                aria-expanded={isOpen}
              >
                <span>{question}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-amber-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              <div
                className={`px-6 transition-all duration-300 overflow-hidden
                ${isOpen ? "max-h-40 py-2" : "max-h-0"}`}
              >
                <p className="text-gray-700">{answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
