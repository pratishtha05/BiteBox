const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload");
const restaurantController = require("../controllers/restaurant.controller");

router.use(auth, requireRole("restaurant"));

router.get("/me", restaurantController.getProfile);
router.put("/upload-image", upload.single("image"), restaurantController.uploadImage);
router.put("/update", upload.single("image"), restaurantController.updateProfile);
router.put("/change-password", restaurantController.changePassword);
router.delete("/delete", restaurantController.deleteAccount);
// router.get("/dashboard", restaurantController.getDashboardData);

module.exports = router;
