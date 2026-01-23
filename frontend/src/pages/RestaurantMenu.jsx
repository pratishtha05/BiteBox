import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft, ShoppingBag, Info} from "lucide-react";

const SERVER_URL = "http://localhost:3000/api/v1/public";

const RestaurantMenu = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, role } = useAuth();

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (!restaurantId) return;
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${SERVER_URL}/menu/${restaurantId}`);
        setMenu(res.data.data || []);
      } catch (err) {
        setError("Unable to load menu. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [restaurantId]);

  const categories = useMemo(() => {
    const cats = ["All", ...new Set(menu.map((item) => item.category).filter(Boolean))];
    return cats;
  }, [menu]);

  const filteredMenu = activeCategory === "All" 
    ? menu 
    : menu.filter(item => item.category === activeCategory);

  const handleAddToCart = (item) => {
    if (!isAuthenticated || role !== "user") return;
    try {
      addToCart({
        menuItem: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
      }, restaurantId);
    } catch (err) {
      alert(err.message === "SINGLE_RESTAURANT_ONLY" 
        ? "You can order from only one restaurant at a time." 
        : "Something went wrong.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 font-medium animate-pulse">loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20">
      {/* Header Section */}
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

      <main className="max-w-6xl mx-auto px-6 pt-8">
        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-6 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all hover:cursor-pointer active:scale-95 ${
                  activeCategory === cat 
                  ? "bg-slate-900 text-white shadow-lg" 
                  : "bg-white text-slate-500 border border-slate-200 hover:border-amber-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {error ? (
          <div className="text-center py-20 bg-white rounded-4xl border border-red-50">
            <Info className="mx-auto text-red-400 mb-4" size={40} />
            <p className="text-slate-600 font-medium">{error}</p>
          </div>
        ) : filteredMenu.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 font-medium tracking-tight">No items found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMenu.map((item) => (
              <div
                key={item._id}
                className="group bg-white rounded-4xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col"
              >
                {/* Image Wrapper */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={item.image || "https://via.placeholder.com/400x300?text=Delicious+Food"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                    <p className="text-slate-900 font-black text-sm">₹{item.price}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-800 capitalize leading-tight">
                      {item.name}
                    </h3>
                  </div>
                  
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6 grow">
                    {item.description || "Freshly prepared with the finest ingredients."}
                  </p>

                  <div className="relative group/btn mt-auto">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!isAuthenticated || role !== "user"}
                      className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest transition-all hover:cursor-pointer active:scale-95 ${
                        !isAuthenticated || role !== "user"
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-amber-500 text-white shadow-lg hover:bg-amber-600"
                      }`}
                    >
                      <ShoppingBag size={16} />
                      Add to Cart
                    </button>

                    {(!isAuthenticated || role !== "user") && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        LOGIN TO ORDER
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantMenu;