const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurant.model");

router.get("/restaurants", async (req, res) => {
  try {
    const filter = { isBlocked: false };

    if (req.query.category) {
      filter.categories = req.query.category.toLowerCase().trim();
    }

    const restaurants = await Restaurant.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    console.error("Public restaurants fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
