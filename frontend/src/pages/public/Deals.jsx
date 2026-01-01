// Deals.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Deals = () => {
  const { dealType } = useParams();
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const allDeals = {
      today: [
        { id: 1, name: "50% off on Pizza", description: "Valid today only!", image: "https://via.placeholder.com/80" },
        { id: 2, name: "Free Drink with Burger", description: "Get a free drink with any burger.", image: "https://via.placeholder.com/80" },
      ],
      weekend: [
        { id: 3, name: "Buy 1 Get 1 Sandwich", description: "Only this weekend!", image: "https://via.placeholder.com/80" },
        { id: 4, name: "20% off Desserts", description: "Sweet treats at a discount.", image: "https://via.placeholder.com/80" },
      ],
      festival: [
        { id: 5, name: "Special Diwali Combo", description: "Celebrate with this combo!", image: "https://via.placeholder.com/80" },
      ],
    };
    setDeals(allDeals[dealType] || []);
  }, [dealType]);

  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 capitalize text-gray-800">
        {dealType} Deals
      </h1>

      {deals.length === 0 ? (
        <p className="text-gray-500">No deals found!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden hover:scale-105 transition-transform duration-200"
            >
              <img
                src={deal.image}
                alt={deal.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{deal.name}</h2>
                <p className="text-gray-500 mt-1 text-sm">{deal.description}</p>
                <button className="mt-4 w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition">
                  Grab Deal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Deals;
