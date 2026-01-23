const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const deliveryController = require("../controllers/delivery.controller");

router.use(auth, requireRole("restaurant"));

router.get("/available", deliveryController.getAvailablePartners);
router.get("/", deliveryController.getAssignedPartners);
router.get("/:partnerId/orders", deliveryController.getPartnerOrders);

module.exports = router;
  