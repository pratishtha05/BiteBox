import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Utensils, Pizza, CakeSlice, Soup } from "lucide-react";

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/public/categories");
      setCategories(res.data.categories);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  fetchCategories();
}, []);


  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);

        const url = selectedCategory
          ? `http://localhost:3000/public/restaurants?category=${selectedCategory.replace(
              "-",
              " "
            )}`
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

  const getCategoryIcon = (categories = []) => {
    const primary = categories[0]?.toLowerCase();

    if (!primary) return <Utensils size={36} />;

    if (primary.includes("north indian")) return <Soup size={36} />;
    if (primary.includes("south indian")) return <Soup size={36} />;
    if (primary.includes("fast food")) return <Pizza size={36} />;
    if (primary.includes("bakery")) return <CakeSlice size={36} />;

    return <Utensils size={36} />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold mb-6 capitalize text-gray-800">
            Categories
          </h2>

          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-sm font-medium text-amber-600 hover:underline hover:cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center px-4 py-3 rounded-xl min-w-25
          border transition active:scale-95
          ${
            isActive
              ? "border-amber-500 bg-amber-50 hover:cursor-pointer active:scale-95"
              : "border-gray-200 bg-white hover:bg-gray-50 hover:cursor-pointer active:scale-95"
          }`}
              >
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-xl mb-2
            ${isActive ? "bg-amber-100" : "bg-white shadow-sm"}`}
                >
                  <Utensils
                    className={isActive ? "text-amber-600" : "text-amber-500"}
                  />
                </div>

                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-amber-700" : "text-gray-700"
                  }`}
                >
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

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
    
              <div className="h-40 bg-amber-50 overflow-hidden flex items-center justify-center">
                {restaurant.image ? (
                  <img
                    src={`http://localhost:3000${restaurant.image}`}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-white shadow flex items-center justify-center text-amber-500">
                    {getCategoryIcon(restaurant.categories)}
                  </div>
                )}
              </div>

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
