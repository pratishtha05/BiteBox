const DeliveryPartner = require("../models/deliveryPartner.model");
const Order = require("../models/order.model");

// Available Delivery Partners
exports.getAvailablePartners = async (req, res, next) => {
  try {
    const partners = await DeliveryPartner.find({
      isAvailable: true,
      isBlocked: false,
    }).select("name phone");

    res.json({
      success: true,
      data: partners,
    });
  } catch (err) {
    next(err);
  }
};


// Assigned Delivery Partners
exports.getAssignedPartners = async (req, res, next) => {
  try {
    const orders = await Order.find({
      restaurant: req.auth.id,
      deliveryPartner: { $ne: null },
    })
      .populate("deliveryPartner", "name phone email")
      .lean();

    const uniquePartners = [];
    const seen = new Set();

    for (const order of orders) {
      const dp = order.deliveryPartner;
      if (dp && !seen.has(dp._id.toString())) {
        seen.add(dp._id.toString());
        uniquePartners.push(dp);
      }
    }

    res.json({
      success: true,
      data: uniquePartners,
    });
  } catch (err) {
    next(err);
  }
};


// Orders assigned to a Delivery Partner
exports.getPartnerOrders = async (req, res, next) => {
  try {
    const { partnerId } = req.params;

    const orders = await Order.find({
      restaurant: req.auth.id,
      deliveryPartner: partnerId,
    })
      .populate("customer", "name phone")
      .select("items status deliveryStatus totalAmount createdAt")
      .lean();

    res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};
