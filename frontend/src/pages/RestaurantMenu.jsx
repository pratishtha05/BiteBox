import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const RestaurantMenu = () => {
  const { restaurantId } = useParams();
  const [menu, setMenu] = useState([]);
  const { addToCart } = useCart();
  const { isAuthenticated, role } = useAuth();

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
      },
      restaurantId
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
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

            <button
              onClick={() => handleAddToCart(item)}
              disabled={!isAuthenticated || role !== "user"}
              className={`mt-4 py-2 rounded transition
                ${
                  !isAuthenticated || role !== "user"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-amber-500 text-white hover:bg-amber-600 hover:cursor-pointer active:scale-95"
                }
              `}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantMenu;
