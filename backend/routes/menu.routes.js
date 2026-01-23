const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload");
const menuController = require("../controllers/menu.controller");

router.use(auth, requireRole("restaurant"));

router.get("/", menuController.getMyMenu);
router.post("/", upload.single("image"), menuController.createMenuItem);
router.put("/:id", upload.single("image"), menuController.updateMenuItem);
router.delete("/:id", menuController.deleteMenuItem);

module.exports = router;
