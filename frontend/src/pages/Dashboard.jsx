import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/public/restaurants"
        );
        setRestaurants(res.data.restaurants);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">
          Explore Restaurants
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              onClick={() => navigate(`/restaurant/${restaurant._id}`)}
              className="cursor-pointer rounded-2xl bg-white shadow-md overflow-hidden 
                         transition-transform transform hover:scale-101 hover:shadow-xl"
            >
              {/* Restaurant Image */}
              <img
                src={restaurant.image || "/placeholder-restaurant.jpg"}
                alt={restaurant.name}
                className="w-full h-40 object-cover"
              />

              {/* Restaurant Name */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {restaurant.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
