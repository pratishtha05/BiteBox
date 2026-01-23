const Restaurant = require("../models/restaurant.model");
const MenuItem = require("../models/menu.model");
const Contact = require("../models/contact.model");
const Deal = require("../models/deal.model");

const transporter = require("../utils/mailer");

// Categories Listing
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Restaurant.aggregate([
      { $match: { isBlocked: false } },
      { $unwind: "$categories" },
      {
        $group: {
          _id: "$categories",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      categories: categories.map((c) => ({
        id: c._id.replace(/\s+/g, "-"),
        name: c._id,
        count: c.count,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// Restaurants Listing
exports.getRestaurants = async (req, res, next) => {
  try {
    const filter = { isBlocked: false };

    if (req.query.category) {
      filter.categories = req.query.category
        .replace(/-/g, " ")
        .toLowerCase()
        .trim();
    }

    const restaurants = await Restaurant.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });
    const restaurantsWithImages = restaurants.map(attachImageUrl);

    res.json({
      success: true,
      data: {
        count: restaurants.length,
        restaurants: restaurantsWithImages,
      },
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

// Search across Restaurants, Menu Items, and Categories
exports.search = async (req, res, next) => {
  try {
    const query = req.query.q?.toLowerCase().trim();

    if (!query) {
      return res.json({
        success: true,
        data: { restaurants: [], foods: [], categories: [] },
      });
    }

    const [restaurantsByName, restaurantsByCategory, foods] = await Promise.all([
      Restaurant.find({
        isBlocked: false,
        name: { $regex: query, $options: "i" },
      }),
      Restaurant.find({
        isBlocked: false,
        categories: { $regex: query, $options: "i" },
      }),
      MenuItem.find({
        name: { $regex: query, $options: "i" },
        isAvailable: true,
        isDeleted: false,
      }).populate("restaurant", "name image categories"),
    ]);

    // 1. Process Restaurants: Merge results and attach image URLs
    const restaurantMap = new Map();
    [...restaurantsByName, ...restaurantsByCategory].forEach((r) => {
      // Use helper here
      restaurantMap.set(r._id.toString(), attachImageUrl(r));
    });

    // 2. Process Foods: Attach image URLs for both the food and its parent restaurant
    const processedFoods = foods.map((item) => {
      const foodObj = attachImageUrl(item);
      
      // If the restaurant field is populated, attach its image URL too
      if (foodObj.restaurant) {
        foodObj.restaurant = attachImageUrl(foodObj.restaurant);
      }
      return foodObj;
    });

    // 3. Process Categories
    const categories = [
      ...new Set(restaurantsByCategory.flatMap((r) => r.categories)),
    ].filter((cat) => cat.toLowerCase().includes(query));

    res.json({
      success: true,
      data: {
        restaurants: Array.from(restaurantMap.values()),
        foods: processedFoods,
        categories,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Public Deals
exports.getActiveDeals = async (req, res, next) => {
  try {
    const now = new Date();

    // Deactivate expired deals
    await Deal.updateMany(
      { isActive: true, validTill: { $lt: now } },
      { $set: { isActive: false } }
    );

    // Fetch active deals
    const deals = await Deal.find({
      isActive: true,
      $or: [{ validTill: null }, { validTill: { $gte: now } }],
    }).sort({ createdAt: -1 });

    // Attach full image URLs
    const dealsWithImages = deals.map(attachImageUrl);

    res.json({
      success: true,
      data: dealsWithImages,
    });
  } catch (err) {
    next(err);
  }
};

// Contact Form Submission
exports.submitContactForm = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const contact = await Contact.create({ name, email, message });

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

    await transporter.sendMail({
      from: `"Support Team" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: "Thank you for contacting us",
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for reaching out. Our team will contact you shortly.</p>
        <p>Best regards,<br/>Team</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Your message has been received",
      data: { contactId: contact._id },
    });
  } catch (err) {
    next(err);
  }
};
