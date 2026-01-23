import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  MapPin,
  Star,
  Search,
  ArrowRight,
  Clock,
} from "lucide-react";

const SERVER_URL = "http://localhost:3000/api/v1";

const SearchResults = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { search } = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(search).get("q")?.trim();

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${SERVER_URL}/public/search`, {
          params: { q: query },
        });
        const data = res.data?.data || {};
        setRestaurants(data.restaurants || []);
        setFoods(data.foods || []);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  const Skeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="bg-slate-200 h-40 rounded-3xl w-full" />
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
    </div>
  );

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-slate-500 hover:text-amber-600 transition-colors font-semibold text-sm hover:cursor-pointer active:scale-95"
          >
            <ChevronLeft size={20} /> Back
          </button>
          <div className="w-10" /> {/* Spacer for symmetry */}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* NO RESULTS STATE */}
            {restaurants.length === 0 && foods.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                  <Search size={40} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  No matches for "{query}"
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Try checking for typos or use more general keywords.
                </p>
              </div>
            )}

            {/* Restaurant Results */}
            {restaurants.length > 0 && (
              <section className="mb-12 pr-2 pl-2">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                  Top Restaurants
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                  {restaurants.map((restaurant) => (
                    <div
                      key={restaurant._id}
                      onClick={() => navigate(`/menu/${restaurant._id}`)}
                      className="group cursor-pointer bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1 shadow-sm"
                    >
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        <img
                          src={
                            restaurant.image ||
                            `https://via.placeholder.com/400x300?text=${restaurant.name}`
                          }
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <Star
                            size={12}
                            className="fill-amber-500 text-amber-500"
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">
                            4.5
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-black text-slate-900 mb-1 leading-tight group-hover:text-amber-600 transition-colors">
                          {restaurant.name}
                        </h3>
                        <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>25-30 min</span>
                          </div>
                          <span className="w-1 h-1 bg-slate-200 rounded-full" />
                          <div className="flex items-center gap-1">
                            <MapPin size={12} />
                            <span className="truncate max-w-25">
                              {restaurant.address?.split(",")[0] || "Nearby"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Food Dish Results */}
            {foods.length > 0 && (
              <section>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                  Dishes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {foods.map((food) => (
                    <div
                      key={food._id}
                      onClick={() => navigate(`/menu/${food.restaurant._id}`)}
                      className="group flex items-center gap-4 bg-white p-3 rounded-3xl shadow-sm hover:-translate-y-1 hover:shadow-sm transition-all cursor-pointer"
                    >
                      <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-full h-full object-cover transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                          {food.name}
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mb-2">
                          From {food.restaurant?.name}
                        </p>
                        <div className="flex items-center text-[10px] font-black text-amber-500 uppercase tracking-widest">
                          View in Menu{" "}
                          <ArrowRight
                            size={12}
                            className="ml-1 group-hover:translate-x-1 transition-transform"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
