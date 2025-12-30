import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const SearchResults = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const { search } = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(search).get("q");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:3000/public/search?q=${query}`
        );
        setRestaurants(res.data.restaurants);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search title */}
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Search results for{" "}
        <span className="text-amber-500">"{query}"</span>
      </h2>

      {/* ---------------- RESTAURANTS ---------------- */}
      {loading ? (
        <p className="text-gray-500">Searching restaurants...</p>
      ) : restaurants.length === 0 ? (
        <p className="text-gray-500">No restaurants found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              onClick={() => navigate(`/menu/${restaurant._id}`)}
              className="relative cursor-pointer rounded-2xl bg-white shadow-md overflow-hidden 
              transition-transform hover:scale-[1.01] hover:shadow-lg"
            >
              {/* Restaurant Image */}
              <img
                src={restaurant.image || "/placeholder-restaurant.jpg"}
                alt={restaurant.name}
                className="w-full h-40 object-cover"
              />

              {/* Category Badge */}
              {restaurant.categories?.[0] && (
                <span className="absolute top-3 right-3 text-xs px-3 py-1 rounded-full bg-amber-500 text-white font-semibold shadow-md">
                  {restaurant.categories[0]}
                </span>
              )}

              {/* Restaurant Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {restaurant.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
