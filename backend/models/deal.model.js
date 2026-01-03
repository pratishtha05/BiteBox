const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    dealType: {
      type: String,
      required: true, // today | weekend | festival | custom
      lowercase: true,
      index: true,
    },

    image: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    validTill: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("deal", dealSchema);
