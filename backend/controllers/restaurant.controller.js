const bcrypt = require("bcryptjs");
const Restaurant = require("../models/restaurant.model");
// const Order = require("../models/order.model");
// const MenuItem = require("../models/menuItem.model");

// Helper to prepend full URL to image path
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return "";
  return `${process.env.SERVER_URL || "http://localhost:3000"}${imagePath}`;
};


// Restaurant Profile Management
exports.getProfile = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.auth.id).select("-password");

    if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found" });
    if (restaurant.isBlocked) return res.status(403).json({ success: false, message: `Account blocked: ${restaurant.blockReason}` });

    const data = restaurant.toObject();
    data.image = getFullImageUrl(data.image);

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.uploadImage = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.auth.id);
    if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found" });

    restaurant.image = `/uploads/${req.file.filename}`;
    await restaurant.save();

    res.json({ success: true, image: getFullImageUrl(restaurant.image) });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, address, categories } = req.body;
    
    // 1. Create the update object
    const updateData = { name, email, phone, address, categories };

    // 2. If a new file was uploaded, add its path to the update object
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.auth.id,
      updateData, // Use the dynamic object
      { new: true }
    ).select("-password");

    if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found" });
    
    const data = restaurant.toObject();
    data.image = getFullImageUrl(data.image);

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const restaurant = await Restaurant.findById(req.auth.id);

    if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found" });
    if (restaurant.isBlocked) return res.status(403).json({ success: false, message: `Account blocked: ${restaurant.blockReason}` });

    const isMatch = await bcrypt.compare(currentPassword, restaurant.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Incorrect current password" });

    restaurant.password = await bcrypt.hash(newPassword, 10);
    await restaurant.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;
    const restaurant = await Restaurant.findById(req.auth.id);

    if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found" });
    if (restaurant.isBlocked) return res.status(403).json({ success: false, message: `Account blocked: ${restaurant.blockReason}` });

    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Incorrect password" });

    await Restaurant.findByIdAndDelete(req.auth.id);
    res.json({ success: true, message: "Restaurant account deleted" });
  } catch (err) {
    next(err);
  }
};

// exports.getDashboardData = async (req, res, next) => {
//   try {
//     const restaurantId = req.auth.id;

//     // 1. Fetch Stats (Total Orders & Revenue)
//     const statsResult = await Order.aggregate([
//       { $match: { restaurant: restaurantId } },
//       {
//         $group: {
//           _id: null,
//           totalOrders: { $sum: 1 },
//           revenue: { $sum: "$totalAmount" },
//         },
//       },
//     ]);

//     const stats = {
//       totalOrders: statsResult[0]?.totalOrders || 0,
//       revenue: statsResult[0]?.revenue || 0,
//       totalMenuItems: await MenuItem.countDocuments({ restaurant: restaurantId }),
//     };

//     // 2. Fetch 5 Recent Orders with Customer Names
//     // Note: 'customer' is populated to get the name
//     const recentOrders = await Order.find({ restaurant: restaurantId })
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate("customer", "name");

//     // Format recent orders for frontend
//     const formattedRecentOrders = recentOrders.map(order => ({
//       _id: order._id,
//       customerName: order.customer?.name || "Guest",
//       total: order.totalAmount,
//       status: order.status,
//     }));

//     res.json({
//       success: true,
//       data: {
//         stats,
//         recentOrders: formattedRecentOrders,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };