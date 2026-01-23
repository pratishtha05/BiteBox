const MenuItem = require("../models/menu.model");

// Restaurant Menu Management
exports.getMyMenu = async (req, res, next) => {
  try {
    const items = await MenuItem.find({
      restaurant: req.auth.id,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: items.map(attachImageUrl),
    });
  } catch (err) {
    next(err);
  }
};

exports.createMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.create({
      ...req.body,
      restaurant: req.auth.id,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.status(201).json({
      success: true,
      data: attachImageUrl(item),
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMenuItem = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const item = await MenuItem.findOneAndUpdate(
      { _id: req.params.id, restaurant: req.auth.id },
      updateData,
      { new: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      data: attachImageUrl(item),
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteMenuItem = async (req, res, next) => {
  try {
    await MenuItem.findOneAndUpdate(
      { _id: req.params.id, restaurant: req.auth.id },
      { isDeleted: true }
    );

    res.json({
      success: true,
      message: "Menu item removed",
    });
  } catch (err) {
    next(err);
  }
};

// Public Menu Access
exports.getRestaurantMenu = async (req, res, next) => {
  try {
    const items = await MenuItem.find({
      restaurant: req.params.restaurantId,
      isAvailable: true,
      isDeleted: false,
    });

    res.json({
      success: true,
      data: items.map(attachImageUrl),
    });
  } catch (err) {
    next(err);
  }
};

// Helper to attach full image URL
const attachImageUrl = (item) => {
  const obj = item.toObject();
  obj.image = obj.image
    ? `${process.env.SERVER_URL}${obj.image}`
    : "";
  return obj;
};
