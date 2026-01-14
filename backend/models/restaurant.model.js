const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  restaurantId: {
    type: Number,
    required: true,
    unique: true,
  },
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

  image: {
    type: String,
    default: "",
  },
  
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  categories: {
    type: [String],
    required: true,
    set: (categories) => categories.map((c) => c.toLowerCase().trim()),
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },
  blockReason: {
    type: String,
    default: "",
  },
});

const restaurantModel = mongoose.model("restaurant", restaurantSchema);

module.exports = restaurantModel;
