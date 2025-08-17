const express = require("express");
const router = express.Router();
const Plant = require("../models/Plant");
const multer = require("multer");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/plants"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// GET all plants
router.get("/", async (req, res) => {
  try {
    const plants = await Plant.find();
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD new plant with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, details } = req.body;
    const imageUrl = req.file ? `/uploads/plants/${req.file.filename}` : "";

    const plant = new Plant({ name, price, details, imageUrl });
    await plant.save();

    res.json({ message: "Plant added successfully", plant });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
