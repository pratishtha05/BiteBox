const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const orderController = require("../controllers/order.controller");

/* User */
router.post("/", auth, requireRole("user"), orderController.createOrder);
router.get("/me", auth, requireRole("user"), orderController.getMyOrders);

/* Restaurant */
router.get(
  "/restaurant",
  auth,
  requireRole("restaurant"),
  orderController.getRestaurantOrders
);
router.put(
  "/:orderId/status",
  auth,
  requireRole("restaurant"),
  orderController.updateOrderStatus
);
router.put(
  "/:orderId/assign-delivery",
  auth,
  requireRole("restaurant"),
  orderController.assignDeliveryPartner
);

/* Delivery */
router.get(
  "/delivery/me",
  auth,
  requireRole("delivery"),
  orderController.getDeliveryOrders
);
router.put(
  "/:orderId/delivery-status",
  auth,
  requireRole("delivery"),
  orderController.updateDeliveryStatus
);

/* Shared */
router.get("/:orderId", auth, orderController.getOrderById);

module.exports = router;
