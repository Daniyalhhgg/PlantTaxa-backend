const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");
const { addPlant, getAllPlants } = require("../controllers/plantController");

// Public route: anyone can fetch plants
router.get("/", getAllPlants);

// Admin route: only admins can add plants
router.post("/", protect, isAdmin, addPlant);

module.exports = router;
