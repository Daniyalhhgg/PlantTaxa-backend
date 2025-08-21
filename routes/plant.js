// backend/routes/plant.js
const express = require("express");
const router = express.Router();
const Plant = require("../models/Plant");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ uploads directory backend root pe ensure karo
const uploadsDir = path.join(__dirname, "../uploads/plants");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
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

    // return absolute image url
    const updatedPlants = plants.map((plant) => ({
      ...plant.toObject(),
      imageUrl: plant.imageUrl
        ? plant.imageUrl.startsWith("http")
          ? plant.imageUrl
          : `${req.protocol}://${req.get("host")}${plant.imageUrl}`
        : "",
    }));

    res.json(updatedPlants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD new plant with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;

    // ✅ full URL save
    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/plants/${req.file.filename}`
      : "";

    const plant = new Plant({ name, price, description, imageUrl });
    await plant.save();

    res.json({ message: "Plant added successfully", plant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
