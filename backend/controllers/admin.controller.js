const bcrypt = require("bcryptjs");

const Admin = require("../models/admin.model");
const User = require("../models/user.model");
const Restaurant = require("../models/restaurant.model");
const DeliveryPartner = require("../models/deliveryPartner.model");
const Order = require("../models/order.model");
const Deal = require("../models/deal.model");

// Profile Management
exports.getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.auth.id).select("-password");
    res.json({ success: true, data: admin });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, gender } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      req.auth.id,
      { name, email, phone, gender },
      { new: true },
    ).select("-password");

    res.json({ success: true, data: admin });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.auth.id);

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect current password",
      });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    await Admin.findByIdAndDelete(req.auth.id);
    res.json({ success: true, message: "Admin account deleted" });
  } catch (err) {
    next(err);
  }
};

// Users Management
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    const usersWithImages = users.map((u) => {
      const obj = u.toObject();
      return {
        ...obj,
        image: obj.image || "",
      };
    });
    res.json({ success: true, data: usersWithImages });
  } catch (err) {
    next(err);
  }
};

exports.blockUser = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Block reason is required",
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.isBlocked = true;
    user.blockReason = reason;
    await user.save();

    res.json({ success: true, message: "User blocked successfully" });
  } catch (err) {
    next(err);
  }
};

exports.unblockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.isBlocked = false;
    user.blockReason = "";
    await user.save();

    res.json({ success: true, message: "User unblocked successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.params.id });
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

// Restaurants Management
exports.getRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find().select("-password");
    const restaurantsWithImages = restaurants.map((r) => {
      const obj = r.toObject();
      return {
        ...obj,
        image: obj.image || "",
      };
    });
    res.json({ success: true, data: restaurantsWithImages });
  } catch (err) {
    next(err);
  }
};

exports.blockRestaurant = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Block reason is required",
      });
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    restaurant.isBlocked = true;
    restaurant.blockReason = reason;
    await restaurant.save();

    res.json({ success: true, message: "Restaurant blocked successfully" });
  } catch (err) {
    next(err);
  }
};

exports.unblockRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    restaurant.isBlocked = false;
    restaurant.blockReason = "";
    await restaurant.save();

    res.json({ success: true, message: "Restaurant unblocked successfully" });
  } catch (err) {
    next(err);
  }
};

// Dashboard Statistics
exports.dashboard = async (req, res, next) => {
  try {
    const [totalUsers, totalRestaurants, blockedUsers, blockedRestaurants] =
      await Promise.all([
        User.countDocuments(),
        Restaurant.countDocuments(),
        User.countDocuments({ isBlocked: true }),
        Restaurant.countDocuments({ isBlocked: true }),
      ]);

    const recentUsers = await User.find()
      .sort({ _id: -1 })
      .limit(3)
      .select("name");

    const recentRestaurants = await Restaurant.find()
      .sort({ _id: -1 })
      .limit(3)
      .select("name");

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalRestaurants,
          blockedUsers,
          blockedRestaurants,
        },
        recentActivity: {
          users: recentUsers,
          restaurants: recentRestaurants,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// Deals Management

exports.createDeal = async (req, res, next) => {
  try {
    const dealData = { ...req.body };
    if (req.file) {
      dealData.image = req.file.path;
    }

    const deal = await Deal.create(dealData);

    // Use existing helper
    res.status(201).json({ success: true, data: deal });
  } catch (err) {
    next(err);
  }
};

exports.getDeals = async (req, res, next) => {
  try {
    const now = new Date();
    // deactivate expired deals
    await Deal.updateMany(
      { isActive: true, validTill: { $lt: now } },
      { $set: { isActive: false } },
    );

    const deals = await Deal.find().sort({ createdAt: -1 });
    res.json({ success: true, data: deals });
  } catch (err) {
    next(err);
  }
};

exports.updateDeal = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (updateData.isActive !== undefined) {
      updateData.isActive =
        updateData.isActive === "true" || updateData.isActive === true;
    }
    if (req.file) {
      updateData.image = req.file.path;
    }

    const deal = await Deal.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!deal) {
      return res
        .status(404)
        .json({ success: false, message: "Deal not found" });
    }

    res.json({ success: true, data: deal });
  } catch (err) {
    next(err);
  }
};

exports.deleteDeal = async (req, res, next) => {
  try {
    await Deal.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deal deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// Delivery Partners Management
exports.getDeliveryPartners = async (req, res, next) => {
  try {
    const partners = await DeliveryPartner.find().select("-password");
    res.json({ success: true, data: partners });
  } catch (err) {
    next(err);
  }
};

exports.blockDeliveryPartner = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res
        .status(400)
        .json({ success: false, message: "Reason is required" });
    }

    const partner = await DeliveryPartner.findById(req.params.id);
    if (!partner) {
      return res
        .status(404)
        .json({ success: false, message: "Partner not found" });
    }

    partner.isBlocked = true;
    partner.blockReason = reason;
    await partner.save();

    res.json({ success: true, message: "Delivery partner blocked" });
  } catch (err) {
    next(err);
  }
};

exports.unblockDeliveryPartner = async (req, res, next) => {
  try {
    const partner = await DeliveryPartner.findById(req.params.id);
    if (!partner) {
      return res
        .status(404)
        .json({ success: false, message: "Partner not found" });
    }

    partner.isBlocked = false;
    partner.blockReason = "";
    await partner.save();

    res.json({ success: true, message: "Delivery partner unblocked" });
  } catch (err) {
    next(err);
  }
};
