const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const authController = require("../controllers/auth.controller");
const authValidation = require("../validations/auth.validation");

/* User */
router.post("/user/signup", authValidation.userSignup, authController.userSignup);
router.post("/user/login", authValidation.login, authController.userLogin);

/* Restaurant */
router.post(
  "/restaurant/signup",
  upload.single("image"),
  authController.restaurantSignup
);
router.post("/restaurant/login", authController.restaurantLogin);

/* Admin */
router.post("/admin/login", authValidation.login, authController.adminLogin);

/* Delivery */
router.post("/delivery/signup", authController.deliverySignup);
router.post("/delivery/login", authController.deliveryLogin);

module.exports = router;
