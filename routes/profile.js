const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware"); // ✅ Correct import

const { getProfile, updateProfile } = require("../controllers/profileController");

router.get("/", protect, getProfile);       // ✅ Use protect
router.put("/", protect, updateProfile);    // ✅ Use protect

module.exports = router;
