import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-10 overflow-x-hidden">
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-amber-500 mb-4 leading-none">
        404
      </h1>

      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3 leading-tight">
        Page not found
      </h2>

      <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md leading-relaxed">
        The page you're looking for
        doesn't exist or has been
        removed.
      </p>

      <Link
        to="/"
        className="px-5 sm:px-6 py-3 rounded-xl bg-amber-500 text-white text-sm sm:text-base font-medium hover:bg-amber-600 transition active:scale-95 whitespace-nowrap"
        replace={true}
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;