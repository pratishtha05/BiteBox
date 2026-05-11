const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

// User Profile Management
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.id).select("-password");
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, gender } = req.body;
    const updateData = { name, email, phone, gender };

    // If a new file is uploaded, update the image path
    if (req.file) {
      updateData.image = req.file?.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.auth.id,
      updateData,
      { new: true }
    ).select("-password");

    res.json({ success: true, data: updatedUser });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.auth.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.auth.id);
    res.json({ success: true, message: "User account deleted" });
  } catch (err) {
    next(err);
  }
};
