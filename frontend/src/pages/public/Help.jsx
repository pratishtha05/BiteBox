import React from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  HelpCircle,
  Info,
} from "lucide-react";

const Options = [
  {
    title: "FAQs",
    description:
      "Find answers to common questions.",
    icon: HelpCircle,
    link: "/faqs",
  },
  {
    title: "Contact Support",
    description:
      "Send a message or feedback to our team.",
    icon: MessageSquare,
    link: "/contact",
  },
  {
    title: "About BiteBox",
    description:
      "Learn about our mission and team.",
    icon: Info,
    link: "/about",
  },
];

const Help = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 overflow-x-hidden">
      <header className="text-center mb-8 sm:mb-10 px-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
          Need Help?
        </h1>

        <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Choose an option below to find
          answers or get in touch with our
          team.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {Options.map(
          ({
            title,
            description,
            icon: Icon,
            link,
          }) => (
            <Link
              key={title}
              to={link}
              className="bg-white p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition-transform hover:scale-[1.03] flex flex-col min-h-[220px] sm:min-h-[240px]"
            >
              <Icon className="w-9 h-9 sm:w-10 sm:h-10 text-amber-500 mb-4 shrink-0" />

              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-snug">
                {title}
              </h2>

              <p className="text-gray-600 text-sm leading-relaxed">
                {description}
              </p>
            </Link>
          )
        )}
      </div>
    </section>
  );
};

export default Help;