const express = require("express");
const router = express.Router();

const Restaurant = require("../models/restaurant.model");

/**
 * GET /public/restaurants
 * Public: Get all active (non-blocked) restaurants
 */
router.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find(
      { isBlocked: false },
      "-password"
    ).sort({ createdAt: -1 });

    res.json({
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    console.error("Public restaurants fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
