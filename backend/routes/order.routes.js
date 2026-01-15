const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");
const auth = require("../middlewares/auth.middleware");
const MenuItem = require("../models/menu.model");

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

    // 🔥 Fetch menu items to snapshot data
    const menuItems = await MenuItem.find({
      _id: { $in: items.map(i => i.menuItem) }
    });

    const enrichedItems = items.map(item => {
      const menu = menuItems.find(
        m => m._id.toString() === item.menuItem
      );

      return {
        menuItem: item.menuItem,
        name: menu.name,
        price: menu.price,
        image: menu.image, // ✅ snapshot image
        quantity: item.quantity,
      };
    });

    const order = await Order.create({
      customer: req.auth.id,
      restaurant: restaurantId,
      items: enrichedItems,
      totalAmount,
      status: "placed",
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/**
 * USER ORDERS
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
  try {
    if (req.auth.role !== "restaurant") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const orders = await Order.find({ restaurant: req.auth.id })
      .populate("customer", "name")
      .populate("deliveryPartner", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET SINGLE ORDER (USED BY CONFIRMATION / TRACK)
 */
router.get("/:orderId", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("restaurant", "name address");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // User can only see their own orders
    if (
      req.auth.role === "user" &&
      order.customer.toString() !== req.auth.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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

  const VALID_FLOW = ["placed", "accepted", "preparing","out for delivery", "completed"];

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
