import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const dummyMenu = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic cheese and tomato pizza with fresh basil.",
    image: "https://source.unsplash.com/600x400/?pizza",
    price: 10,
  },
  {
    id: 2,
    name: "Cheeseburger",
    description: "Juicy beef patty with cheddar, lettuce, and tomato.",
    image: "https://source.unsplash.com/600x400/?burger",
    price: 8,
  },
  {
    id: 3,
    name: "Sushi Platter",
    description: "Fresh sushi rolls with salmon, tuna, and avocado.",
    image: "https://source.unsplash.com/600x400/?sushi",
    price: 15,
  },
  {
    id: 4,
    name: "Pasta Carbonara",
    description: "Creamy pasta with pancetta and parmesan cheese.",
    image: "https://source.unsplash.com/600x400/?pasta",
    price: 12,
  },
];

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6 flex flex-col gap-6">
      {dummyMenu.map((item) => (
        <div
          key={item.id}
          onClick={() => navigate(`/restaurant/${id}/menu/${item.id}`)}
          className="flex flex-col sm:flex-row w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden border border-gray-200 hover:border-amber-500"
        >
          {/* Image */}
          <div className="w-full sm:w-1/3 h-64 sm:h-auto">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between w-full sm:w-2/3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
              <p className="text-gray-600 mt-1">{item.description}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-amber-500 font-bold text-lg">${item.price}</span>
              <button className="bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantMenu;
