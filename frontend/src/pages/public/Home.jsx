import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Utensils,
  Soup,
  Pizza,
  CakeSlice,
  Coffee,
  Leaf,
  Fish,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const SERVER_URL = "http://localhost:3000/api/v1/public";

const categoryIcons = {
  "north indian": Soup,
  "south indian": Soup,
  "fast food": Pizza,
  chaat: ShoppingBag,
  chinese: Soup,
  "biryani and rice": Utensils,
  "desserts and sweets": CakeSlice,
  beverages: Coffee,
  salads: Leaf,
  seafood: Fish,
  thali: Utensils,
  default: Utensils,
};

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const categoryScrollRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/categories`);
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const url = selectedCategory
          ? `${SERVER_URL}/restaurants?category=${encodeURIComponent(
              selectedCategory,
            )}`
          : `${SERVER_URL}/restaurants`;

        const res = await axios.get(url);
        setRestaurants(res.data.data.restaurants || []);
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [selectedCategory]);

  // Get icon component for category
  const getCategoryIcon = (categoryName) => {
    const key = categoryName?.toLowerCase();
    const Icon = categoryIcons[key] || categoryIcons.default;
    return <Icon size={32} strokeWidth={1.8} />;
  };

  const scrollCategories = (direction) => {
    if (!categoryScrollRef.current) return;

    const scrollAmount = direction === "left" ? -300 : 300;

    categoryScrollRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const updateScrollButtons = () => {
    const el = categoryScrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    updateScrollButtons();

    const el = categoryScrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [categories]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Categories */}
      <section className="mb-10">
      
        <div className="relative p-2">
          {/* Categories */}
          <div
            ref={categoryScrollRef}
            className="flex gap-6 overflow-x-auto p-2 hide-scrollbar scroll-smooth"
          >
            {categories.map((category) => {
              const isActive = selectedCategory === category.name;

              return (
                <button
                  key={category.name}
                  onClick={() =>
                    setSelectedCategory(isActive ? null : category.name)
                  }
                  className="shrink-0 flex flex-col items-center gap-3 group"
                >
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 hover:cursor-pointer
              ${
                isActive
                  ? "bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-lg scale-105 "
                  : "bg-white border border-gray-100 text-amber-500 hover:shadow-md hover:scale-105"
              }
            `}
                  >
                    {getCategoryIcon(category.name)}
                  </div>

                  <span
                    className={`text-sm font-semibold transition-colors ${
                      isActive
                        ? "text-amber-600"
                        : "text-gray-600 group-hover:text-gray-900"
                    }`}
                  >
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Restaurants */}
      {loading ? (
        <p className="text-gray-500">Loading restaurants...</p>
      ) : restaurants.length === 0 ? (
        <p className="text-gray-500">No restaurants found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              onClick={() => navigate(`/menu/${restaurant._id}`)}
              className="relative cursor-pointer rounded-2xl bg-white shadow-md overflow-hidden transition-transform hover:scale-[1.01] hover:shadow-lg"
            >
              <div className="h-40 bg-amber-50 flex items-center justify-center overflow-hidden">
                {restaurant.image ? (
                  <img
                    src={`${restaurant.image}`}
                    alt={restaurant.name}
                    className="w-full h-full object-fill"
                    onError={(e) => (e.target.style.display = "none")}
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
