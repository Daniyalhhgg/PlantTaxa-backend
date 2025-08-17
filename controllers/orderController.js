const Order = require('../models/Order');
const Plant = require('../models/Plant');

// USER: place order
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body; // [{ plantId, quantity }]
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items' });
    }

    // Load plants & validate stock
    const plantIds = items.map(i => i.plantId);
    const plants = await Plant.find({ _id: { $in: plantIds }, isActive: true });

    const pricedItems = [];
    let total = 0;

    for (const it of items) {
      const p = plants.find(x => String(x._id) === String(it.plantId));
      if (!p) return res.status(400).json({ message: 'Plant not found' });
      if (p.stock < it.quantity) return res.status(400).json({ message: `Insufficient stock for ${p.name}` });

      pricedItems.push({ plant: p._id, quantity: it.quantity, priceAtPurchase: p.price });
      total += p.price * it.quantity;
    }

    // Decrement stock
    for (const it of items) {
      await Plant.findByIdAndUpdate(it.plantId, { $inc: { stock: -it.quantity } });
    }

    const order = await Order.create({
      userId: req.user._id,
      items: pricedItems,
      total,
      status: 'pending',
    });

    res.status(201).json(order);
  } catch (e) {
    res.status(400).json({ message: 'Order failed', error: e.message });
  }
};

// USER: my orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.plant', 'name image price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// ADMIN: all orders
exports.getAllOrders = async (_req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email')
      .populate('items.plant', 'name image price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body; // pending/processing/shipped/completed/cancelled
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('userId', 'name email')
      .populate('items.plant', 'name image price');

    if (!order) return res.status(404).json({ message: 'Not found' });
    res.json(order);
  } catch {
    res.status(400).json({ message: 'Update failed' });
  }
};
