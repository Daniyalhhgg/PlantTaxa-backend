// server/routes/upload.js
import express from "express";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // local uploads folder

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const imageUrl = `/uploads/${req.file.filename}`; // serve static folder later
  res.json({ url: imageUrl });
});

export default router;
