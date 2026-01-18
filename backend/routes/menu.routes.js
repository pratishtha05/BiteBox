const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload");

const MenuItem = require("../models/menu.model");


// GET logged-in restaurant menu
router.get("/", auth, async (req, res) => {
  if (req.auth.role !== "restaurant")
    return res.status(403).json({ message: "Forbidden" });

  const items = await MenuItem.find({
    restaurant: req.auth.id,
    isDeleted: false,
  }).sort({ createdAt: -1 });

  res.json(items);
});

// CREATE menu item
router.post(
  "/createMenuItem",
  auth,
  upload.single("image"),
  async (req, res) => {
    if (req.auth.role !== "restaurant")
      return res.status(403).json({ message: "Forbidden" });

    const item = await MenuItem.create({
      ...req.body,
      image: req.file ? `/uploads/${req.file.filename}` : "",
      restaurant: req.auth.id,
    });

    res.status(201).json({
      ...item.toObject(),
      image: item.image ? `${process.env.SERVER_URL}${item.image}` : "",
    });
  }
);

// UPDATE menu item
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  if (req.auth.role !== "restaurant")
    return res.status(403).json({ message: "Forbidden" });

  const updateData = { ...req.body };
  if (req.file) {
    updateData.image = `/uploads/${req.file.filename}`;
  }

  const item = await MenuItem.findOneAndUpdate(
    { _id: req.params.id, restaurant: req.auth.id },
    updateData,
    { new: true }
  );

  res.json({
    ...item.toObject(),
    image: item.image ? `${process.env.SERVER_URL}${item.image}` : "",
  });
});

// SOFT DELETE menu item
router.delete("/:id", auth, async (req, res) => {
  await MenuItem.findOneAndUpdate(
    { _id: req.params.id, restaurant: req.auth.id },
    { isDeleted: true }
  );

  res.json({ message: "Menu item removed" });
});


// GET menu for a specific restaurant
router.get("/restaurant/:restaurantId", async (req, res) => {
  const items = await MenuItem.find({
    restaurant: req.params.restaurantId,
    isAvailable: true,
    isDeleted: false,
  });

  res.json(items);
});

module.exports = router;
