const Order = require("../models/order.model");
const MenuItem = require("../models/menu.model");


// User Order Management
exports.createOrder = async (req, res, next) => {
  try {
    const { restaurantId, items, totalAmount } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    const menuItems = await MenuItem.find({
      _id: { $in: items.map((i) => i.menuItem) },
    });

    const enrichedItems = items.map((item) => {
      const menu = menuItems.find(
        (m) => m._id.toString() === item.menuItem
      );

      return {
        menuItem: item.menuItem,
        name: menu.name,
        price: menu.price,
        image: menu.image,
        quantity: item.quantity,
      };
    });

    const order = await Order.create({
      customer: req.auth.id,
      restaurant: restaurantId,
      items: enrichedItems,
      totalAmount,
      status: "placed",
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.auth.id })
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

// Restaurant Order Management
exports.getRestaurantOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ restaurant: req.auth.id })
      .populate("customer", "name")
      .populate("deliveryPartner", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const VALID_FLOW = [
      "placed",
      "accepted",
      "preparing",
      "out for delivery",
      "completed",
    ];

    const order = await Order.findOne({
      _id: req.params.orderId,
      restaurant: req.auth.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (["completed", "cancelled"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order can no longer be updated",
      });
    }

    if (status === "cancelled") {
      order.status = "cancelled";
      await order.save();
      return res.json({ success: true, data: order });
    }

    const currentIndex = VALID_FLOW.indexOf(order.status);
    const nextStatus = VALID_FLOW[currentIndex + 1];

    if (status !== nextStatus) {
      return res.status(400).json({
        success: false,
        message: `Invalid transition from ${order.status} to ${status}`,
      });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

exports.assignDeliveryPartner = async (req, res, next) => {
  try {
    const { deliveryPartnerId } = req.body;

    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, restaurant: req.auth.id },
      {
        deliveryPartner: deliveryPartnerId,
        deliveryStatus: "assigned",
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// Delivery Partner Order Management
exports.getDeliveryOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      deliveryPartner: req.auth.id,
    })
      .populate("restaurant", "name address")
      .populate("customer", "name phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

exports.updateDeliveryStatus = async (req, res, next) => {
  try {
    const { deliveryStatus } = req.body;

    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, deliveryPartner: req.auth.id },
      { deliveryStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// General Order Management
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("restaurant", "name address");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      req.auth.role === "user" &&
      order.customer.toString() !== req.auth.id
    ) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};
