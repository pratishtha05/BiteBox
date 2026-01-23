const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload");
const userController = require("../controllers/user.controller");

router.use(auth, requireRole("user"));

router.get("/me", userController.getProfile);
router.put("/update", upload.single("image"), userController.updateProfile);
router.put("/update", userController.updateProfile);
router.put("/change-password", userController.changePassword);
router.delete("/delete", userController.deleteAccount);

module.exports = router;
