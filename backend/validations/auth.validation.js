const { body } = require("express-validator");

exports.userSignup = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("phone").notEmpty().withMessage("Phone is required"),
  body("gender").notEmpty().withMessage("Gender is required"),
];

exports.login = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];
