import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Minus,
} from "lucide-react";

const FAQS = [
  {
    id: "order",
    question: "How do I place an order?",
    answer:
      "Simply browse through our curated list of restaurants, add your desired items to the cart, and proceed to checkout. You'll receive a confirmation notification once the restaurant accepts.",
  },
  {
    id: "tracking",
    question:
      "Can I track my delivery in real-time?",
    answer:
      "Absolutely. Once your order status changes to 'Out for Delivery', you can view the live location of your partner directly from the tracking dashboard.",
  },
  {
    id: "payment",
    question:
      "Which payment methods are supported?",
    answer:
      "We support all major credit/debit cards, UPI (Google Pay, PhonePe), and secure net banking. Cash on delivery is also available for select locations.",
  },
  {
    id: "support",
    question:
      "How do I reach customer support?",
    answer:
      "Our support team is available 24/7. You can initiate a live chat through the 'Need Help?' button in your sidebar or visit our dedicated Contact page.",
  },
];

const FAQ = () => {
  const [openId, setOpenId] =
    useState(null);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 bg-white overflow-x-hidden">
      {/* HEADER */}
      <div className="text-center mb-8 sm:mb-10 space-y-4 px-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
          Common Questions
        </h1>

        <p className="text-slate-500 text-sm font-medium max-w-sm mx-auto leading-relaxed">
          Everything you need to know
          about our service and platform.
        </p>
      </div>

      <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
        {FAQS.map(
          ({ id, question, answer }) => {
            const isOpen = openId === id;

            return (
              <div
                key={id}
                className="group py-1 sm:py-2"
              >
                <button
                  onClick={() => toggle(id)}
                  className="w-full flex justify-between items-center gap-4 py-4 text-left focus:outline-none transition-all hover:cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-sm sm:text-base font-bold transition-colors duration-300 leading-relaxed ${
                      isOpen
                        ? "text-amber-600"
                        : "text-slate-800 group-hover:text-slate-500"
                    }`}
                  >
                    {question}
                  </span>

                  <div
                    className={`shrink-0 transition-transform duration-500 ${
                      isOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-5 h-5 text-amber-500" />
                    ) : (
                      <Plus className="w-5 h-5 text-slate-300 group-hover:text-slate-900" />
                    )}
                  </div>
                </button>

                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isOpen
                      ? "max-h-96 opacity-100 pb-6 sm:pb-8"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-slate-500 text-sm sm:text-[15px] leading-relaxed max-w-2xl pr-2">
                    {answer}
                  </p>
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* CALL TO ACTION */}
      <div className="mt-12 sm:mt-16 p-5 sm:p-8 bg-slate-50 rounded-[2rem] sm:rounded-4xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
        <div className="min-w-0">
          <h4 className="font-bold text-slate-900 text-base sm:text-lg">
            Still have questions?
          </h4>

          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            We're here to help you
            anytime.
          </p>
        </div>

        <Link
          to="/contact"
          className="w-full md:w-auto"
        >
          <button className="w-full md:w-auto px-6 sm:px-8 py-3 bg-slate-900 text-white rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-widest hover:bg-amber-600 transition-all active:scale-95 cursor-pointer whitespace-nowrap">
            Contact Support
          </button>
        </Link>
      </div>
    </section>
  );
};

export default FAQ;