const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  createOrder, getMyOrders, getAllOrders, updateOrderStatus
} = require('../controllers/orderController');

const userRouter = express.Router();
userRouter.post('/', protect, createOrder);
userRouter.get('/my', protect, getMyOrders);

const adminRouter = express.Router();
adminRouter.get('/', protect, adminOnly, getAllOrders);
adminRouter.patch('/:id', protect, adminOnly, updateOrderStatus);

module.exports = { userOrderRouter: userRouter, adminOrderRouter: adminRouter };
