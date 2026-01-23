import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, HelpCircle, Info } from "lucide-react";

const Options = [
  {
    title: "FAQs",
    description: "Find answers to common questions.",
    icon: HelpCircle,
    link: "/faqs",
  },
  {
    title: "Contact Support",
    description: "Send a message or feedback to our team.",
    icon: MessageSquare,
    link: "/contact",
  },
  {
    title: "About BiteBox",
    description: "Learn about our mission and team.",
    icon: Info,
    link: "/about",
  },
];

const Help = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Need Help?
        </h1>
        <p className="text-gray-700">
          Choose an option below to find answers or get in touch with our team.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Options.map(({ title, description, icon: Icon, link }) => (
          <Link
            key={title}
            to={link}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl 
            transition-transform hover:scale-[1.03] flex flex-col"
          >
            <Icon className="w-10 h-10 text-amber-500 mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h2>
            <p className="text-gray-600 text-sm">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Help;
