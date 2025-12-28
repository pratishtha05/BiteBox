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

  const { name, email, phone, address } = req.body;

  const updatedRestaurant = await Restaurant.findByIdAndUpdate(
    req.auth.id,
    { name, email, phone, address },
    { new: true }
  ).select("-password");

  if (restaurant.isBlocked) {
    return res
      .status(403)
      .json({ message: `Account blocked: ${restaurant.blockReason}` });
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

  await Restaurant.findByIdAndDelete(req.auth.id);

  if (restaurant.isBlocked) {
    return res
      .status(403)
      .json({ message: `Account blocked: ${restaurant.blockReason}` });
  }

  res.json({ message: "Restaurant account deleted" });
});

module.exports = router;
