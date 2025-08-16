const express = require("express");
const router = express.Router();
const { createOrder, getOrders } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// Create order
router.post("/", protect, createOrder);

// Get user orders
router.get("/", protect, getOrders);

module.exports = router;
