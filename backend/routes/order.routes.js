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

  const VALID_FLOW = ["pending", "accepted", "preparing", "completed"];

  const order = await Order.findOne({
    _id: req.params.orderId,
    restaurant: req.auth.id,
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Lock completed / cancelled orders
  if (["completed", "cancelled"].includes(order.status)) {
    return res
      .status(400)
      .json({ message: "Order status can no longer be updated" });
  }

  // Cancel allowed anytime before completion
  if (status === "cancelled") {
    order.status = "cancelled";
    await order.save();
    return res.json(order);
  }

  const currentIndex = VALID_FLOW.indexOf(order.status);
  const nextValidStatus = VALID_FLOW[currentIndex + 1];

  if (status !== nextValidStatus) {
    return res.status(400).json({
      message: `Invalid status transition from ${order.status} to ${status}`,
    });
  }

  order.status = status;
  await order.save();

  res.json(order);
});


router.put("/:orderId/assign-delivery", auth, async (req, res) => {
  if (req.auth.role !== "restaurant") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { deliveryPartnerId } = req.body;

  const order = await Order.findOneAndUpdate(
    { _id: req.params.orderId, restaurant: req.auth.id },
    {
      deliveryPartner: deliveryPartnerId,
      deliveryStatus: "assigned",
    },
    { new: true }
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
});

router.get("/delivery/my-orders", auth, async (req, res) => {
  if (req.auth.role !== "delivery") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const orders = await Order.find({
    deliveryPartner: req.auth.id,
  })
    .populate("restaurant", "name address")
    .populate("customer", "name phone")
    .sort({ createdAt: -1 });

  res.json(orders);
});

router.put("/:orderId/delivery-status", auth, async (req, res) => {
  if (req.auth.role !== "delivery") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { deliveryStatus } = req.body;

  const order = await Order.findOneAndUpdate(
    { _id: req.params.orderId, deliveryPartner: req.auth.id },
    { deliveryStatus },
    { new: true }
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
});


module.exports = router;
