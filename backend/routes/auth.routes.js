const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

// Models
const User = require("../models/user.model");
const Restaurant = require("../models/restaurant.model");
const Admin = require("../models/admin.model");

// Environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

// User Signup
router.post(
  "/user/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("gender").notEmpty().withMessage("Gender is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { name, email, password, phone, gender } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        gender,
      });

      const token = jwt.sign({ id: user._id, role: "user" }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(201).json({ user, token, role: "user" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// User Login
router.post(
  "/user/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ message: "Invalid credentials" });

      if (user.isBlocked)
        return res
          .status(403)
          .json({ message: `User is blocked: ${user.blockReason}` });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id, role: "user" }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).json({ user, token, role: "user" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// Restaurant Signup
router.post(
  "/restaurant/signup",
  [
    body("restaurantId").notEmpty().withMessage("Restaurant ID is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("address").notEmpty().withMessage("Address is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { restaurantId, name, email, password, phone, address } = req.body;

      const existingRestaurant = await Restaurant.findOne({
        $or: [{ email }, { restaurantId: Number(restaurantId) }],
      });

      if (existingRestaurant) {
        return res.status(400).json({
          message: "Restaurant with this Email or Restaurant ID already exists",
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
      });

      const token = jwt.sign(
        { id: restaurant._id, role: "restaurant" },
        JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.status(201).json({ restaurant, token, role: "restaurant" });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          message: "Restaurant with this Email or Restaurant ID already exists",
        });
      }

      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// Restaurant Login
router.post(
  "/restaurant/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;

      const restaurant = await Restaurant.findOne({ email });
      if (!restaurant)
        return res.status(400).json({ message: "Invalid credentials" });

      if (restaurant.isBlocked) {
        return res.status(403).json({
          message: `Restaurant is blocked: ${restaurant.blockReason}`,
        });
      }

      const isMatch = await bcrypt.compare(password, restaurant.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: restaurant._id, role: "restaurant" },
        JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.status(200).json({ restaurant, token, role: "restaurant" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// Admin Login
router.post(
  "/admin/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;

      const admin = await Admin.findOne({ email });
      if (!admin)
        return res.status(400).json({ message: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: admin._id, role: "admin" }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).json({ admin, token, role: "admin" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }
);

module.exports = router;
