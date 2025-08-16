// controllers/orderController.js
const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const { products, total } = req.body;
    const order = await Order.create({
      user: req.user.id,
      products,
      total,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createOrder, getOrders };
