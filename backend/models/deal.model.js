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

    image: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    validTill: {
      type: Date,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("deal", dealSchema);
