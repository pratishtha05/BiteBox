const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurant.model");
const MenuItem = require("../models/menu.model");
const Contact = require("../models/contact.model");
const transporter = require("../utils/mailer");

router.get("/categories", async (req, res) => {
  try {
    const categories = await Restaurant.aggregate([
      {
        $match: { isBlocked: false }
      },
      {
        $unwind: "$categories"
      },
      {
        $group: {
          _id: "$categories",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      categories: categories.map(c => ({
        id: c._id.replace(/\s+/g, "-"),
        name: c._id,
        count: c.count
      }))
    });
  } catch (err) {
    console.error("Category fetch error:", err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

router.get("/restaurants", async (req, res) => {
  try {
    const filter = { isBlocked: false };

    if (req.query.category) {
      filter.categories = req.query.category.toLowerCase().trim();
    }

    const restaurants = await Restaurant.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    console.error("Public restaurants fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q?.toLowerCase().trim();
    if (!query) {
      return res.json({
        restaurants: [],
        foods: [],
        categories: [],
      });
    }

    /* 1️⃣ Restaurants by name */
    const restaurantsByName = await Restaurant.find({
      isBlocked: false,
      name: { $regex: query, $options: "i" },
    });

    /* 2️⃣ Restaurants by category */
    const restaurantsByCategory = await Restaurant.find({
      isBlocked: false,
      categories: { $regex: query, $options: "i" },
    });

    /* 3️⃣ Food items */
    const foods = await MenuItem.find({
      name: { $regex: query, $options: "i" },
      isAvailable: true,
      isDeleted: false,
    }).populate("restaurant", "name image categories");

    /* 4️⃣ Merge restaurants (remove duplicates) */
    const restaurantMap = new Map();
    [...restaurantsByName, ...restaurantsByCategory].forEach((r) =>
      restaurantMap.set(r._id.toString(), r)
    );

    /* 5️⃣ Unique category matches */
    const categories = [...new Set(
      restaurantsByCategory.flatMap(r => r.categories)
    )].filter(cat => cat.toLowerCase().includes(query));

    res.json({
      restaurants: Array.from(restaurantMap.values()),
      foods,
      categories,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
});


/* ---------------- PUBLIC DEALS ---------------- */
router.get("/deals", async (req, res) => {
  const now = new Date();

  // 🔴 Auto-expire outdated deals
  await Deal.updateMany(
    {
      isActive: true,
      validTill: { $lt: now },
    },
    {
      $set: { isActive: false },
    }
  );

  // ✅ Fetch only active + valid deals
  const deals = await Deal.find({
    isActive: true,
    $or: [{ validTill: null }, { validTill: { $gte: now } }],
  }).sort({ createdAt: -1 });

  res.json(deals);
});

/**
 * GET menu for users
 */
router.get("/:restaurantId", async (req, res) => {
  const items = await MenuItem.find({
    restaurant: req.params.restaurantId,
    isAvailable: true,
    isDeleted: false,
  });

  res.json(items);
});

router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 1️⃣ Save to DB
    const newContact = await Contact.create({ name, email, message });

    // 2️⃣ Email to Admin
    await transporter.sendMail({
      from: `"Contact Form" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Contact Form Submission",
      html: `
        <h3>New Message Received</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br/>${message}</p>
      `,
    });

    // 3️⃣ Thank-you Email to User
    await transporter.sendMail({
      from: `"Support Team" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: "Thank you for contacting us",
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for reaching out to us. We have received your message and our team will contact you shortly.</p>
        <p>Best regards,<br/>Team</p>
      `,
    });

    res.status(201).json({
      message: "Your message has been received. We'll get back to you soon!",
      contactId: newContact._id,
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});


const Deal = require("../models/deal.model");

module.exports = router;
