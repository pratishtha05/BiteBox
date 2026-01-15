const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant",
      required: true,
    },
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "menuItem",
          required: true,
        },
        name: String,
        price: Number,
        image: String,
        quantity: { type: Number, default: 1 },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "placed",
        "accepted",
        "preparing",
        "out for delivery",
        "completed",
      ],
      default: "placed",
    },
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "deliveryPartner",
      default: null,
    },
    deliveryStatus: {
      type: String,
      enum: ["unassigned", "assigned", "picked_up", "on_the_way", "delivered"],
      default: "unassigned",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
