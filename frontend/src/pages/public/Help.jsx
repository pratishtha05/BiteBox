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
    <div className="p-6 rounded-xl ">
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
        Need Help?
      </h1>
      <p className="text-gray-700 text-center mb-10">
        Choose one of the options below to quickly find answers or get in touch with our team.
      </p>

      {/* Help Sections */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sections.map((sec, idx) => (
          <Link
            key={idx}
            to={sec.link}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.03] transition-transform duration-200 flex flex-col items-start"
          >
            <sec.icon className="w-10 h-10 text-amber-500 mb-4" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{sec.title}</h2>
            <p className="text-gray-600 text-sm md:text-base">{sec.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Help;
