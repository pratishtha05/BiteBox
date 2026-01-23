const express = require("express");
const router = express.Router();

const publicController = require("../controllers/public.controller");
const menuController = require("../controllers/menu.controller");

/* Discovery */
router.get("/categories", publicController.getCategories);
router.get("/restaurants", publicController.getRestaurants);
router.get("/search", publicController.search);

/* Deals */
router.get("/deals", publicController.getActiveDeals);

/* Contact */
router.post("/contact", publicController.submitContactForm);

/* Public Menu Access */
router.get(
  "/menu/:restaurantId",
  menuController.getRestaurantMenu
);

module.exports = router;
