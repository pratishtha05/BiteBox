// import { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import {
//   ShoppingCart,
//   DollarSign,
//   Menu,
//   Star,
// } from "lucide-react";

// import { useAuth } from "../../context/AuthContext";

// const SERVER_URL = "http://localhost:3000/api/v1";

// const StatCard = ({ title, value, icon: Icon }) => (
//   <div className="flex items-center justify-between p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
//     <div>
//       <p className="text-gray-500">{title}</p>
//       <p className="mt-1 text-2xl font-semibold text-gray-900">
//         {value}
//       </p>
//     </div>
//     <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
//       <Icon className="w-6 h-6 text-white" />
//     </div>
//   </div>
// );

// const RestaurantDashboard = () => {
//   const { restaurant, token } = useAuth();
//   const restaurantId = restaurant?.restaurantId;

//   const [dashboard, setDashboard] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const authHeaders = token
//     ? { headers: { Authorization: `Bearer ${token}` } }
//     : {};

//   useEffect(() => {
//     if (!restaurantId) return;

//     const fetchDashboard = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await axios.get(
//           `${SERVER_URL}/restaurant/dashboard`,
//           authHeaders
//         );

//         setDashboard(res.data.data || null);
//       } catch (err) {
//         console.error("Dashboard fetch failed:", err);
//         setError("Failed to load dashboard");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboard();
//   }, [restaurantId, token]);


//   const stats = useMemo(() => {
//     if (!dashboard?.stats) return [];

//     return [
//       {
//         id: 1,
//         title: "Total Orders",
//         value: dashboard.stats.totalOrders,
//         icon: ShoppingCart,
//       },
//       {
//         id: 2,
//         title: "Revenue",
//         value: `₹${dashboard.stats.revenue}`,
//         icon: DollarSign,
//       },
//       {
//         id: 3,
//         title: "Menu Items",
//         value: dashboard.stats.totalMenuItems,
//         icon: Menu,
//       },
//     ];
//   }, [dashboard]);

//   const recentOrders = dashboard?.recentOrders || [];
//   const topMenuItems = dashboard?.topMenuItems || [];

//   if (loading) {
//     return (
//       <div className="p-6 max-w-7xl mx-auto space-y-6">
//         <div className="h-8 w-64 bg-gray-100 rounded animate-pulse" />
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//           {Array.from({ length: 3 }).map((_, i) => (
//             <div
//               key={i}
//               className="h-28 bg-gray-100 rounded-2xl animate-pulse"
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 text-red-500 max-w-7xl mx-auto">
//         {error}
//       </div>
//     );
//   }

//   if (!dashboard) {
//     return (
//       <div className="p-6 text-gray-500 max-w-7xl mx-auto">
//         No dashboard data available
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-7xl mx-auto space-y-10">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">
//           Welcome, {restaurant?.name}!
//         </h1>
//         <p className="text-gray-500 mt-1">
//           Here's a quick overview of your restaurant performance
//         </p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//         {stats.map((stat) => (
//           <StatCard key={stat.id} {...stat} />
//         ))}
//       </div>

//       {/* Recent Orders */}
//       <div className="bg-white rounded-2xl shadow p-6">
//         <h2 className="text-xl font-semibold text-gray-900 mb-4">
//           Recent Orders
//         </h2>

//         {recentOrders.length === 0 ? (
//           <p className="text-gray-500">No recent orders</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="text-gray-500 border-b">
//                   <th className="py-2 px-4">Order ID</th>
//                   <th className="py-2 px-4">Customer</th>
//                   <th className="py-2 px-4">Total</th>
//                   <th className="py-2 px-4">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recentOrders.map((order) => (
//                   <tr
//                     key={order._id}
//                     className="border-b hover:bg-gray-50 transition"
//                   >
//                     <td className="py-2 px-4">#{order._id}</td>
//                     <td className="py-2 px-4">
//                       {order.customerName}
//                     </td>
//                     <td className="py-2 px-4">
//                       ₹{order.total}
//                     </td>
//                     <td className="py-2 px-4 text-amber-500 font-medium">
//                       {order.status}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Top Menu Items */}
//       {topMenuItems.length > 0 && (
//         <div className="bg-white rounded-2xl shadow p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">
//             Top Menu Items
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {topMenuItems.map((item) => (
//               <div
//                 key={item._id}
//                 className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition"
//               >
//                 <img
//                   src={item.image || "/placeholder-restaurant.jpg"}
//                   alt={item.name}
//                   className="w-16 h-16 rounded-lg object-cover"
//                 />

//                 <div>
//                   <p className="font-semibold text-gray-900">
//                     {item.name}
//                   </p>
//                   <p className="text-gray-500">
//                     ₹{item.price}
//                   </p>
//                   <p className="flex items-center gap-1 text-amber-500">
//                     <Star size={16} /> {item.sales || 0} sold
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RestaurantDashboard;

import React from 'react'

const RestaurantDashboard = () => {
  return (
    <div>
      Dashboard
    </div>
  )
}

export default RestaurantDashboard

