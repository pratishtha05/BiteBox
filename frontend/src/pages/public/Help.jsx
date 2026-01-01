// Help.jsx
import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, HelpCircle, Info } from "lucide-react";

const Help = () => {
  const sections = [
    { title: "FAQs", description: "Find answers to common questions.", icon: HelpCircle, link: "/faqs" },
    { title: "Contact Support", description: "Send a message or feedback to our team.", icon: MessageSquare, link: "/contact" },
    { title: "About BiteBox", description: "Learn about our mission and team.", icon: Info, link: "/about" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Need Help?</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {sections.map((sec, idx) => (
          <Link
            key={idx}
            to={sec.link}
            className="bg-white shadow-lg p-6 rounded-xl hover:scale-105 transition transform"
          >
            <sec.icon className="w-8 h-8 text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{sec.title}</h2>
            <p className="text-gray-700">{sec.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Help;
