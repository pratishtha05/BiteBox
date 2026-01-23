const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload");
const adminController = require("../controllers/admin.controller");

router.use(auth, requireRole("admin"));

/* Profile */
router.get("/me", adminController.getMe);
router.put("/update", adminController.updateProfile);
router.put("/change-password", adminController.changePassword);
router.delete("/delete", adminController.deleteAccount);

/* Users */
router.get("/users", adminController.getUsers);
router.put("/users/:id/block", adminController.blockUser);
router.put("/users/:id/unblock", adminController.unblockUser);
router.get("/users/:id/orders", adminController.getUserOrders);

/* Restaurants */
router.get("/restaurants", adminController.getRestaurants);
router.put("/restaurants/:id/block", adminController.blockRestaurant);
router.put("/restaurants/:id/unblock", adminController.unblockRestaurant);

/* Dashboard */
router.get("/dashboard", adminController.dashboard);

/* Deals */
router.post("/deals", upload.single("image"), adminController.createDeal);
router.get("/deals", adminController.getDeals);
router.put("/deals/:id", upload.single("image"), adminController.updateDeal);
router.delete("/deals/:id", adminController.deleteDeal);

/* Delivery Partners */
router.get("/delivery-partners", adminController.getDeliveryPartners);
router.put("/delivery-partners/:id/block", adminController.blockDeliveryPartner);
router.put("/delivery-partners/:id/unblock", adminController.unblockDeliveryPartner);

module.exports = router;
