const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  isBlocked: { type: Boolean, default: false },
  blockReason: { type: String, default: "" },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
