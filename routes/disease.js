const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { handleDiseaseDetection } = require("../controllers/diseaseController"); // ✅ make sure this is correct

// ✅ Set up multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure 'uploads/' folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// ✅ POST /api/disease/upload
router.post("/upload", upload.single("image"), handleDiseaseDetection); // 🔥 This line caused your error — now fixed

module.exports = router;
