const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");
const auth = require("../middlewares/auth.middleware");

/**
 * =========================
 * CREATE ORDER (USER)
 * =========================
 */
router.post("/create", auth, async (req, res) => {
  try {
    if (req.auth.role !== "user") {
      return res.status(403).json({ message: "Only users can place orders" });
    }

    const { restaurantId, items, totalAmount } = req.body;
    console.log("Request body:", req.body);
    console.log("Authenticated user:", req.auth);

    const order = await Order.create({
      customer: req.auth.id,
      restaurant: restaurantId,
      items,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * USER ORDERS
 * =========================
 */
router.get("/my-orders", auth, async (req, res) => {
  try {
    if (req.auth.role !== "user") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const orders = await Order.find({ customer: req.auth.id })
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/**
 * =========================
 * RESTAURANT ORDERS
 * =========================
 */
router.get("/restaurant", auth, async (req, res) => {
  if (req.auth.role !== "restaurant") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const orders = await Order.find({ restaurant: req.auth.id })
    .populate("customer", "name")
    .sort({ createdAt: -1 });

  res.json(orders);
});

/**
 * =========================
 * UPDATE ORDER STATUS
 * =========================
 */
router.put("/:orderId/status", auth, async (req, res) => {
  if (req.auth.role !== "restaurant") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { status } = req.body;

  const order = await Order.findOneAndUpdate(
    { _id: req.params.orderId, restaurant: req.auth.id },
    { status },
    { new: true }
  );

  res.json(order);
});

module.exports = router;
