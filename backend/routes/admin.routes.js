const express = require("express");
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth.middleware");

const Admin = require("../models/admin.model");
const User = require("../models/user.model");
const Order = require("../models/order.model"); // Order model
const Restaurant = require("../models/restaurant.model");
const Deal = require("../models/deal.model");


const router = express.Router();

/* ---------------- ADMIN PROFILE ---------------- */
router.get("/me", auth, async (req, res) => {
  if (req.auth.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  const admin = await Admin.findById(req.auth.id).select("-password");
  res.json(admin);
});

router.put("/update", auth, async (req, res) => {
  if (req.auth.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  const { name, email, phone, gender } = req.body;
  const updatedAdmin = await Admin.findByIdAndUpdate(
    req.auth.id,
    { name, email, phone, gender },
    { new: true }
  ).select("-password");

  res.json(updatedAdmin);
});

router.put("/change-password", auth, async (req, res) => {
  if (req.auth.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  const { currentPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.auth.id);

  const isMatch = await bcrypt.compare(currentPassword, admin.password);
  if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

  admin.password = await bcrypt.hash(newPassword, 10);
  await admin.save();

  res.json({ message: "Password updated successfully" });
});

router.delete("/delete", auth, async (req, res) => {
  if (req.auth.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  await Admin.findByIdAndDelete(req.auth.id);
  res.json({ message: "Admin account deleted" });
});

/* ---------------- USER MANAGEMENT ---------------- */

// Get all users (include isBlocked & blockReason automatically)
router.get("/users", auth, async (req, res) => {
  if (req.auth.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  const users = await User.find().select("-password");
  res.json(users);
});

// Block a user
router.put("/users/:id/block", auth, async (req, res) => {
  if (req.auth.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  const { reason } = req.body;
  if (!reason) return res.status(400).json({ message: "Block reason is required" });

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.isBlocked = true;          // <-- required change for new field
  user.blockReason = reason;       // <-- required change for new field
  await user.save();

  res.json({ message: "User blocked successfully" });
});

// Unblock a user
router.put("/users/:id/unblock", auth, async (req, res) => {
  if (req.auth.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.isBlocked = false;          // <-- required change for new field
  user.blockReason = "";            // <-- required change for new field
  await user.save();

  res.json({ message: "User unblocked successfully" });
});

// Get order history of a user
router.get("/users/:id/orders", auth, async (req, res) => {
  if (req.auth.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const orders = await Order.find({ user: req.params.id });
  res.json(orders);
});

// restaurant management 
// Get all restaurants
router.get("/restaurants", auth, async (req, res) => {
  if (req.auth.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  const restaurants = await Restaurant.find().select("-password");
  res.json(restaurants);
});

// Block a restaurant
router.put("/restaurants/:id/block", auth, async (req, res) => {
  if (req.auth.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  const { reason } = req.body;
  if (!reason)
    return res.status(400).json({ message: "Block reason is required" });

  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant)
    return res.status(404).json({ message: "Restaurant not found" });

  restaurant.isBlocked = true;
  restaurant.blockReason = reason;
  await restaurant.save();

  res.json({ message: "Restaurant blocked successfully" });
});

// Unblock a restaurant
router.put("/restaurants/:id/unblock", auth, async (req, res) => {
  if (req.auth.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant)
    return res.status(404).json({ message: "Restaurant not found" });

  restaurant.isBlocked = false;
  restaurant.blockReason = "";
  await restaurant.save();

  res.json({ message: "Restaurant unblocked successfully" });
});

/* ---------------- ADMIN DASHBOARD STATS ---------------- */
router.get("/dashboard", auth, async (req, res) => {
  try {
    if (req.auth.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const [
      totalUsers,
      totalRestaurants,
      blockedUsers,
      blockedRestaurants,
    ] = await Promise.all([
      User.countDocuments(),
      Restaurant.countDocuments(),
      User.countDocuments({ isBlocked: true }),
      Restaurant.countDocuments({ isBlocked: true }),
    ]);

    // Optional: simple recent activity (last 5 users & restaurants)
    const recentUsers = await User.find()
      .sort({ _id: -1 })
      .limit(3)
      .select("name");

    const recentRestaurants = await Restaurant.find()
      .sort({ _id: -1 })
      .limit(3)
      .select("name");

    res.json({
      stats: {
        totalUsers,
        totalRestaurants,
        blockedUsers,
        blockedRestaurants,
      },
      recentActivity: {
        users: recentUsers,
        restaurants: recentRestaurants,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------------- CREATE DEAL ---------------- */
router.post("/deals", auth, async (req, res) => {
  if (req.auth.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  const deal = await Deal.create(req.body);
  res.status(201).json(deal);
});

/* ---------------- GET ALL DEALS ---------------- */
router.get("/admin/deals", auth, async (req, res) => {
  if (req.auth.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  const now = new Date();

  await Deal.updateMany(
    { isActive: true, validTill: { $lt: now } },
    { $set: { isActive: false } }
  );

  const deals = await Deal.find().sort({ createdAt: -1 });
  res.json(deals);
});


/* ---------------- UPDATE DEAL ---------------- */
router.put("/deals/:id", auth, async (req, res) => {
  if (req.auth.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!deal) return res.status(404).json({ message: "Deal not found" });

  res.json(deal);
});

/* ---------------- DELETE DEAL ---------------- */
router.delete("/deals/:id", auth, async (req, res) => {
  if (req.auth.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  await Deal.findByIdAndDelete(req.params.id);
  res.json({ message: "Deal deleted successfully" });
});

module.exports = router;

module.exports = router;
