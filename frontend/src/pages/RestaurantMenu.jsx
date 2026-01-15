import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const RestaurantMenu = () => {
  const { restaurantId } = useParams();
  const [menu, setMenu] = useState([]);
  const { addToCart } = useCart();
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (!restaurantId) return;

    const fetchMenu = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/menu/restaurant/${restaurantId}`
        );
        setMenu(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchMenu();
  }, [restaurantId]);

  const handleAddToCart = (item) => {
    if (!isAuthenticated || role !== "user") return;

    addToCart(
      {
        menuItem: item._id,
        name: item.name,
        price: item.price,
        image: item.image
      },
      restaurantId
    );
  };

  return (
  <div className="max-w-6xl mx-auto p-6">
    {/* Top Bar */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Menu
      </h1>

      <button
        onClick={() => navigate("/")}
        className="text-sm font-medium text-amber-600 hover:underline hover:cursor-pointer"
      >
        ← Back to Home
      </button>
    </div>

    {/* Menu Grid */}
    <div className="grid md:grid-cols-3 gap-6">
      {menu.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-xl shadow p-4 flex flex-col justify-between"
        >
          <div>
            {item.image && (
              <img
                src={`http://localhost:3000${item.image}`}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
            )}
            <h3 className="font-medium text-lg capitalize">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.description}</p>
            <p className="font-semibold mt-2">₹{item.price}</p>
          </div>

          <div className="relative group">
            <button
              onClick={() => handleAddToCart(item)}
              disabled={!isAuthenticated || role !== "user"}
              className={`mt-4 py-2 w-full rounded transition
                ${
                  !isAuthenticated || role !== "user"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-amber-500 text-white hover:bg-amber-600 hover:cursor-pointer active:scale-95"
                }
              `}
            >
              Add to Cart
            </button>

            {!isAuthenticated || role !== "user" && (
              <span
                className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2
                whitespace-nowrap rounded-md bg-black px-3 py-1 text-xs text-white
                opacity-0 group-hover:opacity-100 transition"
              >
                Please login to continue
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

};

export default RestaurantMenu;
