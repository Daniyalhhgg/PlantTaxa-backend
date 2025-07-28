const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Validate Environment Variables
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not defined in .env");
  process.exit(1);
}

// Middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cors());

// Debug logger
app.use((req, res, next) => {
  console.log(`📡 Request: ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Route Imports
const authRoutes = require("./routes/auth");
const chatbotRoutes = require("./routes/chatbot");
const forumRoutes = require("./routes/forum");
const profileRoutes = require("./routes/profile");
const climateRoutes = require("./routes/climate");
const contactRoutes = require("./routes/contact");
const adminRoutes = require("./routes/admin"); // ✅ NEW
const diseaseRoutes = require('./routes/disease');


// Route Middlewares
app.use("/api/auth", authRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/climate", climateRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes); // ✅ NEW
app.use('/api/disease', diseaseRoutes);


// Root Endpoint
app.get("/", (req, res) => {
  res.send("🌱 PlantTaxa Backend is Running...");
});

// 404 Handler
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: "❌ Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(`❌ Server error: ${err.message}`, err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
