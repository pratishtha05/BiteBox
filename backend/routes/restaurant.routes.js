const express = require("express");
const bcrypt = require("bcryptjs");
const Restaurant = require("../models/restaurant.model");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

// Get Restaurant Profile
router.get("/me", auth, async (req, res) => {
  if (req.auth.role !== "restaurant")
    return res.status(403).json({ message: "Forbidden" });

  const restaurant = await Restaurant.findById(req.auth.id).select("-password");
  if (restaurant.isBlocked) {
    return res
      .status(403)
      .json({ message: `Account blocked: ${restaurant.blockReason}` });
  }
  res.json(restaurant);
});

// Update Restaurant Profile
router.put("/update", auth, async (req, res) => {
  if (req.auth.role !== "restaurant")
    return res.status(403).json({ message: "Forbidden" });

  const { name, email, phone, address, categories } = req.body;

  const updatedRestaurant = await Restaurant.findByIdAndUpdate(
    req.auth.id,
    { name, email, phone, address, categories },
    { new: true }
  ).select("-password");

  if (updatedRestaurant.isBlocked) {
    return res
      .status(403)
      .json({ message: `Account blocked: ${updatedRestaurant.blockReason}` });
  }

  res.json(updatedRestaurant);
});

// Change Password
router.put("/change-password", auth, async (req, res) => {
  if (req.auth.role !== "restaurant")
    return res.status(403).json({ message: "Forbidden" });

  const { currentPassword, newPassword } = req.body;

  const restaurant = await Restaurant.findById(req.auth.id);

  if (restaurant.isBlocked) {
    return res
      .status(403)
      .json({ message: `Account blocked: ${restaurant.blockReason}` });
  }

  const isMatch = await bcrypt.compare(currentPassword, restaurant.password);

  if (!isMatch)
    return res.status(400).json({ message: "Incorrect current password" });

  restaurant.password = await bcrypt.hash(newPassword, 10);
  await restaurant.save();

  res.json({ message: "Password updated successfully" });
});

// Delete Account
router.delete("/delete", auth, async (req, res) => {
  if (req.auth.role !== "restaurant")
    return res.status(403).json({ message: "Forbidden" });

  const restaurant = await Restaurant.findById(req.auth.id);

if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

if (restaurant.isBlocked) {
  return res.status(403).json({ message: `Account blocked: ${restaurant.blockReason}` });
}

await Restaurant.findByIdAndDelete(req.auth.id);
res.json({ message: "Restaurant account deleted" });

});

// GET /restaurant/dashboard
router.get("/dashboard", auth, async (req, res) => {
  try {
    // Only allow restaurant users
    if (req.auth.role !== "restaurant") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const restaurantId = req.auth.restaurantId; // assuming this is stored in token

    // Fetch stats concurrently
    const [totalOrders, totalRevenue, totalMenuItems] = await Promise.all([
      Order.countDocuments({ restaurantId }),
      Order.aggregate([
        { $match: { restaurantId } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      MenuItem.countDocuments({ restaurantId }),
    ]);

    // Recent orders (last 5)
    const recentOrders = await Order.find({ restaurantId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("customerName total status");

    // Format revenue
    const revenueValue =
      totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    res.json({
      stats: {
        totalOrders,
        revenue: revenueValue,
        totalMenuItems,
      },
      recentOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
