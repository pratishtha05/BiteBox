const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const cartController = require("../controllers/cart.controller");

router.use(auth, requireRole("user"));

router.get("/", cartController.getCart);
router.post("/", cartController.updateCart);
router.delete("/", cartController.clearCart);

module.exports = router;
