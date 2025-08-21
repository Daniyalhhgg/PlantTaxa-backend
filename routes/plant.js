// routes/plant.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const Plant = require("../models/Plant");

const router = express.Router();

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/plants"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ Create Plant
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, details } = req.body;

    const plant = new Plant({
      name,
      price,
      description: details,
      imageUrl: req.file ? `/uploads/plants/${req.file.filename}` : null,
    });

    await plant.save();
    res.status(201).json(plant);
  } catch (err) {
    console.error("❌ Error saving plant:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get Plants
router.get("/", async (req, res) => {
  try {
    const plants = await Plant.find();
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
