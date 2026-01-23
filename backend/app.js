const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/admin", require("./routes/admin.routes"));
app.use("/api/v1/user", require("./routes/user.routes"));
app.use("/api/v1/restaurant", require("./routes/restaurant.routes"));
app.use("/api/v1/menu", require("./routes/menu.routes"));
app.use("/api/v1/orders", require("./routes/order.routes"));
app.use("/api/v1/cart", require("./routes/cart.routes"));
app.use("/api/v1/delivery-partners", require("./routes/delivery.routes"));
app.use("/api/v1/public", require("./routes/public.routes"));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
