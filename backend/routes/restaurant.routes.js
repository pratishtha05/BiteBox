const express = require("express");
const bcrypt = require("bcryptjs");

const Restaurant = require("../models/restaurant.model");

const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload");

const router = express.Router();

// Helper: prepend full URL to image path
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return "";
  // Use your server host dynamically if needed
  return `http://localhost:3000${imagePath}`;
};

// Get Restaurant Profile
router.get("/me", auth, async (req, res) => {
  try {
    if (req.auth.role !== "restaurant")
      return res.status(403).json({ message: "Forbidden" });

    const restaurant = await Restaurant.findById(req.auth.id).select("-password");

    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    if (restaurant.isBlocked)
      return res
        .status(403)
        .json({ message: `Account blocked: ${restaurant.blockReason}` });

    const restaurantData = restaurant.toObject();
    restaurantData.image = getFullImageUrl(restaurantData.image);

    res.json(restaurantData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload Restaurant Image
router.put(
  "/upload-image",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      if (req.auth.role !== "restaurant")
        return res.status(403).json({ message: "Forbidden" });

      const restaurant = await Restaurant.findById(req.auth.id);
      if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

      restaurant.image = `/uploads/${req.file.filename}`;
      await restaurant.save();

      res.json({ image: getFullImageUrl(restaurant.image) });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to upload image" });
    }
  }
);

// Update Restaurant Profile
router.put("/update", auth, async (req, res) => {
  try {
    if (req.auth.role !== "restaurant")
      return res.status(403).json({ message: "Forbidden" });

    const { name, email, phone, address, categories } = req.body;

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.auth.id,
      { name, email, phone, address, categories },
      { new: true }
    ).select("-password");

    if (!updatedRestaurant)
      return res.status(404).json({ message: "Restaurant not found" });
    if (updatedRestaurant.isBlocked)
      return res
        .status(403)
        .json({ message: `Account blocked: ${updatedRestaurant.blockReason}` });

    const restaurantData = updatedRestaurant.toObject();
    restaurantData.image = getFullImageUrl(restaurantData.image);

    res.json(restaurantData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// Change Password
router.put("/change-password", auth, async (req, res) => {
  try {
    if (req.auth.role !== "restaurant")
      return res.status(403).json({ message: "Forbidden" });

    const { currentPassword, newPassword } = req.body;
    const restaurant = await Restaurant.findById(req.auth.id);

    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    if (restaurant.isBlocked)
      return res
        .status(403)
        .json({ message: `Account blocked: ${restaurant.blockReason}` });

    const isMatch = await bcrypt.compare(currentPassword, restaurant.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect current password" });

    restaurant.password = await bcrypt.hash(newPassword, 10);
    await restaurant.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to change password" });
  }
});

// Delete Account
router.delete("/delete", auth, async (req, res) => {
  try {
    if (req.auth.role !== "restaurant")
      return res.status(403).json({ message: "Forbidden" });

    const { password } = req.body;
    const restaurant = await Restaurant.findById(req.auth.id);

    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    if (restaurant.isBlocked)
      return res
        .status(403)
        .json({ message: `Account blocked: ${restaurant.blockReason}` });

    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    await Restaurant.findByIdAndDelete(req.auth.id);
    res.json({ message: "Restaurant account deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete account" });
  }
});

module.exports = router;