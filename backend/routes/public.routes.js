const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurant.model");
const MenuItem = require("../models/menu.model");

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

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q?.toLowerCase().trim();

    if (!query) {
      return res.json({ restaurants: [] });
    }

    // 1️⃣ Restaurant name OR category match
    const restaurantsByNameOrCategory = await Restaurant.find({
      isBlocked: false,
      $or: [{ name: { $regex: query, $options: "i" } }, { categories: query }],
    });

    // 2️⃣ Food match → get restaurant IDs
    const foodMatches = await MenuItem.find({
      name: { $regex: query, $options: "i" },
      isAvailable: true,
      isDeleted: false,
    }).select("restaurant");

    const restaurantIdsFromFood = foodMatches.map((item) => item.restaurant);

    // 3️⃣ Fetch restaurants from food matches
    const restaurantsFromFood = await Restaurant.find({
      _id: { $in: restaurantIdsFromFood },
      isBlocked: false,
    });

    // 4️⃣ Merge & remove duplicates
    const restaurantMap = new Map();

    [...restaurantsByNameOrCategory, ...restaurantsFromFood].forEach((r) =>
      restaurantMap.set(r._id.toString(), r)
    );

    res.json({
      restaurants: Array.from(restaurantMap.values()),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
});

/**
 * GET menu for users
 */
router.get("/:restaurantId", async (req, res) => {
  const items = await MenuItem.find({
    restaurant: req.params.restaurantId,
    isAvailable: true,
    isDeleted: false,
  });

  res.json(items);
});

module.exports = router;
