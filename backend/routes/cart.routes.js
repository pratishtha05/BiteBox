const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.model");
const auth = require("../middlewares/auth.middleware");


// GET: Get user cart
router.get("/", auth, async (req, res) => {
  if (req.auth.role !== "user") return res.status(403).json({ message: "Forbidden" });

  const cart = await Cart.findOne({ user: req.auth.id });
  res.json(cart || { items: [], restaurantId: null });
});

// POST: Update/Create cart
router.post("/", auth, async (req, res) => {
  if (req.auth.role !== "user") return res.status(403).json({ message: "Forbidden" });

  try {
    const { items, restaurantId } = req.body;

    // Ensure all items have name, price, quantity, image
    const preparedItems = items.map(item => ({
      menuItem: item.menuItem,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      image: item.image || "",
    }));

    const cart = await Cart.findOneAndUpdate(
      { user: req.auth.id },
      { items: preparedItems, restaurantId },
      { new: true, upsert: true } // avoids VersionError
    );

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});


// DELETE: Clear cart
router.delete("/", auth, async (req, res) => {
  if (req.auth.role !== "user") return res.status(403).json({ message: "Forbidden" });

  await Cart.findOneAndDelete({ user: req.auth.id });
  res.json({ message: "Cart cleared" });
});

module.exports = router;
