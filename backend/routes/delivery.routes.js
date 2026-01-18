const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");

const DeliveryPartner = require("../models/deliveryPartner.model");

router.get("/available", auth, async (req, res) => {
  if (req.auth.role !== "restaurant") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const partners = await DeliveryPartner.find({
    isAvailable: true,
    isBlocked: false,
  }).select("name phone");

  res.json(partners);
});

router.get("/", auth, async (req, res) => {
  try {
    if (req.auth.role !== "restaurant") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const orders = await Order.find({ restaurant: req.auth.id, deliveryPartner: { $ne: null } })
      .populate("deliveryPartner", "name phone email")
      .lean();

    const uniquePartners = [];
    const seen = new Set();
    orders.forEach((o) => {
      const dp = o.deliveryPartner;
      if (!seen.has(dp._id)) {
        seen.add(dp._id);
        uniquePartners.push(dp);
      }
    });

    res.json(uniquePartners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:partnerId/orders", auth, async (req, res) => {
  try {
    if (req.auth.role !== "restaurant") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const orders = await Order.find({
      restaurant: req.auth.id,
      deliveryPartner: req.params.partnerId,
    })
      .populate("customer", "name phone")
      .select("items status deliveryStatus totalAmount createdAt")
      .lean();

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
