const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const Restaurant = require("../models/restaurant.model");
const Admin = require("../models/admin.model");
const DeliveryPartner = require("../models/deliveryPartner.model");

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });


// User Signup and Login
exports.userSignup = async (req, res, next) => {
  try {
    const { name, email, password, phone, gender } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      gender,
    });

    const token = generateToken({ id: user._id, role: "user" });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      data: { user, token, role: "user" },
    });
  } catch (err) {
    next(err);
  }
};

exports.userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: `User blocked: ${user.blockReason}`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken({ id: user._id, role: "user" });

    res.json({
      success: true,
      message: "Login successful",
      data: { user, token, role: "user" },
    });
  } catch (err) {
    next(err);
  }
};


// Restaurant Signup and Login
exports.restaurantSignup = async (req, res, next) => {
  try {
    const { restaurantId, name, email, password, phone, address, categories } =
      req.body;

    const exists = await Restaurant.findOne({
      $or: [{ email }, { restaurantId: Number(restaurantId) }],
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Restaurant already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const restaurant = await Restaurant.create({
      restaurantId: Number(restaurantId),
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      categories: Array.isArray(categories) ? categories : [categories],
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    const token = generateToken({ id: restaurant._id, role: "restaurant" });

    res.status(201).json({
      success: true,
      message: "Restaurant registered",
      data: { restaurant, token, role: "restaurant" },
    });
  } catch (err) {
    next(err);
  }
};

exports.restaurantLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (restaurant.isBlocked) {
      return res.status(403).json({
        success: false,
        message: `Restaurant blocked: ${restaurant.blockReason}`,
      });
    }

    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken({ id: restaurant._id, role: "restaurant" });

    res.json({
      success: true,
      message: "Login successful",
      data: { restaurant, token, role: "restaurant" },
    });
  } catch (err) {
    next(err);
  }
};


// Admin Login
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken({ id: admin._id, role: "admin" });

    res.json({
      success: true,
      message: "Login successful",
      data: { admin, token, role: "admin" },
    });
  } catch (err) {
    next(err);
  }
};


// Delivery Partner Signup and Login
exports.deliverySignup = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const exists = await DeliveryPartner.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Delivery partner already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const delivery = await DeliveryPartner.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    const token = generateToken({ id: delivery._id, role: "delivery" });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      data: { delivery, token, role: "delivery" },
    });
  } catch (err) {
    next(err);
  }
};

exports.deliveryLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const delivery = await DeliveryPartner.findOne({ email });
    if (!delivery) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, delivery.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken({ id: delivery._id, role: "delivery" });

    res.json({
      success: true,
      message: "Login successful",
      data: { delivery, token, role: "delivery" },
    });
  } catch (err) {
    next(err);
  }
};
