const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, unique: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant" },
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "menuItem", required: true },
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 },
    },
  ],
});

module.exports = mongoose.model("cart", cartSchema);
