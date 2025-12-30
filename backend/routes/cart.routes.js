const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.model"); // new cart model
const auth = require("../middlewares/auth.middleware");

// Get user cart
router.get("/", auth, async (req, res) => {
  if (req.auth.role !== "user") return res.status(403).json({ message: "Forbidden" });
  const cart = await Cart.findOne({ user: req.auth.id });
  res.json(cart || { items: [], restaurantId: null });
});

// Update user cart
router.post("/", auth, async (req, res) => {
  if (req.auth.role !== "user") return res.status(403).json({ message: "Forbidden" });

  const { items, restaurantId } = req.body;

  let cart = await Cart.findOne({ user: req.auth.id });
  if (!cart) {
    cart = await Cart.create({ user: req.auth.id, items, restaurantId });
  } else {
    cart.items = items;
    cart.restaurantId = restaurantId;
    await cart.save();
  }

  res.json(cart);
});

// Clear cart
router.delete("/", auth, async (req, res) => {
  if (req.auth.role !== "user") return res.status(403).json({ message: "Forbidden" });

  await Cart.findOneAndDelete({ user: req.auth.id });
  res.json({ message: "Cart cleared" });
});

module.exports = router;
