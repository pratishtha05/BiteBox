const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

// Get User Profile
router.get("/me", auth, async (req, res) => {
  if (req.auth.role !== "user")
    return res.status(403).json({ message: "Forbidden" });

  const user = await User.findById(req.auth.id).select("-password isBlocked blockReason");
  res.json(user);
});

// Update User Profile
router.put("/update", auth, async (req, res) => {
  if (req.auth.role !== "user")
    return res.status(403).json({ message: "Forbidden" });

  const { name, email, phone, gender } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.auth.id,
    { name, email, phone, gender },
    { new: true }
  ).select("-password");

  res.json(updatedUser);
});

// Change Password
router.put("/change-password", auth, async (req, res) => {
  if (req.auth.role !== "user")
    return res.status(403).json({ message: "Forbidden" });

  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.auth.id);
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch)
    return res.status(400).json({ message: "Incorrect current password" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password updated successfully" });
});

// Delete Account
router.delete("/delete", auth, async (req, res) => {
  if (req.auth.role !== "user")
    return res.status(403).json({ message: "Forbidden" });

  await User.findByIdAndDelete(req.auth.id);
  res.json({ message: "User account deleted" });
});

module.exports = router;
