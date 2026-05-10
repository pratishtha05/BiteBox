import React, { useEffect, useState, useRef } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import {
  Utensils, Soup, Pizza, CakeSlice, Coffee, Leaf, Fish, ShoppingBag,
  ChevronLeft, ChevronRight, Star, Clock, MapPin, Search
} from "lucide-react";

const categoryIcons = {
  "north indian": Soup, "south indian": Soup, "fast food": Pizza,
  chaat: ShoppingBag, chinese: Soup, "biryani and rice": Utensils,
  "desserts and sweets": CakeSlice, beverages: Coffee,
  salads: Leaf, seafood: Fish, thali: Utensils, default: Utensils,
};

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const categoryScrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/public/categories");
        setCategories(res.data.categories || []);
      } catch (err) { console.error(err); }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const url = selectedCategory
          ? `/public/restaurants?category=${encodeURIComponent(selectedCategory)}`
          : `/public/restaurants`;
        const res = await api.get(url);
        console.log("FULL RESPONSE:", res);
    console.log("DATA:", res.data);

    setRestaurants(res?.data?.data?.restaurants || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchRestaurants();
  }, [selectedCategory]);

  const getCategoryIcon = (name, size = 24) => {
    const Icon = categoryIcons[name?.toLowerCase()] || categoryIcons.default;
    return <Icon size={size} strokeWidth={1.8} />;
  };

  const scroll = (dir) => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen antialiased pr-4 pl-4">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories Section */}
        <div className="relative mb-12 group">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Popular Categories</h2>
            <div className="flex gap-1">
              <button onClick={() => scroll('left')} className="p-1.5 rounded-full border border-slate-200 hover:bg-white hover:shadow-md transition-all text-slate-600"><ChevronLeft size={18}/></button>
              <button onClick={() => scroll('right')} className="p-1.5 rounded-full border border-slate-200 hover:bg-white hover:shadow-md transition-all text-slate-600"><ChevronRight size={18}/></button>
            </div>
          </div>
          
          <div 
            ref={categoryScrollRef}
            className="flex gap-12 overflow-x-auto hide-scrollbar scroll-smooth py-2"
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(active ? null : cat.name)}
                  className="shrink-0 group flex flex-col items-center gap-2"
                >
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-4xl flex items-center justify-center transition-all duration-500 ${
                    active ? "bg-amber-500 text-white hover:cursor-pointer" : "bg-white border border-slate-100 text-slate-400 hover:text-amber-500 hover:border-amber-200 hover:cursor-pointer"
                  }`}>
                    {getCategoryIcon(cat.name, 32)}
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${active ? "text-amber-600" : "text-slate-500"}`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Restaurant Grid */}
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {selectedCategory ? `${selectedCategory.toUpperCase()} near you` : "Top Restaurants"}
          </h2>
          <span className="text-xs font-bold text-slate-400">{restaurants.length} places found</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(n => (
              <div key={n} className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {restaurants.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase())).map((restaurant) => (
              <div
                key={restaurant._id}
                onClick={() => navigate(`/menu/${restaurant._id}`)}
                className="group cursor-pointer bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1 shadow-sm"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={restaurant.image || `https://via.placeholder.com/400x300?text=${restaurant.name}`}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-black text-slate-900 mb-1 leading-tight group-hover:text-amber-600 transition-colors">
                    {restaurant.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && restaurants.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <Utensils size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No restaurants found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;