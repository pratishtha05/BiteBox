import React from "react";

const Dashboard = () => {

  return (
    <div className="flex flex-row">
      <div className="p-4 w-full">
        {/* CATEGORIES */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Category</h3>
          <div className="flex justify-between space-x-4">
            categories go here
          </div>
        </div>

        {/* RESTAURANTS */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Restaurants</h3>
            <span className="text-sm text-gray-500">
              x restaurants available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            restaurants go here
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
