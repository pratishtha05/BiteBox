import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Utensils } from "lucide-react";

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ---------------- FETCH CATEGORIES ----------------
  useEffect(() => {
    // Static list OR fetch from backend if you have one
    setCategories(["Indian", "Chinese", "Fast Food", "Cafe", "Bakery"]);
  }, []);

  // ---------------- FETCH RESTAURANTS ----------------
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);

        const url = selectedCategory
          ? `http://localhost:3000/public/restaurants?category=${selectedCategory}`
          : `http://localhost:3000/public/restaurants`;

        const res = await axios.get(url);
        setRestaurants(res.data.restaurants);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* ---------------- CATEGORIES ---------------- */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>

        <div className="flex justify-between gap-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex flex-col items-center px-4 py-3 rounded-xl min-w-25
                border transition cursor-pointer active:scale-95
                ${
                  selectedCategory === category
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-white shadow-sm mb-2">
                <Utensils className="text-amber-500" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {category}
              </span>
            </button>
          ))}
        </div>

        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="mt-3 text-sm text-amber-600 hover:underline hover:cursor-pointer"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* ---------------- RESTAURANTS ---------------- */}
      {loading ? (
        <p className="text-gray-500">Loading restaurants...</p>
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

export default Dashboard;
