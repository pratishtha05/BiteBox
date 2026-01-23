const Cart = require("../models/cart.model");


// Get cart
exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.auth.id });

    res.json({
      success: true,
      data: cart || { items: [], restaurantId: null },
    });
  } catch (err) {
    next(err);
  }
};


// Update cart
exports.updateCart = async (req, res, next) => {
  try {
    const { items, restaurantId } = req.body;

    if (!Array.isArray(items) || !restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Items array and restaurantId are required",
      });
    }

    const preparedItems = items.map((item) => ({
      menuItem: item.menuItem,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      image: item.image || "",
    }));

    const cart = await Cart.findOneAndUpdate(
      { user: req.auth.id },
      { items: preparedItems, restaurantId },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      data: cart,
    });
  } catch (err) {
    next(err);
  }
};


// Clear cart
exports.clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndDelete({ user: req.auth.id });

    res.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (err) {
    next(err);
  }
};
