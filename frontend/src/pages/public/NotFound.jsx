import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-amber-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Page not found
      </h2>
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist or has been removed.
      </p>

      <Link
        to="/"
        className="px-6 py-3 rounded-xl bg-amber-500 text-white font-medium 
        hover:bg-amber-600 transition"
        replace={true}
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
