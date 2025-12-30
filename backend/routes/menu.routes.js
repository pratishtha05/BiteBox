const express = require("express");
const MenuItem = require("../models/menu.model");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * =========================
 * RESTAURANT (PRIVATE)
 * =========================
 */

// GET logged-in restaurant menu
router.get("/", auth, async (req, res) => {
  if (req.auth.role !== "restaurant")
    return res.status(403).json({ message: "Forbidden" });

  const items = await MenuItem.find({
    restaurant: req.auth.id,
    isDeleted: false,
  }).sort({ createdAt: -1 });

  res.json(items);
});

// CREATE menu item
router.post("/createMenuItem", auth, async (req, res) => {
  if (req.auth.role !== "restaurant")
    return res.status(403).json({ message: "Forbidden" });

  const item = await MenuItem.create({
    ...req.body,
    restaurant: req.auth.id,
  });

  res.status(201).json(item);
});

// UPDATE menu item
router.put("/:id", auth, async (req, res) => {
  const item = await MenuItem.findOneAndUpdate(
    { _id: req.params.id, restaurant: req.auth.id },
    req.body,
    { new: true }
  );

  res.json(item);
});

// SOFT DELETE
router.delete("/:id", auth, async (req, res) => {
  await MenuItem.findOneAndUpdate(
    { _id: req.params.id, restaurant: req.auth.id },
    { isDeleted: true }
  );

  res.json({ message: "Menu item removed" });
});

/**
 * =========================
 * PUBLIC MENU (CUSTOMERS)
 * =========================
 */

router.get("/restaurant/:restaurantId", async (req, res) => {
  const items = await MenuItem.find({
    restaurant: req.params.restaurantId,
    isAvailable: true,
    isDeleted: false,
  });

  res.json(items);
});

module.exports = router;
