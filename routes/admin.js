// routes/admin.js

const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { getAllUsers, deleteUser, updateUser } = require('../controllers/adminController');

router.get('/users', protect, isAdmin, getAllUsers);
router.delete('/users/:id', protect, isAdmin, deleteUser);
router.put('/users/:id', protect, isAdmin, updateUser); // 👈 add this

module.exports = router;
