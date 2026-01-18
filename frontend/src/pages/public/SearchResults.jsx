import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Utensils, Pizza, CakeSlice, Soup } from "lucide-react";

const SearchResults = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const { search } = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(search).get("q");

  const getCategoryIcon = (categories = []) => {
    const primary = categories[0]?.toLowerCase();

    if (!primary) return <Utensils size={36} />;
    if (primary.includes("north indian")) return <Soup size={36} />;
    if (primary.includes("south indian")) return <Soup size={36} />;
    if (primary.includes("fast food")) return <Pizza size={36} />;
    if (primary.includes("bakery")) return <CakeSlice size={36} />;

    return <Utensils size={36} />;
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:3000/public/search?q=${query}`
        );

        setRestaurants(res.data.restaurants || []);
        setFoods(res.data.foods || []);
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 text-gray-500">
        Searching results...
      </div>
    );
  }

  const noResults =
    restaurants.length === 0 &&
    foods.length === 0 &&
    categories.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-semibold text-gray-800">
          Search results for{" "}
          <span className="text-amber-500">"{query}"</span>
        </h2>

        <button
          onClick={() => navigate("/")}
          className="text-sm font-medium text-amber-600 hover:underline"
        >
          ← Back to main menu
        </button>
      </div>

      {noResults && (
        <p className="text-gray-500">No results found</p>
      )}

      {restaurants.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                onClick={() => navigate(`/menu/${restaurant._id}`)}
                className="relative cursor-pointer rounded-2xl bg-white shadow-md overflow-hidden 
                  transition-transform hover:scale-[1.01] hover:shadow-lg"
              >
                <div className="h-40 bg-amber-50 flex items-center justify-center">
                  {restaurant.image ? (
                    <img
                      src={`http://localhost:3000${restaurant.image}`}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-white shadow flex items-center justify-center text-amber-500">
                      {getCategoryIcon(restaurant.categories)}
                    </div>
                  )}
                </div>

                {restaurant.categories?.[0] && (
                  <span className="absolute top-3 right-3 text-xs px-3 py-1 rounded-full 
                    bg-amber-500 text-white font-semibold shadow-md"
                  >
                    {restaurant.categories[0]}
                  </span>
                )}

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {restaurant.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {foods.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {foods.map((food) => (
              <div
                key={food._id}
                onClick={() => navigate(`/menu/${food.restaurant._id}`)}
                className="flex items-center gap-4 bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-lg"
              >
                <img
                  src={`http://localhost:3000${food.image}`}
                  alt={food.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />

                <div>
                  <p className="font-semibold text-gray-800">
                    {food.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {food.restaurant.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;
